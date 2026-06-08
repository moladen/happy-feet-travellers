import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/constants/site';
import { resolvePublicError } from '@/lib/userMessages';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

if (typeof window !== 'undefined') {
  const token = window.localStorage?.getItem('hft_admin_token');
  if (token) apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      const url = error?.config?.url;
      const status = error?.response?.status;
      console.warn(`[api] ${status ?? 'NO_RESPONSE'} ${url ?? ''}`);
    }
    return Promise.reject(error);
  }
);

/** Unwrap our `{ success, message, data }` envelope */
export const unwrap = (response) => {
  const body = response?.data;
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
};

/**
 * Pull a human-readable message + array of field errors out of an Axios error.
 * Backend shape: { success:false, message, details: string[] | object }
 */
export const extractApiError = (error, fallback = 'Something went wrong, please try again.') => {
  const body = error?.response?.data;
  const base = body?.message || error?.message || fallback;
  let details = null;
  if (Array.isArray(body?.details)) {
    details = body.details;
  } else if (Array.isArray(body?.details?.meta)) {
    details = body.details.meta;
  }
  const message =
    details?.length > 0 ? `${base} (${details.join('; ')})` : base;
  return { message, details };
};

/** Public UI only — strips technical API / env messages. */
export const extractPublicApiError = (error, _fallback, context = 'generic') => ({
  message: resolvePublicError(error, context),
  details: null,
});

export default apiClient;
