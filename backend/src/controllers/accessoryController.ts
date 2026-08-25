import { Request, Response } from 'express';
import { Accessory } from '../models/Accessory';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getAccessories = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning empty accessory shell', []);
    return;
  }

  const accessories = await Accessory.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
  sendSuccess(res, 'Accessories fetched successfully', accessories);
};

export const createAccessory = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const data = req.body;

    if (!data.name || !data.name.trim()) {
      sendError(res, 'Accessory Name is required', undefined, 400);
      return;
    }

    if (!data.description || !data.description.trim()) {
      data.description = data.name;
    }

    if (!data.category) {
      data.category = 'Chargers';
    }

    let baseSlug = (data.slug || data.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!baseSlug) {
      baseSlug = `accessory-${Date.now()}`;
    }

    let finalSlug = baseSlug;
    let counter = 1;
    while (await Accessory.findOne({ slug: finalSlug, isDeleted: { $ne: true } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    data.slug = finalSlug;

    const accessory = new Accessory(data);
    await accessory.save();
    sendSuccess(res, 'Accessory created successfully', accessory, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create accessory';
    sendError(res, msg, undefined, 400);
  }
};

export const updateAccessory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const updates = req.body;

    if (updates.slug) {
      const existing = await Accessory.findOne({
        slug: updates.slug,
        _id: { $ne: id },
        isDeleted: { $ne: true },
      });
      if (existing) {
        updates.slug = `${updates.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const accessory = await Accessory.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!accessory) {
      sendError(res, 'Accessory not found', undefined, 404);
      return;
    }
    sendSuccess(res, 'Accessory updated successfully', accessory);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update accessory';
    sendError(res, msg, undefined, 400);
  }
};

export const deleteAccessory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const accessory = await Accessory.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!accessory) {
    sendError(res, 'Accessory not found', undefined, 404);
    return;
  }
  sendSuccess(res, 'Accessory archived successfully', { id });
};
