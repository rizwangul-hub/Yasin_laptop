import mongoose, { Schema, Document } from 'mongoose';
import { ICloudinaryImage } from '../types';

export interface ISEOConfigDocument extends Document {
  page: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: ICloudinaryImage;
  noIndex: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SEOImageSchema = new Schema<ICloudinaryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const SEOConfigSchema = new Schema<ISEOConfigDocument>(
  {
    page: { type: String, required: true, unique: true, trim: true, index: true }, // e.g. 'home', 'laptops', 'chromebooks', 'accessories', 'about', 'contact'
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, trim: true },
    ogImage: { type: SEOImageSchema },
    noIndex: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const SEOConfig = mongoose.models.SEOConfig || mongoose.model<ISEOConfigDocument>('SEOConfig', SEOConfigSchema);
