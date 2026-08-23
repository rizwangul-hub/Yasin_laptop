import { ApiResponse } from '@/types';

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0';

    if (!isLocalhost) {
      if (
        process.env.NEXT_PUBLIC_API_URL &&
        !process.env.NEXT_PUBLIC_API_URL.includes('localhost') &&
        !process.env.NEXT_PUBLIC_API_URL.includes('127.0.0.1')
      ) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
      }
      return 'https://yasin-laptop-backend.vercel.app/api';
    }
  }

  return (
    process.env.NEXT_PUBLIC_API_URL || 'https://yasin-laptop-backend.vercel.app/api'
  ).replace(/\/$/, '');
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

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
