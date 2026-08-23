import { Request, Response } from 'express';
import { BusinessSettings } from '../models/BusinessSettings';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning default settings shell', {
      businessName: 'Yasin Laptop Hub',
      ownerName: 'Yasin Wahab',
      address: { city: 'Lakki Marwat', province: 'Khyber Pakhtunkhwa', country: 'Pakistan' },
    });
    return;
  }

  let settings = await BusinessSettings.findOne().lean();
  if (!settings) {
    settings = await BusinessSettings.create({
      businessName: 'Yasin Laptop Hub',
      ownerName: 'Yasin Wahab',
      address: {
        street: 'Main Bazaar',
        city: 'Lakki Marwat',
        district: 'Lakki Marwat',
        province: 'Khyber Pakhtunkhwa',
        country: 'Pakistan',
      },
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  sendSuccess(res, 'Business settings fetched successfully', settings);
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to update settings', undefined, 503);
    return;
  }

  try {
    const settings = await BusinessSettings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    sendSuccess(res, 'Business settings updated successfully', settings);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update business settings';
    sendError(res, msg, undefined, 400);
  }
};
