import mongoose, { Schema, Document } from 'mongoose';
import { ICloudinaryImage } from '../types';

export interface IDailyStockVideo {
  title?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  isActive?: boolean;
  buttonText?: string;
}

export interface IBusinessSettingsDocument extends Document {
  businessName: string;
  ownerName: string;
  logo?: ICloudinaryImage;
  tagline?: string;
  whatsappNumber?: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  address?: {
    street?: string;
    city: string;
    district: string;
    province: string;
    country: string;
  };
  googleMapsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  description?: string;
  businessHours?: string;
  openingHours?: string;
  dailyStockVideo?: IDailyStockVideo;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsLogoSchema = new Schema<ICloudinaryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: 'Yasin Laptop Hub Logo' },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    street: { type: String, default: 'Main Bazaar' },
    city: { type: String, default: 'Lakki Marwat' },
    district: { type: String, default: 'Lakki Marwat' },
    province: { type: String, default: 'Khyber Pakhtunkhwa' },
    country: { type: String, default: 'Pakistan' },
  },
  { _id: false }
);

const DailyStockVideoSchema = new Schema<IDailyStockVideo>(
  {
    title: { type: String, default: "Today's Fresh Stock Arrival" },
    videoUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    description: {
      type: String,
      default:
        'Watch our latest stock unboxing and tested laptops arrival at Yasin Laptop Hub in Lakki Marwat.',
    },
    isActive: { type: Boolean, default: true },
    buttonText: { type: String, default: 'Watch Daily Stock Video' },
  },
  { _id: false }
);

const BusinessSettingsSchema = new Schema<IBusinessSettingsDocument>(
  {
    businessName: { type: String, required: true, default: 'Yasin Laptop Hub' },
    ownerName: { type: String, required: true, default: 'Yasin Wahab' },
    tagline: { type: String, default: 'Quality Laptops • Chromebooks • Accessories' },
    logo: { type: SettingsLogoSchema },
    whatsappNumber: { type: String, default: '+923427709129' },
    phone: { type: String, default: '03427709129' },
    phoneNumber: { type: String, default: '03427709129' },
    email: { type: String, default: 'info@yasinlaptophub.com' },
    address: { type: AddressSchema, default: () => ({}) },
    googleMapsUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    tiktokUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    description: { type: String, default: 'Your trusted laptop destination in Lakki Marwat, KPK.' },
    businessHours: { type: String, default: 'Monday – Saturday: 9:00 AM – 9:00 PM' },
    openingHours: { type: String, default: 'Monday – Saturday: 9:00 AM – 9:00 PM' },
    dailyStockVideo: { type: DailyStockVideoSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

export const BusinessSettings =
  mongoose.models.BusinessSettings ||
  mongoose.model<IBusinessSettingsDocument>('BusinessSettings', BusinessSettingsSchema);
