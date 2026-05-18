import { API_BASE_URL } from '@/constants/site';

export function apiBase() {
  return (API_BASE_URL || 'http://127.0.0.1:5000/api').replace(/\/$/, '');
}

/** Backend `{ success, message, data }` envelope */
export function unwrapJsonBody(body) {
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
}

export function shouldUseMockFallback() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Server-safe fetch for public API routes (always no-store so CMS edits show up).
 */
export async function publicFetch(path, options = {}) {
  const base = apiBase();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http') ? path : `${base}${normalized}`;

  const res = await fetch(url, {
    ...options,
    cache: options.cache ?? 'no-store',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = new Error(`${options.method || 'GET'} ${normalized} ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const body = await res.json();
  return unwrapJsonBody(body);
}
