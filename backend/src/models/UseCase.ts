import mongoose, { Schema, Document } from 'mongoose';
import { ICloudinaryImage } from '../types';

export interface IUseCaseDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: ICloudinaryImage;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UseCaseImageSchema = new Schema<ICloudinaryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const UseCaseSchema = new Schema<IUseCaseDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true, index: true },
    description: { type: String, trim: true },
    image: { type: UseCaseImageSchema },
    icon: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export const UseCase = mongoose.models.UseCase || mongoose.model<IUseCaseDocument>('UseCase', UseCaseSchema);
