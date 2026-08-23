import mongoose, { Schema, Document, Types } from 'mongoose';
import { ICloudinaryImage, ILaptopSpecs, ProductType, ProductCondition, StockStatus } from '../types';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  sku?: string;
  brand: Types.ObjectId;
  laptopModel: string;
  productType: ProductType;
  shortDescription?: string;
  description: string;
  specs?: ILaptopSpecs;
  additionalSpecs?: Record<string, string>;
  accessoryCategory?: string;
  price: number;
  previousPrice?: number;
  condition: ProductCondition;
  stockStatus: StockStatus;
  publicationStatus: PublicationStatus;
  warranty?: string;
  chargerIncluded: boolean;
  featured: boolean;
  bestDeal: boolean;
  latestArrival: boolean;
  categories: Types.ObjectId[];
  useCases: Types.ObjectId[];
  images: ICloudinaryImage[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<ICloudinaryImage>(
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

const LaptopSpecsSchema = new Schema<ILaptopSpecs>(
  {
    processorBrand: { type: String, trim: true },
    processor: { type: String, trim: true },
    generation: { type: String, trim: true },
    ram: { type: String, trim: true },
    ramType: { type: String, trim: true },
    storage: { type: String, trim: true },
    storageType: { type: String, trim: true },
    displaySize: { type: String, trim: true },
    displayResolution: { type: String, trim: true },
    graphics: { type: String, trim: true },
    battery: { type: String, trim: true },
    operatingSystem: { type: String, trim: true },
    color: { type: String, trim: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    sku: { type: String, trim: true, sparse: true, index: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    laptopModel: { type: String, required: true, trim: true },
    productType: {
      type: String,
      enum: ['laptop', 'chromebook', 'accessory'],
      default: 'laptop',
      required: true,
      index: true,
    },
    shortDescription: { type: String, trim: true },
    description: { type: String, required: true },
    specs: { type: LaptopSpecsSchema },
    additionalSpecs: { type: Map, of: String },
    accessoryCategory: { type: String, trim: true },
    price: { type: Number, required: true, min: 0, index: true },
    previousPrice: { type: Number, min: 0 },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'excellent', 'very-good', 'good', 'fair', 'refurbished', 'used'],
      default: 'excellent',
      required: true,
      index: true,
    },
    stockStatus: {
      type: String,
      enum: ['available', 'sold_out'],
      default: 'available',
      required: true,
      index: true,
    },
    publicationStatus: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      required: true,
      index: true,
    },
    warranty: { type: String, default: 'Checking Warranty Available' },
    chargerIncluded: { type: Boolean, default: true },
    featured: { type: Boolean, default: false, index: true },
    bestDeal: { type: Boolean, default: false, index: true },
    latestArrival: { type: Boolean, default: false, index: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true }],
    useCases: [{ type: Schema.Types.ObjectId, ref: 'UseCase', index: true }],
    images: { type: [ProductImageSchema], default: [] },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

// Search and multi-filter compound indexes
ProductSchema.index({ name: 'text', description: 'text', laptopModel: 'text' });
ProductSchema.index({ isDeleted: 1, stockStatus: 1, price: 1 });
ProductSchema.index({ isDeleted: 1, publicationStatus: 1, createdAt: -1 });
ProductSchema.index({ isDeleted: 1, featured: 1, createdAt: -1 });
ProductSchema.index({ isDeleted: 1, latestArrival: 1, createdAt: -1 });
ProductSchema.index({ isDeleted: 1, bestDeal: 1, createdAt: -1 });

export const Product = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
