/**
 * Trustindex (Google reviews widget) — configure via .env.local
 *
 * 1. Sign up: https://www.trustindex.io/
 * 2. Connect Google Business profile
 * 3. Widgets → Add widget → pick layout (slider/grid like reference)
 * 4. Save and get code → copy the ID from:
 *    https://cdn.trustindex.io/loader.js?YOUR_WIDGET_ID_HERE
 * 5. Add to frontend/.env.local:
 *    NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID=YOUR_WIDGET_ID_HERE
 *    NEXT_PUBLIC_TRUSTINDEX_PROFILE_URL=https://www.trustindex.io/reviews/your-business
 */

export const TRUSTINDEX_WIDGET_ID =
  typeof process !== 'undefined'
    ? String(process.env.NEXT_PUBLIC_TRUSTINDEX_WIDGET_ID || '').trim()
    : '';

export const TRUSTINDEX_PROFILE_URL =
  typeof process !== 'undefined'
    ? String(process.env.NEXT_PUBLIC_TRUSTINDEX_PROFILE_URL || '').trim()
    : '';

export const TRUSTINDEX_LOADER_SRC = TRUSTINDEX_WIDGET_ID
  ? `https://cdn.trustindex.io/loader.js?${TRUSTINDEX_WIDGET_ID}`
  : '';

export function isTrustindexWidgetEnabled() {
  return Boolean(TRUSTINDEX_WIDGET_ID);
}

/** Trustindex trial / paywall copy — hide widget and use local reviews instead. */
const TRUSTINDEX_BLOCKED_PATTERNS = [
  /trial period has expired/i,
  /check our subscription plans/i,
  /subscription plan/i,
  /widget can only be used for free for 7 days/i,
];

export function isTrustindexBlockedContent(text) {
  const raw = String(text || '');
  return TRUSTINDEX_BLOCKED_PATTERNS.some((pattern) => pattern.test(raw));
}
