import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { isDatabaseConnected } from '../config/database';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendSuccess(res, 'Database offline; returning default reviews', []);
    return;
  }

  const query: Record<string, unknown> = { isActive: true };
  if (req.query.featured === 'true') {
    query.isFeatured = true;
  }

  const reviews = await Review.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  sendSuccess(res, 'Reviews fetched successfully', reviews);
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to create review', undefined, 503);
    return;
  }

  const { customerName, city, laptopPurchased, rating, comment, videoUrl, thumbnailUrl, verifiedPurchase, isFeatured, sortOrder } = req.body;

  if (!customerName || !comment) {
    sendError(res, 'Customer name and comment are required', undefined, 400);
    return;
  }

  const review = await Review.create({
    customerName,
    city: city || 'Lakki Marwat',
    laptopPurchased,
    rating: Number(rating) || 5,
    comment,
    videoUrl: videoUrl || '',
    thumbnailUrl: thumbnailUrl || '',
    verifiedPurchase: verifiedPurchase !== undefined ? verifiedPurchase : true,
    isFeatured: isFeatured !== undefined ? isFeatured : true,
    sortOrder: Number(sortOrder) || 0,
    isActive: true,
  });

  sendSuccess(res, 'Review created successfully', review, 201);
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to update review', undefined, 503);
    return;
  }

  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });

  if (!review) {
    sendError(res, 'Review not found', undefined, 404);
    return;
  }

  sendSuccess(res, 'Review updated successfully', review);
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to delete review', undefined, 503);
    return;
  }

  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    sendError(res, 'Review not found', undefined, 404);
    return;
  }

  sendSuccess(res, 'Review deleted successfully', { id });
};
