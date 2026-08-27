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
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  sendSuccess(res, 'Reviews fetched successfully', reviews);
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to create review', undefined, 503);
    return;
  }

  try {
    const { customerName, city, laptopPurchased, rating, comment, videoUrl, thumbnailUrl, verifiedPurchase, isFeatured, sortOrder } = req.body;

    if (!customerName || !customerName.trim() || !comment || !comment.trim()) {
      sendError(res, 'Customer name and comment are required', undefined, 400);
      return;
    }

    const review = await Review.create({
      customerName: customerName.trim(),
      city: city?.trim() || 'Lakki Marwat',
      laptopPurchased: laptopPurchased?.trim() || 'Laptop Buyer',
      rating: Number(rating) >= 1 && Number(rating) <= 5 ? Number(rating) : 5,
      comment: comment.trim(),
      videoUrl: videoUrl?.trim() || '',
      thumbnailUrl: thumbnailUrl?.trim() || '',
      verifiedPurchase: verifiedPurchase !== undefined ? Boolean(verifiedPurchase) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      sortOrder: Number(sortOrder) || 0,
      isActive: true,
    });

    sendSuccess(res, 'Review published successfully', review, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create review';
    sendError(res, msg, undefined, 400);
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to update review', undefined, 503);
    return;
  }

  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });

    if (!review) {
      sendError(res, 'Review not found', undefined, 404);
      return;
    }

    sendSuccess(res, 'Review updated successfully', review);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update review';
    sendError(res, msg, undefined, 400);
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  if (!isDatabaseConnected()) {
    sendError(res, 'Database offline; unable to delete review', undefined, 503);
    return;
  }

  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      // Also try deleting by query
      await Review.deleteMany({ _id: id });
    }

    sendSuccess(res, 'Review deleted successfully', { id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete review';
    sendError(res, msg, undefined, 400);
  }
};
