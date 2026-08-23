import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';
import { cloudinaryService } from '../services/cloudinaryService';
import { ENV } from '../config/env';

export const getHealth = (_req: Request, res: Response): void => {
  const dbConnected = isDatabaseConnected();
  const cloudinaryConfigured = cloudinaryService.isConfigured();

  sendSuccess(res, 'Yasin Laptop Hub API is operational', {
    status: 'online',
    environment: ENV.NODE_ENV,
    business: 'Yasin Laptop Hub',
    owner: 'Yasin Wahab',
    database: {
      connected: dbConnected,
      status: dbConnected ? 'connected' : 'disconnected',
    },
    storage: {
      provider: 'Cloudinary',
      configured: cloudinaryConfigured,
    },
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};
