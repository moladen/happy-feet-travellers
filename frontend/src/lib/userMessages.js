/**
 * Customer-facing copy for errors, loading, and empty states.
 * Never expose API, stack, env, or developer messages in the UI.
 */

export const USER_MESSAGES = {
  generic: 'Something went wrong. Please try again later.',
  network:
    'Unable to connect at the moment. Please check your internet connection and try again.',
  serviceUnavailable:
    'This service is temporarily unavailable. Please try again shortly.',
  notFound: 'The page you are looking for could not be found.',
  tourNotFound: 'This tour is no longer available or could not be found.',
  blogNotFound: 'This article could not be found.',
  noDepartures: 'No departures found for the selected criteria.',
  noDeparturesScheduled: 'No upcoming departures are scheduled right now.',
  noTours: 'No matching tours were found.',
  noPersonalizedTours: 'No matching journeys were found.',
  noBlogs: 'No travel stories are available right now. Please check back soon.',
  noContent: 'Content is not available at the moment.',
  noTeam: 'Team profiles are not available at the moment.',
  formSubmitFailed: 'We could not send your message. Please try again later.',
  subscribeFailed: 'We could not complete your subscription. Please try again later.',
  loading: {
    tours: 'Loading tours…',
    departures: 'Loading departures…',
    content: 'Loading content…',
    experiences: 'Loading travel experiences…',
    blog: 'Loading travel stories…',
    gallery: 'Loading gallery…',
    team: 'Loading team profiles…',
  },
};

const TECHNICAL_PATTERN =
  /localhost|127\.0\.0\.1|0\.0\.0\.0|npm run|yarn |pnpm |NEXT_PUBLIC_|API_URL|API_PROXY|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|axios|prisma|database|sql|stack trace|exception|internal server|status code|\/api\/|\.env|Unhandled|TypeError|ReferenceError|Network Error|fetch failed|CORS|401|403|404|500|502|503|504|could not load .* from the api|check next_public/i;

const CONTEXT_FALLBACK = {
  departures: USER_MESSAGES.noDepartures,
  departuresList: USER_MESSAGES.serviceUnavailable,
  tours: USER_MESSAGES.noTours,
  personalized: USER_MESSAGES.noPersonalizedTours,
  blog: USER_MESSAGES.noBlogs,
  content: USER_MESSAGES.noContent,
  team: USER_MESSAGES.noTeam,
  form: USER_MESSAGES.formSubmitFailed,
  subscribe: USER_MESSAGES.subscribeFailed,
  generic: USER_MESSAGES.generic,
};

function isBlank(value) {
  return value == null || String(value).trim() === '';
}

/**
 * True when the message looks like developer or infrastructure output.
 */
export function isTechnicalMessage(message) {
  if (isBlank(message)) return true;
  return TECHNICAL_PATTERN.test(String(message));
}

export function isNetworkError(error) {
  if (!error) return false;
  const code = error?.code;
  const message = String(error?.message || '');
  if (code === 'ECONNREFUSED' || code === 'ENOTFOUND' || code === 'ETIMEDOUT') return true;
  if (error?.response == null && error?.request) return true;
  return /network error|failed to fetch|load failed|timeout/i.test(message);
}

/**
 * Map a raw string to a safe public message.
 */
export function sanitizePublicMessage(message, fallback = USER_MESSAGES.generic) {
  if (isBlank(message) || isTechnicalMessage(message)) {
    return fallback;
  }
  return String(message).trim();
}

/**
 * Resolve a user-safe message from an error object and optional context key.
 */
export function resolvePublicError(error, context = 'generic') {
  const fallback = CONTEXT_FALLBACK[context] || USER_MESSAGES.generic;

  if (isNetworkError(error)) {
    return USER_MESSAGES.network;
  }

  const status = error?.response?.status;
  if (status === 503 || status === 502 || status === 504) {
    return USER_MESSAGES.serviceUnavailable;
  }

  const raw =
    error?.response?.data?.message ||
    error?.message ||
    (typeof error === 'string' ? error : '');

  if (isTechnicalMessage(raw)) {
    if (status >= 500) return USER_MESSAGES.serviceUnavailable;
    if (isNetworkError(error)) return USER_MESSAGES.network;
    return fallback;
  }

  return sanitizePublicMessage(raw, fallback);
}

/**
 * Safe message for form/API results (no details array in UI).
 */
export function resolveFormErrorMessage(result, fallback = USER_MESSAGES.formSubmitFailed) {
  const raw = result?.message;
  return sanitizePublicMessage(raw, fallback);
}

export function getLoadingLabel(key = 'content') {
  return USER_MESSAGES.loading[key] || USER_MESSAGES.loading.content;
}
