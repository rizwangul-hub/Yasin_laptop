import { Request } from 'express';

export type ProductType = 'laptop' | 'chromebook' | 'accessory';

export type ProductCondition = 
  | 'new'
  | 'like-new'
  | 'excellent'
  | 'very-good'
  | 'good'
  | 'fair'
  | 'refurbished'
  | 'used';

export type StockStatus = 'available' | 'sold_out';

export type UserRole = 'admin' | 'superadmin';

export type HeroMediaType = 'image' | 'video';

export interface ICloudinaryImage {
  url: string;
  publicId: string;
  alt?: string;
  width?: number;
  height?: number;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ILaptopSpecs {
  processorBrand?: string;
  processor?: string;
  generation?: string;
  ram?: string;
  ramType?: string;
  storage?: string;
  storageType?: string;
  displaySize?: string;
  displayResolution?: string;
  graphics?: string;
  battery?: string;
  operatingSystem?: string;
  color?: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  brand: string;
  laptopModel: string;
  productType: ProductType;
  shortDescription?: string;
  description: string;
  specs?: ILaptopSpecs;
  accessoryCategory?: string;
  price: number;
  previousPrice?: number;
  condition: ProductCondition;
  stockStatus: StockStatus;
  warranty?: string;
  chargerIncluded: boolean;
  featured: boolean;
  bestDeal: boolean;
  latestArrival: boolean;
  categories: string[];
  useCases: string[];
  images: ICloudinaryImage[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBrand {
  _id?: string;
  name: string;
  slug: string;
  logo?: ICloudinaryImage;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: ICloudinaryImage;
  icon?: string;
  parent?: string;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUseCase {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: ICloudinaryImage;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccessory {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBusinessSettings {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHeroMedia {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWhatsAppInquiry {
  _id?: string;
  product?: string;
  productNameSnapshot: string;
  customerName?: string;
  customerPhone?: string;
  message?: string;
  source: string;
  createdAt?: Date;
}

export interface ISEOConfig {
  _id?: string;
  page: string;
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: ICloudinaryImage;
  noIndex: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: IPaginationMeta;
}

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
