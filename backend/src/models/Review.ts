import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  customerName: string;
  city: string;
  laptopPurchased?: string;
  rating: number;
  comment: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  verifiedPurchase: boolean;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    customerName: { type: String, required: true, trim: true },
    city: { type: String, default: 'Lakki Marwat', trim: true },
    laptopPurchased: { type: String, trim: true, default: 'HP EliteBook Laptop' },
    rating: { type: Number, required: true, default: 5, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    videoUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    verifiedPurchase: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Review =
  mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);
