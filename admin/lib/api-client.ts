const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
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

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network connection error';
    return {
      success: false,
      message,
    };
  }
}
