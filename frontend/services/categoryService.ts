import { apiClient } from '@/lib/api-client';
import { ICategory } from '@/types';

export const categoryService = {
  getCategories: async () => {
    return apiClient<ICategory[]>('/categories');
  },
};
