import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Brand } from '../models/Brand';
import { Accessory } from '../models/Accessory';
import { sendSuccess } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning placeholder stats', {
      totalProducts: 0,
      availableProducts: 0,
      soldOutProducts: 0,
      featuredProducts: 0,
      bestDeals: 0,
      totalAccessories: 0,
      totalCategories: 0,
      totalBrands: 0,
      recentProducts: [],
    });
    return;
  }

  const [
    totalProducts,
    availableProducts,
    soldOutProducts,
    featuredProducts,
    bestDeals,
    totalAccessories,
    totalCategories,
    totalBrands,
    recentProducts,
  ] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Product.countDocuments({ isDeleted: false, stockStatus: 'available' }),
    Product.countDocuments({ isDeleted: false, stockStatus: 'sold_out' }),
    Product.countDocuments({ isDeleted: false, featured: true }),
    Product.countDocuments({ isDeleted: false, bestDeal: true }),
    Accessory.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    Brand.countDocuments({ isActive: true }),
    Product.find({ isDeleted: false })
      .populate('brand', 'name slug')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  sendSuccess(res, 'Dashboard statistics fetched successfully', {
    totalProducts,
    availableProducts,
    soldOutProducts,
    featuredProducts,
    bestDeals,
    totalAccessories,
    totalCategories,
    totalBrands,
    recentProducts,
  });
};
