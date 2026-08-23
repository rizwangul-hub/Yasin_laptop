import mongoose, { Schema, Document } from 'mongoose';
import { HeroMediaType } from '../types';

export interface IHeroMediaDocument extends Document {
  type: HeroMediaType;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  videoUrl?: string;
  mobileImageUrl?: string;
  cloudinaryPublicId?: string;
  alt?: string;
  sortOrder: number;
  isActive: boolean;
  buttonText?: string;
  buttonLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroMediaSchema = new Schema<IHeroMediaDocument>(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
      required: true,
    },
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    imageUrl: { type: String },
    videoUrl: { type: String },
    mobileImageUrl: { type: String },
    cloudinaryPublicId: { type: String },
    alt: { type: String, default: 'Yasin Laptop Hub Hero Banner' },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
    buttonText: { type: String, default: 'View Laptops' },
    buttonLink: { type: String, default: '/laptops' },
  },
  {
    timestamps: true,
  }
);

export const HeroMedia = mongoose.models.HeroMedia || mongoose.model<IHeroMediaDocument>('HeroMedia', HeroMediaSchema);
