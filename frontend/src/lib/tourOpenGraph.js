import { TRAVEL_FALLBACK_IMAGE } from '@/lib/stockImages';
import { getSiteUrl, toAbsoluteUrl } from '@/lib/schema/siteUrl';

/**
 * Pick the tour hero/card image (same priority as the public tour page).
 * Prefer normalised `tour.image` from getTourById, then cover, gallery, fallback.
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

  return (
    asSrc(tour?.image) ||
    asSrc(tour?.coverImage) ||
    asSrc(Array.isArray(tour?.gallery) ? tour.gallery[0] : null) ||
    asSrc(Array.isArray(tour?.images) ? tour.images[0] : null) ||
    ''
  );
}

/**
 * Absolute, publicly reachable image URL for Open Graph / Twitter cards.
 * @param {object|null|undefined} tour
 * @param {string} [siteUrl]
 * @returns {string}
 */
export function getTourShareImageUrl(tour, siteUrl = getSiteUrl()) {
  const raw = getTourHeroImageSrc(tour);
  const absolute = toAbsoluteUrl(raw, siteUrl);
  if (!absolute || /^(data:|blob:)/i.test(absolute)) {
    return TRAVEL_FALLBACK_IMAGE;
  }
  return absolute;
}

/**
 * App Router metadata for a public tour detail page.
 * @param {object|null|undefined} tour
 * @param {string} [routeSegment] slug or id from the URL
 */
export function buildTourPageMetadata(tour, routeSegment) {
  const siteUrl = getSiteUrl();
  const key = encodeURIComponent(String(tour?.slug || tour?.id || routeSegment || '').trim());
  const pageUrl = `${siteUrl}/tour/${key}`;

  if (!tour) {
    const title = 'Tour Details - Happy Feet Travellers';
    const description = 'View detailed information about this tour';
    const image = TRAVEL_FALLBACK_IMAGE;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: pageUrl,
        type: 'website',
        siteName: 'Happy Feet Travellers',
        images: [{ url: image, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  }

  const title = tour.seoTitle || `${tour.title} - Happy Feet Travellers`;
  const description =
    tour.seoDescription ||
    (tour.description ? String(tour.description).trim().slice(0, 160) : '') ||
    'View detailed information about this tour';
  const image = getTourShareImageUrl(tour, siteUrl);
  const imageAlt = tour.title || title;

  return {
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
      images: [
        {
          url: image,
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
