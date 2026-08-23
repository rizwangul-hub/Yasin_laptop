import { ApiResponse } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://yasin-laptop-backend.vercel.app/api';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    console.warn(`[API Client Error] Failed to fetch from ${endpoint}:`, error);
    return {
      success: false,
      message: 'Network or server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
