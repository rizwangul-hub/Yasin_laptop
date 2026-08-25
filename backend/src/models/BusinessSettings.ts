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

export interface IStoreBranchSetting {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  tag: string;
  phone: string;
  whatsapp: string;
  timings: string;
  mapsUrl?: string;
  isMain?: boolean;
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
  branches?: IStoreBranchSetting[];
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

const StoreBranchSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    address: { type: String, required: true },
    tag: { type: String, default: '' },
    phone: { type: String, default: '03427709129' },
    whatsapp: { type: String, default: '+923427709129' },
    timings: { type: String, default: 'Monday – Saturday: 9:00 AM – 9:00 PM' },
    mapsUrl: { type: String, default: '' },
    isMain: { type: Boolean, default: false },
  },
  { _id: false }
);

const DEFAULT_BRANCHES: IStoreBranchSetting[] = [
  {
    id: 'lakki-marwat',
    name: 'Lakki Marwat (Main Shop & Head Office)',
    city: 'Lakki Marwat',
    province: 'Khyber Pakhtunkhwa',
    address: 'Main Bazaar, Lakki Marwat, Khyber Pakhtunkhwa, Pakistan',
    tag: 'Main Store & Head Office',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 9:00 AM – 9:00 PM',
    mapsUrl: 'https://maps.google.com/?q=Lakki+Marwat+Main+Bazaar',
    isMain: true,
  },
  {
    id: 'peshawar',
    name: 'Peshawar Branch',
    city: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    address: 'Saddar / University Road Computer Market, Peshawar, KPK, Pakistan',
    tag: 'KPK Regional Branch',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 10:00 AM – 8:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Peshawar+Computer+Market',
    isMain: false,
  },
  {
    id: 'sargodha',
    name: 'Sargodha Branch',
    city: 'Sargodha',
    province: 'Punjab',
    address: 'Kutchery Road / Trust Plaza, Computer Market, Sargodha, Punjab, Pakistan',
    tag: 'Punjab Regional Branch',
    phone: '03427709129',
    whatsapp: '+923427709129',
    timings: 'Monday – Saturday: 10:00 AM – 8:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Sargodha+Computer+Market',
    isMain: false,
  },
];

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
    branches: { type: [StoreBranchSchema], default: DEFAULT_BRANCHES },
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
