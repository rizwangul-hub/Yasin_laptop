import mongoose, { Schema, Document } from 'mongoose';
import { ICloudinaryImage } from '../types';

export interface IBrandDocument extends Document {
  name: string;
  slug: string;
  logo?: ICloudinaryImage;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandLogoSchema = new Schema<ICloudinaryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const BrandSchema = new Schema<IBrandDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true, index: true },
    logo: { type: BrandLogoSchema },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  }
);

export const Brand = mongoose.models.Brand || mongoose.model<IBrandDocument>('Brand', BrandSchema);
