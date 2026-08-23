import { Request, Response } from 'express';
import { Brand } from '../models/Brand';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getBrands = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning brand list shell', []);
    return;
  }

  const brands = await Brand.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  sendSuccess(res, 'Brands fetched successfully', brands);
};

export const getBrandBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; brand lookup ready', null);
    return;
  }

  const brand = await Brand.findOne({ slug: slug.toLowerCase(), isActive: true }).lean();
  if (!brand) {
    sendError(res, `Brand '${slug}' not found`, undefined, 404);
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  sendSuccess(res, 'Brand fetched successfully', brand);
};

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const data = req.body;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const brand = new Brand(data);
    await brand.save();
    sendSuccess(res, 'Brand created successfully', brand, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create brand';
    sendError(res, msg, undefined, 400);
  }
};

export const updateBrand = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const brand = await Brand.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!brand) {
      sendError(res, 'Brand not found', undefined, 404);
      return;
    }
    sendSuccess(res, 'Brand updated successfully', brand);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update brand';
    sendError(res, msg, undefined, 400);
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const brand = await Brand.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
  if (!brand) {
    sendError(res, 'Brand not found', undefined, 404);
    return;
  }
  sendSuccess(res, 'Brand archived successfully', { id });
};
