import { Request, Response } from 'express';
import { HeroMedia } from '../models/HeroMedia';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getHeroMedia = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning default slides shell', []);
    return;
  }

  const slides = await HeroMedia.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  sendSuccess(res, 'Hero slides fetched successfully', slides);
};

export const createHeroMedia = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const slide = new HeroMedia(req.body);
    await slide.save();
    sendSuccess(res, 'Hero slide created successfully', slide, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create hero slide';
    sendError(res, msg, undefined, 400);
  }
};

export const updateHeroMedia = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  try {
    const slide = await HeroMedia.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!slide) {
      sendError(res, 'Hero slide not found', undefined, 404);
      return;
    }
    sendSuccess(res, 'Hero slide updated successfully', slide);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update hero slide';
    sendError(res, msg, undefined, 400);
  }
};

export const deleteHeroMedia = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline', undefined, 503);
    return;
  }

  const slide = await HeroMedia.findByIdAndDelete(id);
  if (!slide) {
    sendError(res, 'Hero slide not found', undefined, 404);
    return;
  }
  sendSuccess(res, 'Hero slide deleted successfully', { id });
};
