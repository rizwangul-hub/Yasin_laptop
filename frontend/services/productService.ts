import { apiClient, ApiClientOptions } from '@/lib/api-client';
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
  getProducts: async (
    params?: Record<string, string | number | boolean | undefined>,
    options?: RequestInit,
    clientOptions?: ApiClientOptions
  ) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiClient<PaginatedResponse<IProduct>>(
      `/products?${searchParams.toString()}`,
      options,
      { ttlMs: 3 * 60 * 1000, ...clientOptions }
    );
  },

  getFilters: async (productType = 'laptop', options?: RequestInit) => {
    return apiClient<IFilterMetadata>(
      `/products/filters?productType=${productType}`,
      options,
      { ttlMs: 10 * 60 * 1000 } // 10 minutes cache for filter dropdown options
    );
  },

  getProductBySlug: async (slug: string, options?: RequestInit) => {
    return apiClient<IProduct>(
      `/products/${slug}`,
      options,
      { ttlMs: 5 * 60 * 1000 }
    );
  },

  getRelatedProducts: async (idOrSlug: string, options?: RequestInit) => {
    return apiClient<IProduct[]>(
      `/products/related/${idOrSlug}`,
      options,
      { ttlMs: 5 * 60 * 1000 }
    );
  },

  getFeatured: async (options?: RequestInit) => {
    return apiClient<PaginatedResponse<IProduct>>(
      '/products?featured=true&limit=8',
      options,
      { ttlMs: 4 * 60 * 1000 }
    );
  },

  getLatestArrivals: async (options?: RequestInit) => {
    return apiClient<PaginatedResponse<IProduct>>(
      '/products?latestArrival=true&limit=8',
      options,
      { ttlMs: 4 * 60 * 1000 }
    );
  },

  getBestDeals: async (options?: RequestInit) => {
    return apiClient<PaginatedResponse<IProduct>>(
      '/products?bestDeal=true&limit=8',
      options,
      { ttlMs: 4 * 60 * 1000 }
    );
  },

  getAccessories: async (
    params?: Record<string, string | number | boolean | undefined>,
    options?: RequestInit
  ) => {
    const searchParams = new URLSearchParams();
    searchParams.append('productType', 'accessory');
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    return apiClient<PaginatedResponse<IProduct>>(
      `/products?${searchParams.toString()}`,
      options,
      { ttlMs: 4 * 60 * 1000 }
    );
  },
};
