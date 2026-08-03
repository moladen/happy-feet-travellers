/**
 * Canonical public site origin for SEO, JSON-LD, and social share previews.
 * Prefer an explicit env URL; fall back to the live request Host so OG tags
 * never emit localhost in production crawlers (WhatsApp / Facebook / etc.).
 */

function stripTrailingSlash(value) {
  return String(value || '').trim().replace(/\/$/, '');
}

function isLocalHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  return (
    !host ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.endsWith('.local')
  );
}

function normaliseOrigin(raw, { allowHttp = false } = {}) {
  const value = stripTrailingSlash(raw);
  if (!value) return '';

  let url;
  try {
    url = new URL(value.includes('://') ? value : `https://${value}`);
  } catch {
    return '';
  }

  if (isLocalHost(url.hostname) && process.env.NODE_ENV === 'production') {
    return '';
  }

  if (url.protocol === 'http:' && !allowHttp && !isLocalHost(url.hostname)) {
    url.protocol = 'https:';
  }

  return stripTrailingSlash(url.origin);
}

/** Env / platform origin (no request headers). */
export function getConfiguredSiteUrl() {
  const fromEnv = normaliseOrigin(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
    { allowHttp: process.env.NODE_ENV !== 'production' }
  );
  if (fromEnv) return fromEnv;

  const vercelProd = normaliseOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercelProd) return vercelProd;

  const vercel = normaliseOrigin(process.env.VERCEL_URL);
  if (vercel) return vercel;

  return '';
}

/**
 * Public site origin. Pass requestHeaders from `headers()` in generateMetadata
 * so production OG tags use the real Host even when SITE_URL env is missing.
 * @param {Headers | { get: (name: string) => string | null } | null | undefined} [requestHeaders]
 */
export function getSiteUrl(requestHeaders) {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;

  if (requestHeaders && typeof requestHeaders.get === 'function') {
    const host = String(
      requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || ''
    )
      .split(',')[0]
      .trim();
    const protoRaw = String(
      requestHeaders.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
    )
      .split(',')[0]
      .trim();
    const proto = protoRaw === 'http' && !isLocalHost(host.split(':')[0]) ? 'https' : protoRaw || 'https';
    if (host && !isLocalHost(host.split(':')[0])) {
      return stripTrailingSlash(`${proto}://${host}`);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  // Last resort — still better than a relative URL for crawlers.
  return 'https://www.happyfeettravellers.com';
}

export function getOrganizationId(siteUrl = getSiteUrl()) {
  return `${siteUrl}/#organization`;
}

/**
 * Resolve relative CMS / upload paths to absolute public URLs.
 * Backend http://IP/uploads/... is rewritten to the public site origin so
 * WhatsApp/Facebook can fetch the image over HTTPS.
 */
export function toAbsoluteUrl(value, siteUrl = getSiteUrl()) {
  const raw = String(value || '').trim();
  if (!raw) return undefined;
  if (raw.startsWith('data:') || raw.startsWith('blob:')) return undefined;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      // Always serve uploads via the public site (rewrites → API), never raw VPS IP.
      if (parsed.pathname.startsWith('/uploads/')) {
        return `${stripTrailingSlash(siteUrl)}${parsed.pathname}${parsed.search}`;
      }
      if (parsed.protocol === 'http:' && !isLocalHost(parsed.hostname)) {
        parsed.protocol = 'https:';
        return parsed.toString();
      }
      return raw;
    } catch {
      return undefined;
    }
  }

  if (raw.startsWith('/')) return `${stripTrailingSlash(siteUrl)}${raw}`;
  return `${stripTrailingSlash(siteUrl)}/${raw.replace(/^\//, '')}`;
}

/** Brand fallback for OG when a tour has no hero image (public static asset). */
export function getDefaultShareImageUrl(siteUrl = getSiteUrl()) {
  return (
    toAbsoluteUrl('/hero/desert-road-trip.jpg', siteUrl) ||
    toAbsoluteUrl('/happy-feet-logo-transparent.png', siteUrl) ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
  );
}
