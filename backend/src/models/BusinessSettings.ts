import mongoose, { Schema, Document } from 'mongoose';
import { ICloudinaryImage } from '../types';

export interface IBusinessSettingsDocument extends Document {
  businessName: string;
  ownerName: string;
  logo?: ICloudinaryImage;
  whatsappNumber?: string;
  phone?: string;
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
  description?: string;
  businessHours?: string;
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
    street: { type: String, default: '' },
    city: { type: String, default: 'Lakki Marwat' },
    district: { type: String, default: 'Lakki Marwat' },
    province: { type: String, default: 'Khyber Pakhtunkhwa' },
    country: { type: String, default: 'Pakistan' },
  },
  { _id: false }
);

const BusinessSettingsSchema = new Schema<IBusinessSettingsDocument>(
  {
    businessName: { type: String, required: true, default: 'Yasin Laptop Hub' },
    ownerName: { type: String, required: true, default: 'Yasin Wahab' },
    logo: { type: SettingsLogoSchema },
    whatsappNumber: { type: String, default: '+923130957398' },
    phone: { type: String, default: '03130957398' },
    email: { type: String, default: '' },
    address: { type: AddressSchema, default: () => ({}) },
    googleMapsUrl: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    tiktokUrl: { type: String, default: '' },
    description: { type: String, default: 'Your trusted laptop destination in Lakki Marwat, KPK.' },
    businessHours: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const BusinessSettings = mongoose.models.BusinessSettings || mongoose.model<IBusinessSettingsDocument>('BusinessSettings', BusinessSettingsSchema);
