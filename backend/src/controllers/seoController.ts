import { Request, Response } from 'express';
import { SEOConfig } from '../models/SEOConfig';
import { sendSuccess } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getSEOByPage = async (req: Request, res: Response): Promise<void> => {
  const { page } = req.params;

  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning default SEO metadata', {
      page,
      title: 'Yasin Laptop Hub | Quality Laptops in Lakki Marwat',
      description: 'Find premium laptops and computer accessories in Lakki Marwat, KPK.',
      keywords: ['laptops', 'Lakki Marwat', 'used laptops'],
      noIndex: false,
    });
    return;
  }

  const config = await SEOConfig.findOne({ page: page.toLowerCase() }).lean();
  sendSuccess(res, 'SEO config fetched', config);
};
