import mongoose, { Schema, Document } from 'mongoose';
import { ICloudinaryImage, ProductCondition, StockStatus } from '../types';

export interface IAccessoryDocument extends Document {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  previousPrice?: number;
  condition: ProductCondition;
  stockStatus: StockStatus;
  images: ICloudinaryImage[];
  featured: boolean;
  bestDeal: boolean;
  latestArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccessoryImageSchema = new Schema<ICloudinaryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number },
    sortOrder: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const AccessorySchema = new Schema<IAccessoryDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true }, // e.g. Chargers, Bags, SSD, RAM, Stands, Mouse
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0, index: true },
    previousPrice: { type: Number, min: 0 },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'excellent', 'very-good', 'good', 'fair', 'refurbished', 'used'],
      default: 'new',
      required: true,
    },
    stockStatus: {
      type: String,
      enum: ['available', 'sold_out'],
      default: 'available',
      required: true,
      index: true,
    },
    images: { type: [AccessoryImageSchema], default: [] },
    featured: { type: Boolean, default: false, index: true },
    bestDeal: { type: Boolean, default: false, index: true },
    latestArrival: { type: Boolean, default: false, index: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

AccessorySchema.index({ name: 'text', description: 'text' });

export const Accessory = mongoose.models.Accessory || mongoose.model<IAccessoryDocument>('Accessory', AccessorySchema);
