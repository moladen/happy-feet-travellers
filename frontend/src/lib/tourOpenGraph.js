import {
  getDefaultShareImageUrl,
  getSiteUrl,
  toAbsoluteUrl,
} from '@/lib/schema/siteUrl';
import { normaliseUploadUrl } from '@/lib/heroSlides';

/**
 * Pick the tour hero/card image (same priority as the public tour page).
 * @param {object|null|undefined} tour
 * @returns {string}
 */
export function getTourHeroImageSrc(tour) {
  const asSrc = (value) => {
    if (typeof value === 'string') return value.trim();
    if (!value || typeof value !== 'object') return '';
    return String(
      value.image ||
        value.url ||
        value.src ||
        value.path ||
        value.imageUrl ||
        value.coverImage ||
        value.thumbnail ||
        ''
    ).trim();
  };

  const raw =
    asSrc(tour?.coverImage) ||
    asSrc(tour?.image) ||
    asSrc(Array.isArray(tour?.gallery) ? tour.gallery[0] : null) ||
    asSrc(Array.isArray(tour?.images) ? tour.images[0] : null) ||
    '';

  return normaliseUploadUrl(raw) || raw;
}

/**
 * Absolute HTTPS image URL for Open Graph / Twitter cards.
 * Always public-site origin for /uploads (never localhost or raw VPS http://).
 * @param {object|null|undefined} tour
 * @param {string} [siteUrl]
 * @returns {string}
 */
export function getTourShareImageUrl(tour, siteUrl = getSiteUrl()) {
  const raw = getTourHeroImageSrc(tour);
  const absolute = toAbsoluteUrl(raw, siteUrl);
  if (!absolute || !/^https:\/\//i.test(absolute)) {
    // Allow http only for local dev previews
    if (absolute && /^http:\/\/localhost/i.test(absolute) && process.env.NODE_ENV !== 'production') {
      return absolute;
    }
    return getDefaultShareImageUrl(siteUrl);
  }
  return absolute;
}

/**
 * App Router metadata for a public tour detail page.
 * @param {object|null|undefined} tour
 * @param {string} [routeSegment] slug or id from the URL
 * @param {{ siteUrl?: string }} [options]
 */
export function buildTourPageMetadata(tour, routeSegment, options = {}) {
  const siteUrl = options.siteUrl || getSiteUrl();
  const key = encodeURIComponent(String(tour?.slug || tour?.id || routeSegment || '').trim());
  const pageUrl = `${siteUrl}/tour/${key}`;
  const fallbackImage = getDefaultShareImageUrl(siteUrl);

  if (!tour) {
    const title = 'Tour Details - Happy Feet Travellers';
    const description = 'View detailed information about this tour';
    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      openGraph: {
        title,
        description,
        url: pageUrl,
        type: 'website',
        siteName: 'Happy Feet Travellers',
        images: [
          {
            url: fallbackImage,
            secureUrl: fallbackImage,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [fallbackImage],
      },
    };
  }

  const title = tour.seoTitle || `${tour.title} - Happy Feet Travellers`;
  const description =
    tour.seoDescription ||
    (tour.description ? String(tour.description).replace(/\s+/g, ' ').trim().slice(0, 160) : '') ||
    'View detailed information about this tour';
  const image = getTourShareImageUrl(tour, siteUrl);
  const imageAlt = tour.title || title;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: tour.seoTitle || tour.title || title,
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
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tour.seoTitle || tour.title || title,
      description,
      images: [image],
    },
  };
}
