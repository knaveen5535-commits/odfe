import { getAccessToken, isTokenExpired, setAccessToken, removeAccessToken } from './token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      return data.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function api<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<{ success: boolean; data?: T; error?: string }> {
  let token = getAccessToken();

  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken();
    if (!token) {
      removeAccessToken();
      window.location.href = '/login';
      return { success: false, error: 'Session expired' };
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return api(endpoint, options);
    }
    removeAccessToken();
    window.location.href = '/login';
    return { success: false, error: 'Session expired' };
  }

  return res.json();
}
