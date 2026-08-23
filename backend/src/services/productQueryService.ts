import { FilterQuery } from 'mongoose';
import { IProductDocument, Product } from '../models/Product';
import { Brand } from '../models/Brand';
import { Category } from '../models/Category';
import { UseCase } from '../models/UseCase';
import { PaginatedResponse } from '../types';

export interface ProductQueryParams {
  search?: string;
  q?: string;
  brand?: string;
  category?: string;
  useCase?: string;
  productType?: string;
  processor?: string;
  generation?: string;
  ram?: string;
  storage?: string;
  displaySize?: string;
  graphics?: string;
  condition?: string;
  stockStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  bestDeal?: string;
  latestArrival?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export const productQueryService = {
  buildFilterQuery: async (params: ProductQueryParams): Promise<FilterQuery<IProductDocument>> => {
    const filter: FilterQuery<IProductDocument> = { isDeleted: false };

    // Product Type filter (e.g. laptop, chromebook, accessory)
    const productType = typeof params.productType === 'string' ? params.productType.toLowerCase().trim() : undefined;
    if (productType && ['laptop', 'chromebook', 'accessory'].includes(productType)) {
      filter.productType = productType;
    }

    // Stock Status filter (available, sold_out)
    const stockStatus = typeof params.stockStatus === 'string' ? params.stockStatus.toLowerCase().trim() : undefined;
    if (stockStatus && ['available', 'sold_out'].includes(stockStatus)) {
      filter.stockStatus = stockStatus;
    }

    // Condition filter (support multi-select comma-separated)
    if (typeof params.condition === 'string' && params.condition.trim()) {
      const conditions = params.condition
        .split(',')
        .map((c) => c.trim().toLowerCase())
        .filter((c) => ['new', 'like-new', 'excellent', 'very-good', 'good', 'fair', 'refurbished', 'used'].includes(c));
      if (conditions.length > 0) {
        filter.condition = { $in: conditions };
      }
    }

    // Brand filter (support IDs or slugs, comma-separated OR logic within brand group)
    if (typeof params.brand === 'string' && params.brand.trim()) {
      const brandItems = params.brand
        .split(',')
        .map((b) => b.trim().replace(/[^a-zA-Z0-9_-]/g, ''))
        .filter(Boolean);

      if (brandItems.length > 0) {
        const matchedBrands = await Brand.find({
          $or: [
            { slug: { $in: brandItems.map((b) => b.toLowerCase()) } },
            { name: { $in: brandItems.map((b) => new RegExp(`^${b}$`, 'i')) } },
            { _id: { $in: brandItems.filter((b) => b.match(/^[0-9a-fA-F]{24}$/)) } },
          ],
        }).select('_id');

        if (matchedBrands.length > 0) {
          filter.brand = { $in: matchedBrands.map((b) => b._id) };
        } else {
          const validIds = brandItems.filter((b) => b.match(/^[0-9a-fA-F]{24}$/));
          if (validIds.length > 0) {
            filter.brand = { $in: validIds };
          }
        }
      }
    }

    // Category filter (support slugs or IDs, comma-separated OR logic within category group)
    if (typeof params.category === 'string' && params.category.trim()) {
      const catItems = params.category
        .split(',')
        .map((c) => c.trim().replace(/[^a-zA-Z0-9_-]/g, ''))
        .filter(Boolean);

      if (catItems.length > 0) {
        const matchedCats = await Category.find({
          $or: [
            { slug: { $in: catItems.map((c) => c.toLowerCase()) } },
            { name: { $in: catItems.map((c) => new RegExp(`^${c}$`, 'i')) } },
            { _id: { $in: catItems.filter((c) => c.match(/^[0-9a-fA-F]{24}$/)) } },
          ],
        }).select('_id');

        if (matchedCats.length > 0) {
          filter.categories = { $in: matchedCats.map((c) => c._id) };
        }
      }
    }

    // Use Case filter (support slugs or IDs)
    if (typeof params.useCase === 'string' && params.useCase.trim()) {
      const useCaseItems = params.useCase
        .split(',')
        .map((u) => u.trim().replace(/[^a-zA-Z0-9_-]/g, ''))
        .filter(Boolean);

      if (useCaseItems.length > 0) {
        const matchedUseCases = await UseCase.find({
          $or: [
            { slug: { $in: useCaseItems.map((u) => u.toLowerCase()) } },
            { name: { $in: useCaseItems.map((u) => new RegExp(`^${u}$`, 'i')) } },
            { _id: { $in: useCaseItems.filter((u) => u.match(/^[0-9a-fA-F]{24}$/)) } },
          ],
        }).select('_id');

        if (matchedUseCases.length > 0) {
          filter.useCases = { $in: matchedUseCases.map((u) => u._id) };
        }
      }
    }

    // Price Range Filter with numeric validation and boundary safety
    const minPriceNum = Number(params.minPrice);
    const maxPriceNum = Number(params.maxPrice);
    const hasMin = !isNaN(minPriceNum) && minPriceNum >= 0;
    const hasMax = !isNaN(maxPriceNum) && maxPriceNum >= 0;

    if (hasMin && hasMax && maxPriceNum >= minPriceNum) {
      filter.price = { $gte: minPriceNum, $lte: maxPriceNum };
    } else if (hasMin) {
      filter.price = { $gte: minPriceNum };
    } else if (hasMax) {
      filter.price = { $lte: maxPriceNum };
    }

    // Specifications Structured Filters (Processor, Generation, RAM, Storage, Display, Graphics)
    if (typeof params.processor === 'string' && params.processor.trim()) {
      const procList = params.processor
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (procList.length > 0) {
        filter['specs.processor'] = { $in: procList };
      }
    }

    if (typeof params.generation === 'string' && params.generation.trim()) {
      const genList = params.generation
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)
        .map((g) => new RegExp(g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (genList.length > 0) {
        filter['specs.generation'] = { $in: genList };
      }
    }

    if (typeof params.ram === 'string' && params.ram.trim()) {
      const ramList = params.ram
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => new RegExp(r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (ramList.length > 0) {
        filter['specs.ram'] = { $in: ramList };
      }
    }

    if (typeof params.storage === 'string' && params.storage.trim()) {
      const storageList = params.storage
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (storageList.length > 0) {
        filter['specs.storage'] = { $in: storageList };
      }
    }

    if (typeof params.displaySize === 'string' && params.displaySize.trim()) {
      const displayList = params.displaySize
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => new RegExp(d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (displayList.length > 0) {
        filter['specs.displaySize'] = { $in: displayList };
      }
    }

    if (typeof params.graphics === 'string' && params.graphics.trim()) {
      const graphicsList = params.graphics
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean)
        .map((g) => new RegExp(g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      if (graphicsList.length > 0) {
        filter['specs.graphics'] = { $in: graphicsList };
      }
    }

    // Flags
    if (params.featured === 'true') filter.featured = true;
    if (params.bestDeal === 'true') filter.bestDeal = true;
    if (params.latestArrival === 'true') filter.latestArrival = true;

    // Search Query (support both ?search= and ?q=)
    const rawSearch = params.search || params.q;
    if (typeof rawSearch === 'string' && rawSearch.trim().length > 0) {
      const searchTerms = rawSearch.trim();
      const sanitized = searchTerms.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitized, 'i');

      const brandMatches = await Brand.find({ name: searchRegex }).select('_id');
      const brandIds = brandMatches.map((b) => b._id);

      filter.$or = [
        { name: searchRegex },
        { laptopModel: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { 'specs.processor': searchRegex },
        { 'specs.generation': searchRegex },
        { 'specs.ram': searchRegex },
        { 'specs.storage': searchRegex },
        { 'specs.graphics': searchRegex },
        { 'specs.displaySize': searchRegex },
        { brand: { $in: brandIds } },
      ];
    }

    return filter;
  },

  getSortOption: (sortParam?: string): Record<string, 1 | -1> => {
    switch (sortParam) {
      case 'price_asc':
      case 'price-asc':
        return { price: 1, _id: 1 };
      case 'price_desc':
      case 'price-desc':
        return { price: -1, _id: 1 };
      case 'oldest':
        return { createdAt: 1, _id: 1 };
      case 'newest':
      case 'latest':
        return { createdAt: -1, _id: 1 };
      case 'featured':
        return { featured: -1, createdAt: -1, _id: 1 };
      case 'best_deal':
      case 'best-deal':
        return { bestDeal: -1, createdAt: -1, _id: 1 };
      case 'name_asc':
      case 'name-asc':
        return { name: 1, _id: 1 };
      case 'name_desc':
      case 'name-desc':
        return { name: -1, _id: 1 };
      default:
        return { createdAt: -1, _id: 1 };
    }
  },

  executeProductQuery: async (params: ProductQueryParams): Promise<PaginatedResponse<unknown>> => {
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(params.limit || '12', 10)));
    const skip = (page - 1) * limit;

    const filter = await productQueryService.buildFilterQuery(params);
    const sort = productQueryService.getSortOption(params.sort);

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate('brand', 'name slug logo')
        .populate('categories', 'name slug')
        .populate('useCases', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  getFilterMetadata: async (productType = 'laptop') => {
    const [brands, categories, useCases] = await Promise.all([
      Brand.find({ isActive: true }).select('name slug logo').sort({ sortOrder: 1, name: 1 }).lean(),
      Category.find({ isActive: true }).select('name slug icon').sort({ sortOrder: 1, name: 1 }).lean(),
      UseCase.find({ isActive: true }).select('name slug icon').sort({ sortOrder: 1, name: 1 }).lean(),
    ]);

    const processors = [
      'Intel Core i3',
      'Intel Core i5',
      'Intel Core i7',
      'Intel Core i9',
      'AMD Ryzen 3',
      'AMD Ryzen 5',
      'AMD Ryzen 7',
      'AMD Ryzen 9',
      'Apple M1',
      'Apple M2',
      'Apple M3',
      'Apple M4',
    ];

    const generations = [
      '6th Gen',
      '7th Gen',
      '8th Gen',
      '9th Gen',
      '10th Gen',
      '11th Gen',
      '12th Gen',
      '13th Gen',
      '14th Gen',
      '15th Gen',
    ];

    const ramOptions = ['4GB', '8GB', '16GB', '32GB', '64GB', '128GB'];
    const storageOptions = ['128GB', '256GB', '512GB', '1TB', '2TB'];
    const displaySizes = ['13"', '14"', '15.6"', '16"', '17"'];
    const graphicsOptions = ['Integrated', 'Intel Iris Xe', 'NVIDIA GeForce GTX', 'NVIDIA GeForce RTX', 'AMD Radeon'];
    const conditions = ['new', 'like-new', 'excellent', 'very-good', 'good', 'fair', 'refurbished', 'used'];

    const priceRanges = [
      { label: 'Under Rs. 20,000', min: 0, max: 20000 },
      { label: 'Rs. 20,000 – Rs. 30,000', min: 20000, max: 30000 },
      { label: 'Rs. 30,000 – Rs. 40,000', min: 30000, max: 40000 },
      { label: 'Rs. 40,000 – Rs. 50,000', min: 40000, max: 50000 },
      { label: 'Rs. 50,000 – Rs. 75,000', min: 50000, max: 75000 },
      { label: 'Rs. 75,000 – Rs. 100,000', min: 75000, max: 100000 },
      { label: 'Above Rs. 100,000', min: 100000, max: 9999999 },
    ];

    return {
      brands,
      categories,
      useCases,
      processors,
      generations,
      ramOptions,
      storageOptions,
      displaySizes,
      graphicsOptions,
      conditions,
      priceRanges,
      productType,
    };
  },
};
