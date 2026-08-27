import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { productQueryService, ProductQueryParams } from '../services/productQueryService';
import { Product, IProductDocument } from '../models/Product';
import { Accessory } from '../models/Accessory';
import { Brand } from '../models/Brand';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';
import { PaginatedResponse, IProduct } from '../types';
import { logActivity } from './activityController';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const emptyResponse: PaginatedResponse<IProduct> = {
    items: [],
    pagination: {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 12,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning empty product structure', emptyResponse);
    return;
  }

  try {
    const queryParams: ProductQueryParams = req.query as unknown as ProductQueryParams;
    const result = await productQueryService.executeProductQuery(queryParams);

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    sendSuccess(res, 'Products fetched successfully', result);
  } catch {
    sendSuccess(res, 'Fallback product list', emptyResponse);
  }
};

export const getProductFilters = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    const fallbackMetadata = await productQueryService.getFilterMetadata(String(req.query.productType || 'laptop'));
    sendSuccess(res, 'Filter metadata fetched (defaults)', fallbackMetadata);
    return;
  }

  const filterMeta = await productQueryService.getFilterMetadata(String(req.query.productType || 'laptop'));
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  sendSuccess(res, 'Filter metadata fetched successfully', filterMeta);
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; product lookup ready', null);
    return;
  }

  try {
    let product = await Product.findOne({ slug: slug.toLowerCase(), isDeleted: false })
      .populate('brand', 'name slug logo description')
      .populate('categories', 'name slug description')
      .populate('useCases', 'name slug description')
      .lean();

    if (!product) {
      const acc = (await Accessory.findOne({ slug: slug.toLowerCase(), isDeleted: { $ne: true } }).lean()) as Record<string, unknown> | null;
      if (acc) {
        const catName = (typeof acc.category === 'string' ? acc.category : 'Accessory') || 'Accessory';
        product = {
          ...acc,
          productType: 'accessory',
          brand: { name: catName, slug: 'accessories' },
          laptopModel: catName,
          categories: [{ name: catName, slug: 'accessories' }],
        } as unknown as typeof product;
      }
    }

    if (!product) {
      sendError(res, `Product not found for slug: ${slug}`, undefined, 404);
      return;
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    sendSuccess(res, 'Product fetched successfully', product);
  } catch (err) {
    sendError(res, 'Error looking up product', undefined, 400);
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate('brand', 'name slug logo')
    .populate('categories', 'name slug')
    .populate('useCases', 'name slug')
    .lean();

  if (!product) {
    sendError(res, `Product not found for ID: ${id}`, undefined, 404);
    return;
  }

  sendSuccess(res, 'Product fetched successfully', product);
};

export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  const { idOrSlug } = req.params;

  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning empty related products', []);
    return;
  }

  const isId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const targetProduct = (await Product.findOne(
    isId ? { _id: idOrSlug, isDeleted: false } : { slug: idOrSlug.toLowerCase(), isDeleted: false }
  ).lean()) as (IProductDocument & { _id: unknown }) | null;

  if (!targetProduct) {
    sendSuccess(res, 'Target product not found; returning general products', []);
    return;
  }

  const minPrice = Math.max(0, targetProduct.price * 0.7);
  const maxPrice = targetProduct.price * 1.3;

  const related = await Product.find({
    _id: { $ne: targetProduct._id },
    isDeleted: false,
    productType: targetProduct.productType,
    $or: [
      { brand: targetProduct.brand },
      { categories: { $in: targetProduct.categories } },
      { price: { $gte: minPrice, $lte: maxPrice } },
    ],
  })
    .populate('brand', 'name slug logo')
    .populate('categories', 'name slug')
    .sort({ stockStatus: 1, featured: -1, createdAt: -1 })
    .limit(4)
    .lean();

  sendSuccess(res, 'Related products fetched successfully', related);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to create product', undefined, 503);
    return;
  }

  try {
    const productData = req.body;

    if (!productData.name) {
      sendError(res, 'Product Name is required', undefined, 400);
      return;
    }

    // Auto-resolve Brand ObjectId if passed as name or string
    if (productData.brand) {
      const isObjectId = mongoose.Types.ObjectId.isValid(productData.brand) && String(productData.brand).length === 24;
      if (!isObjectId) {
        const brandName = String(productData.brand).trim();
        const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let existingBrand = await Brand.findOne({
          $or: [{ slug: brandSlug }, { name: { $regex: new RegExp(`^${brandName}$`, 'i') } }],
        });
        if (!existingBrand) {
          existingBrand = await Brand.create({
            name: brandName.toUpperCase() === 'HP' ? 'HP' : brandName.charAt(0).toUpperCase() + brandName.slice(1),
            slug: brandSlug || 'generic',
            isActive: true,
          });
        }
        productData.brand = existingBrand._id;
      }
    } else {
      // Default to HP if unspecified
      let defaultBrand = await Brand.findOne({ slug: 'hp' });
      if (!defaultBrand) {
        defaultBrand = await Brand.create({ name: 'HP', slug: 'hp', isActive: true });
      }
      productData.brand = defaultBrand._id;
    }

    if (!productData.laptopModel) {
      productData.laptopModel = productData.name;
    }

    if (!productData.description) {
      productData.description = productData.shortDescription || productData.name;
    }

    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    let finalSlug = productData.slug || `product-${Date.now()}`;
    let counter = 1;
    while (await Product.findOne({ slug: finalSlug, isDeleted: false })) {
      finalSlug = `${productData.slug}-${counter}`;
      counter++;
    }
    productData.slug = finalSlug;

    const product = new Product(productData);
    await product.save();

    await logActivity('Product Created', 'product', `Cataloged "${product.name}" at Rs. ${product.price.toLocaleString('en-PK')}`, product._id.toString());

    sendSuccess(res, 'Product created successfully', product, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Product creation failed';
    sendError(res, message, undefined, 400);
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to update product', undefined, 503);
    return;
  }

  try {
    const updates = req.body;

    // Auto-resolve Brand ObjectId if passed as name or string
    if (updates.brand) {
      const isObjectId = mongoose.Types.ObjectId.isValid(updates.brand) && String(updates.brand).length === 24;
      if (!isObjectId) {
        const brandName = String(updates.brand).trim();
        const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let existingBrand = await Brand.findOne({
          $or: [{ slug: brandSlug }, { name: { $regex: new RegExp(`^${brandName}$`, 'i') } }],
        });
        if (!existingBrand) {
          existingBrand = await Brand.create({
            name: brandName.toUpperCase() === 'HP' ? 'HP' : brandName.charAt(0).toUpperCase() + brandName.slice(1),
            slug: brandSlug || 'generic',
            isActive: true,
          });
        }
        updates.brand = existingBrand._id;
      }
    }

    if (updates.slug) {
      const existing = await Product.findOne({
        slug: updates.slug,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (existing) {
        updates.slug = `${updates.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      sendError(res, `Product not found for ID: ${id}`, undefined, 404);
      return;
    }

    await logActivity('Product Updated', 'product', `Updated "${product.name}" details / price / status`, product._id.toString());

    sendSuccess(res, 'Product updated successfully', product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Product update failed';
    sendError(res, message, undefined, 400);
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to delete product', undefined, 503);
    return;
  }

  try {
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    } else {
      product = await Product.findOneAndDelete({ slug: id });
    }

    if (!product) {
      // Also check and delete soft-deleted or matching document
      await Product.deleteMany({
        $or: [
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : []),
          { slug: id },
        ],
      });
    }

    if (product) {
      await logActivity('Product Deleted', 'product', `Deleted product "${product.name}"`, String(id));
    }

    sendSuccess(res, 'Product deleted successfully', { id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Product deletion failed';
    sendError(res, message, undefined, 400);
  }
};

export const toggleProductField = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { field, value } = req.body;

  if (!['featured', 'bestDeal', 'latestArrival', 'stockStatus', 'price'].includes(field)) {
    sendError(res, 'Invalid field toggle target', undefined, 400);
    return;
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { [field]: value } },
    { new: true }
  );

  if (!product) {
    sendError(res, 'Product not found', undefined, 404);
    return;
  }

  await logActivity(`Product ${field} changed`, 'product', `Changed ${field} of "${product.name}" to ${value}`, product._id.toString());

  sendSuccess(res, `Product ${field} updated successfully`, product);
};

export const duplicateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const original = await Product.findOne({ _id: id, isDeleted: false }).lean();
  if (!original) {
    sendError(res, 'Original product not found', undefined, 404);
    return;
  }

  const origObj = original as unknown as Record<string, unknown>;
  const clonedData: Record<string, unknown> = { ...origObj };
  delete clonedData._id;
  delete clonedData.createdAt;
  delete clonedData.updatedAt;
  delete clonedData.sku;
  clonedData.name = `${String(origObj.name || 'Laptop')} (Copy)`;
  clonedData.slug = `${String(origObj.slug || 'laptop')}-copy-${Date.now().toString().slice(-4)}`;
  clonedData.publicationStatus = 'draft';

  const newProduct = new Product(clonedData);
  await newProduct.save();

  await logActivity('Product Duplicated', 'product', `Duplicated "${String(origObj.name || 'Product')}" to create "${newProduct.name}"`, newProduct._id.toString());

  sendSuccess(res, 'Product duplicated successfully into Draft', newProduct, 201);
};

export const bulkActionProducts = async (req: Request, res: Response): Promise<void> => {
  const { ids, action, value } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    sendError(res, 'No product IDs provided', undefined, 400);
    return;
  }

  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  let updateQuery = {};
  if (action === 'mark_available') {
    updateQuery = { stockStatus: 'available' };
  } else if (action === 'mark_sold') {
    updateQuery = { stockStatus: 'sold_out' };
  } else if (action === 'archive') {
    updateQuery = { isDeleted: true, deletedAt: new Date() };
  } else if (action === 'publish') {
    updateQuery = { publicationStatus: 'published' };
  } else if (action === 'draft') {
    updateQuery = { publicationStatus: 'draft' };
  } else if (action === 'set_featured') {
    updateQuery = { featured: Boolean(value) };
  } else {
    sendError(res, 'Unknown bulk action', undefined, 400);
    return;
  }

  const result = await Product.updateMany({ _id: { $in: ids } }, { $set: updateQuery });

  await logActivity(`Bulk Action: ${action}`, 'product', `Applied ${action} across ${ids.length} product(s)`);

  sendSuccess(res, `Bulk action '${action}' applied to ${result.modifiedCount} products`, { modifiedCount: result.modifiedCount });
};
