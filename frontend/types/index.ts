export type ProductType = 'laptop' | 'chromebook' | 'accessory';
export type StockStatus = 'available' | 'sold_out';
export type ProductCondition = 
  | 'new'
  | 'like-new'
  | 'excellent'
  | 'very-good'
  | 'good'
  | 'fair'
  | 'refurbished'
  | 'used';

export interface IProductImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  alt?: string;
  altText?: string;
  sortOrder?: number;
  order?: number;
  isPrimary?: boolean;
  isMain?: boolean;
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
  _id: string;
  name: string;
  slug: string;
  brand: {
    _id: string;
    name: string;
    slug: string;
    logo?: IProductImage;
    logoUrl?: string;
  } | string;
  laptopModel?: string;
  model?: string;
  productType: ProductType;
  description: string;
  shortDescription?: string;
  specs?: ILaptopSpecs;
  accessoryCategory?: string;
  price: number;
  previousPrice?: number;
  condition: ProductCondition;
  stockStatus: StockStatus;
  warranty?: string;
  chargerIncluded: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  bestDeal?: boolean;
  isBestDeal?: boolean;
  latestArrival?: boolean;
  isLatestArrival?: boolean;
  categories: Array<{ _id: string; name: string; slug: string } | string>;
  useCases: Array<{ _id: string; name: string; slug: string } | string>;
  images: IProductImage[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAccessory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  previousPrice?: number;
  condition: ProductCondition;
  stockStatus: StockStatus;
  images: IProductImage[];
  featured?: boolean;
  bestDeal?: boolean;
  latestArrival?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: IProductImage;
  imageUrl?: string;
  icon?: string;
  parent?: string;
  productCount?: number;
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo?: IProductImage;
  logoUrl?: string;
  description?: string;
  productCount?: number;
}

export interface IBusinessSettings {
  businessName: string;
  ownerName: string;
  logo?: IProductImage;
  logoUrl?: string;
  tagline: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    district: string;
    province: string;
    country: string;
  };
  googleMapsUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  businessDescription: string;
  openingHours: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
