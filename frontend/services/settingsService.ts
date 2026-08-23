import { apiClient } from '@/lib/api-client';
import { IBusinessSettings } from '@/types';

export const settingsService = {
  getSettings: async () => {
    return apiClient<IBusinessSettings>('/settings');
  },
};
