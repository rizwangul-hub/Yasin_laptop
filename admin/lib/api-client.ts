export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

const FALLBACK_API_URL = 'https://yasin-laptop-backend.vercel.app/api';

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
      return FALLBACK_API_URL;
    }
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return FALLBACK_API_URL;
}

export async function adminApiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('yasin_admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const executeFetch = async (targetUrl: string): Promise<ApiResponse<T>> => {
    const response = await fetch(targetUrl, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('yasin_admin_token');
        localStorage.removeItem('yasin_admin_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        error: data.error,
      };
    }

    return data;
  };

  try {
    return await executeFetch(url);
  } catch (primaryError) {
    if (!url.startsWith(FALLBACK_API_URL)) {
      try {
        const fallbackUrl = `${FALLBACK_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        return await executeFetch(fallbackUrl);
      } catch (fallbackError) {
        console.warn(`[Admin API Client Error] Fallback also failed for ${endpoint}:`, fallbackError);
      }
    }

    const message = primaryError instanceof Error ? primaryError.message : 'Network connection error';
    return {
      success: false,
      message,
    };
  }
}
