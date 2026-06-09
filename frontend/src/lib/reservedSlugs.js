/** App routes that must not be handled by the dynamic landing-page `[slug]` segment */
export const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'about',
  'blog',
  'contact',
  'customized-trips',
  'gallery',
  'tour',
  'upcoming-departures',
  'privacy',
  'terms',
  'favicon.ico',
  '_next',
]);

export function isReservedSlug(slug) {
  if (!slug || typeof slug !== 'string') return true;
  const normalized = slug.toLowerCase().trim();
  return RESERVED_SLUGS.has(normalized) || normalized.startsWith('_');
}
