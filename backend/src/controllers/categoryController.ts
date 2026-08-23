import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning category list shell', []);
    return;
  }

  const categories = await Category.find({ isActive: true })
    .populate('parent', 'name slug')
    .sort({ sortOrder: 1, name: 1 })
    .lean();
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  sendSuccess(res, 'Categories fetched successfully', categories);
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; category lookup ready', null);
    return;
  }

  const category = await Category.findOne({ slug: slug.toLowerCase(), isActive: true })
    .populate('parent', 'name slug')
    .lean();

  if (!category) {
    sendError(res, `Category '${slug}' not found`, undefined, 404);
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  sendSuccess(res, 'Category fetched successfully', category);
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const data = req.body;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const category = new Category(data);
    await category.save();
    sendSuccess(res, 'Category created successfully', category, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create category';
    sendError(res, msg, undefined, 400);
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const category = await Category.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!category) {
      sendError(res, 'Category not found', undefined, 404);
      return;
    }
    sendSuccess(res, 'Category updated successfully', category);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update category';
    sendError(res, msg, undefined, 400);
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const category = await Category.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
  if (!category) {
    sendError(res, 'Category not found', undefined, 404);
    return;
  }
  sendSuccess(res, 'Category archived successfully', { id });
};
