import { apiClient } from '@/lib/api-client';
import { IProduct, PaginatedResponse } from '@/types';

export interface IFilterMetadata {
  brands: Array<{ _id: string; name: string; slug: string; logo?: unknown }>;
  categories: Array<{ _id: string; name: string; slug: string; icon?: string }>;
  useCases: Array<{ _id: string; name: string; slug: string; icon?: string }>;
  processors: string[];
  generations: string[];
  ramOptions: string[];
  storageOptions: string[];
  conditions: string[];
  priceRanges: Array<{ label: string; min: number; max: number }>;
  productType: string;
}

export const productService = {
  getProducts: async (params?: Record<string, string | number | boolean | undefined>) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiClient<PaginatedResponse<IProduct>>(`/products?${searchParams.toString()}`);
  },

  getFilters: async (productType = 'laptop') => {
    return apiClient<IFilterMetadata>(`/products/filters?productType=${productType}`);
  },

  getProductBySlug: async (slug: string) => {
    return apiClient<IProduct>(`/products/${slug}`);
  },

  getRelatedProducts: async (idOrSlug: string) => {
    return apiClient<IProduct[]>(`/products/related/${idOrSlug}`);
  },

  getFeatured: async () => {
    return apiClient<PaginatedResponse<IProduct>>('/products?featured=true&limit=8');
  },

  getLatestArrivals: async () => {
    return apiClient<PaginatedResponse<IProduct>>('/products?latestArrival=true&limit=8');
  },

  getBestDeals: async () => {
    return apiClient<PaginatedResponse<IProduct>>('/products?bestDeal=true&limit=8');
  },

  getAccessories: async (params?: Record<string, string | number | boolean | undefined>) => {
    const searchParams = new URLSearchParams();
    searchParams.append('productType', 'accessory');
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiClient<PaginatedResponse<IProduct>>(`/products?${searchParams.toString()}`);
  },
};
