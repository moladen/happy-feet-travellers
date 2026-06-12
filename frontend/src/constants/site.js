export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT_MS = 10000;
export const UPLOAD_TIMEOUT_MS = 120000;

/** Optional HTTPS API origin — bypasses Vercel /api proxy for large multipart uploads. */
export function resolveUploadApiBase() {
  const direct = String(process.env.NEXT_PUBLIC_API_DIRECT_URL || '').trim().replace(/\/$/, '');
  if (!direct) return API_BASE_URL;
  return direct.endsWith('/api') ? direct : `${direct}/api`;
}
