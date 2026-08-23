import mongoose, { Schema, Document, Types } from 'mongoose';
import { ICloudinaryImage } from '../types';

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: ICloudinaryImage;
  icon?: string;
  parent?: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryImageSchema = new Schema<ICloudinaryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true, index: true },
    description: { type: String, trim: true },
    image: { type: CategoryImageSchema },
    icon: { type: String, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);
