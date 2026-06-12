/** Canonical public site origin for JSON-LD @id and url fields. */
export function getSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    process.env.SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

  return fromEnv || 'http://localhost:3000';
}

export function getOrganizationId(siteUrl = getSiteUrl()) {
  return `${siteUrl}/#organization`;
}

/** Resolve relative CMS paths to absolute URLs for schema.org. */
export function toAbsoluteUrl(value, siteUrl = getSiteUrl()) {
  const raw = String(value || '').trim();
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw;
  if (raw.startsWith('/')) return `${siteUrl}${raw}`;
  return `${siteUrl}/${raw.replace(/^\//, '')}`;
}
