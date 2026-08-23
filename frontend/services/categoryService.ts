import { apiClient } from '@/lib/api-client';
import { ICategory } from '@/types';

export const categoryService = {
  getCategories: async (options?: RequestInit) => {
    return apiClient<ICategory[]>('/categories', options, {
      ttlMs: 10 * 60 * 1000,
    });
  },
};
