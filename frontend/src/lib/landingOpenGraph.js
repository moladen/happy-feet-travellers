import { normaliseUploadUrl } from '@/lib/heroSlides';
import {
  getDefaultShareImageUrl,
  getSiteUrl,
  toAbsoluteUrl,
} from '@/lib/schema/siteUrl';
import {
  RANN_HERO_IMAGE,
  RANN_SEASON_PATH,
  RANN_SEASON_TITLE,
  RANN_SEO_DESCRIPTION,
  RANN_SEO_KEYWORDS,
  RANN_SEO_TITLE,
  RANN_SLUG,
} from '@/lib/rannSeasonContent';

/**
 * Absolute HTTPS share image for a landing page.
 * Match the on-page hero first (heroBannerImage), then optional ogImage override,
 * then Rann static hero / site default.
 */
export function getLandingShareImageUrl(page, siteUrl = getSiteUrl()) {
  const candidates = [
    page?.heroBannerImage,
    page?.ogImage,
    page?.slug === RANN_SLUG ? RANN_HERO_IMAGE : null,
    // Same fallback the Rann hero UI uses when banner is empty
    page?.slug === RANN_SLUG
      ? 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=2400&h=1400&fit=crop'
      : null,
  ];

  for (const candidate of candidates) {
    const raw = normaliseUploadUrl(String(candidate || '').trim()) || String(candidate || '').trim();
    if (!raw) continue;
    const absolute = toAbsoluteUrl(raw, siteUrl);
    if (absolute && /^https:\/\//i.test(absolute)) return absolute;
    if (
      absolute &&
      /^http:\/\/localhost/i.test(absolute) &&
      process.env.NODE_ENV !== 'production'
    ) {
      return absolute;
    }
  }

  return getDefaultShareImageUrl(siteUrl);
}

/**
 * Full Open Graph + Twitter metadata for landing pages (including Rann season).
 * @param {object|null|undefined} page
 * @param {{ siteUrl?: string; slug?: string }} [options]
 */
export function buildLandingPageMetadata(page, options = {}) {
  const siteUrl = options.siteUrl || getSiteUrl();
  const slug = String(options.slug || page?.slug || '').trim();
  const isRann = slug === RANN_SLUG || page?.slug === RANN_SLUG;
  const path = isRann ? RANN_SEASON_PATH : slug ? `/${encodeURIComponent(slug)}` : '/';
  const pageUrl = `${siteUrl}${path}`;

  const title =
    page?.seoTitle ||
    (isRann ? RANN_SEO_TITLE : null) ||
    (page?.title ? `${page.title} | Happy Feet Travellers` : 'Happy Feet Travellers');

  const description =
    page?.seoDescription ||
    page?.heroSubheading ||
    (isRann ? RANN_SEO_DESCRIPTION : null) ||
    'Curated group tours and seasonal departures with Happy Feet Travellers.';

  const ogTitle = page?.seoTitle || page?.title || (isRann ? RANN_SEASON_TITLE : title);
  const image = getLandingShareImageUrl(page, siteUrl);
  const keywords = page?.seoKeywords?.length
    ? page.seoKeywords
    : isRann
      ? RANN_SEO_KEYWORDS
      : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: pageUrl,
      type: 'website',
      siteName: 'Happy Feet Travellers',
      locale: 'en_IN',
      images: [
        {
          url: image,
          secureUrl: image,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [image],
    },
  };
}
