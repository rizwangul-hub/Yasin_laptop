import { apiClient } from '@/lib/api-client';
import { IBrand } from '@/types';

export const brandService = {
  getBrands: async () => {
    return apiClient<IBrand[]>('/brands');
  },
};
