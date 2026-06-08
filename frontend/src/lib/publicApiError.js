import { resolvePublicError } from '@/lib/userMessages';
import { shouldUseMockFallback } from '@/lib/publicApi';

/** User-safe fetch failure — never expose raw status URLs in UI. */
export class PublicApiError extends Error {
  /**
   * @param {string} [userMessage]
   * @param {{ cause?: unknown; status?: number; context?: string }} [meta]
   */
  constructor(userMessage, { cause, status, context = 'generic' } = {}) {
    const message =
      userMessage || resolvePublicError(cause, context) || resolvePublicError({}, context);
    super(message);
    this.name = 'PublicApiError';
    this.userMessage = message;
    this.status = status ?? cause?.status ?? cause?.response?.status;
    this.context = context;
    this.cause = cause;
  }

  /** @param {unknown} error @param {string} [context] */
  static from(error, context = 'generic') {
    if (error instanceof PublicApiError) return error;
    const status = error?.status ?? error?.response?.status;
    const userMessage = resolvePublicError(error, context);
    return new PublicApiError(userMessage, { cause: error, status, context });
  }
}

/** Backwards-compatible alias used by server pages. */
export class ToursApiError extends PublicApiError {
  /** @param {string} [_message] @param {unknown} [cause] */
  constructor(_message, cause) {
    super(undefined, { cause, context: 'tours' });
    this.name = 'ToursApiError';
  }
}

/** @param {unknown} err */
export function isFetchFailure(err) {
  return (
    err instanceof PublicApiError ||
    err instanceof ToursApiError ||
    err?.name === 'PublicApiError' ||
    err?.name === 'ToursApiError'
  );
}

/** @param {unknown} err */
export function isNotFoundError(err) {
  const status = err?.status ?? err?.response?.status ?? err?.cause?.status;
  return status === 404;
}

/**
 * Run a public API call; mock in dev when configured, otherwise throw PublicApiError.
 * @template T
 * @param {{ run: () => Promise<T>; mock?: () => T | Promise<T>; context?: string }} opts
 * @returns {Promise<T>}
 */
export async function withPublicDataFetch({ run, mock, context = 'generic' }) {
  try {
    return await run();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[${context}]`, err?.message || err);
    }
    if (shouldUseMockFallback() && mock) {
      return mock();
    }
    throw PublicApiError.from(err, context);
  }
}
