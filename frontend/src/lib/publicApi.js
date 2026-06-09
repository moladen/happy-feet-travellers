import { API_BASE_URL } from '@/constants/site';
import { PublicApiError } from '@/lib/publicApiError';

/**
 * Resolve API root for fetch(). Browser may use relative `/api` (Vercel/nginx proxy).
 * Server-side must use an absolute URL (API_INTERNAL_URL or API_PROXY_TARGET).
 */
export function apiBase() {
  const isServer = typeof window === 'undefined';
  const internal = process.env.API_INTERNAL_URL?.replace(/\/$/, '');
  if (isServer && internal) return internal;

  const configured = (process.env.NEXT_PUBLIC_API_URL || API_BASE_URL || 'http://127.0.0.1:5000/api').replace(
    /\/$/,
    ''
  );

  if (configured.startsWith('/')) {
    if (isServer) {
      const proxy = process.env.API_PROXY_TARGET?.replace(/\/$/, '');
      if (proxy) return `${proxy}/api`;

      const site =
        process.env.SITE_URL?.replace(/\/$/, '') ||
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

      if (site) return `${site}${configured}`;
      if (internal) return internal;
    }
    return configured;
  }

  return configured;
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
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    throw PublicApiError.from(
      {
        message: body?.message,
        status: res.status,
        response: { status: res.status, data: body },
      },
      'generic'
    );
  }

  const body = await res.json();
  return unwrapJsonBody(body);
}
