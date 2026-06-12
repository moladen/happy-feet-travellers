import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_SUMMARY } from '@/lib/googleReviews';
import { getOrganizationId, getSiteUrl } from '@/lib/schema/siteUrl';
import { withSchemaContext } from '@/lib/schema/jsonLdUtils';
import { ORG_NAME } from '@/lib/schema/organization';

function mapReviewItem(review) {
  const rawRating = Number(review?.rating);
  const rating = Number.isFinite(rawRating) && rawRating >= 1 ? rawRating : 5;
  const body = String(review?.review || review?.text || '').trim();
  const name = String(review?.name || 'Traveller').trim();
  if (!body) return null;

  return {
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(rating),
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: body,
    datePublished: review?.date || undefined,
  };
}

/**
 * Review + aggregateRating schema linked to the organization.
 * @param {{ apiTestimonials?: object[]; googleReviews?: object[] }} [sources]
 */
export function buildReviewSchema(sources = {}) {
  const googleReviews = sources.googleReviews ?? GOOGLE_REVIEWS;
  const apiTestimonials = sources.apiTestimonials ?? [];

  const combined = [
    ...googleReviews.map((item) => mapReviewItem({ ...item, text: item.text })),
    ...apiTestimonials.map((item) => mapReviewItem(item)),
  ].filter(Boolean);

  if (!combined.length && !GOOGLE_REVIEWS_SUMMARY.totalReviews) return null;

  const siteUrl = getSiteUrl();

  return withSchemaContext({
    '@type': 'TravelAgency',
    '@id': getOrganizationId(siteUrl),
    name: ORG_NAME,
    url: siteUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: GOOGLE_REVIEWS_SUMMARY.rating.toFixed(1),
      reviewCount: String(GOOGLE_REVIEWS_SUMMARY.totalReviews),
      bestRating: String(GOOGLE_REVIEWS_SUMMARY.maxRating),
      worstRating: '1',
    },
    review: combined.slice(0, 12),
  });
}
