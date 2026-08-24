import { ApiResponse } from '@/types';

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return 'https://yasin-laptop-backend.vercel.app/api';
}

export interface ApiClientOptions {
  cache?: boolean;
  ttlMs?: number;
  forceRefresh?: boolean;
}

interface CacheEntry<T> {
  data: ApiResponse<T>;
  timestamp: number;
  ttlMs: number;
}

// In-memory client cache store and in-flight promise map for deduplication
const responseCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<ApiResponse<unknown>>>();

const DEFAULT_CACHE_TTL = 3 * 60 * 1000; // 3 minutes for regular GET queries

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  clientOptions: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const shouldCache = clientOptions.cache ?? isGet;
  const ttlMs = clientOptions.ttlMs ?? DEFAULT_CACHE_TTL;
  const forceRefresh = clientOptions.forceRefresh ?? false;

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const cacheKey = `${method}:${endpoint}`;

  // 1. Check in-memory client cache for GET requests
  if (shouldCache && !forceRefresh && responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey) as CacheEntry<T>;
    const isStillFresh = Date.now() - cached.timestamp < cached.ttlMs;

    if (isStillFresh) {
      return cached.data;
    }
    // If expired, delete and fetch fresh
    responseCache.delete(cacheKey);
  }

  // 2. In-flight request deduplication (prevents duplicate simultaneous calls to same endpoint)
  if (isGet && inFlightRequests.has(cacheKey) && !forceRefresh) {
    return (await inFlightRequests.get(cacheKey)) as ApiResponse<T>;
  }

  // 3. Execute network fetch
  const fetchPromise = (async (): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      // Store in client cache if successful GET request
      if (shouldCache && data.success) {
        responseCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttlMs,
        });
      }

      return data;
    } catch (error) {
      // If request was aborted by AbortController, return clean canceled response
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request canceled',
        };
      }

      console.warn(`[API Client Error] Failed to fetch from ${endpoint}:`, error);
      return {
        success: false,
        message: 'Network or server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  if (isGet) {
    inFlightRequests.set(cacheKey, fetchPromise as Promise<ApiResponse<unknown>>);
  }

  return fetchPromise;
}

/**
 * Invalidate client cache entries matching a pattern or clear all
 */
apiClient.invalidate = (pattern?: string | RegExp): void => {
  if (!pattern) {
    responseCache.clear();
    return;
  }

  const keys = Array.from(responseCache.keys());
  for (const key of keys) {
    if (typeof pattern === 'string') {
      if (key.includes(pattern)) {
        responseCache.delete(key);
      }
    } else if (pattern instanceof RegExp) {
      if (pattern.test(key)) {
        responseCache.delete(key);
      }
    }
  }
};

apiClient.clear = (): void => {
  responseCache.clear();
  inFlightRequests.clear();
};
