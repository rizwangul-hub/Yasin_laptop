import { apiClient } from '@/lib/api-client';
import { IBrand } from '@/types';

export const brandService = {
  getBrands: async (options?: RequestInit) => {
    return apiClient<IBrand[]>('/brands', options, {
      ttlMs: 10 * 60 * 1000,
    });
  },
};
