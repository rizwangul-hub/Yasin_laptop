import { apiClient } from '@/lib/api-client';
import { IBusinessSettings } from '@/types';

export const settingsService = {
  getSettings: async (options?: RequestInit) => {
    return apiClient<IBusinessSettings>('/settings', options, {
      ttlMs: 10 * 60 * 1000, // 10 minutes cache
    });
  },
};
