import { digitsOnly } from '@/lib/siteContact';
import { GOOGLE_REVIEWS_SUMMARY } from '@/lib/googleReviews';
import { getOrganizationId, getSiteUrl, toAbsoluteUrl } from '@/lib/schema/siteUrl';
import { withSchemaContext } from '@/lib/schema/jsonLdUtils';

const ORG_NAME = 'Happy Feet Travellers';

function toSchemaTelephone(number) {
  const d = digitsOnly(number);
  if (!d) return undefined;
  if (d.length === 10) return `+91-${d.slice(0, 5)}-${d.slice(5)}`;
  if (d.length === 12 && d.startsWith('91')) return `+91-${d.slice(2, 7)}-${d.slice(7)}`;
  return `+${d}`;
}

function buildSameAs(settings) {
  return [settings?.instagramUrl, settings?.facebookUrl, settings?.youtubeUrl]
    .map((url) => String(url || '').trim())
    .filter(Boolean);
}

/**
 * Global TravelAgency / Organization schema.
 * @param {object} [settings]
 * @param {{ includeAggregateRating?: boolean }} [options]
 */
export function buildOrganizationSchema(settings = {}, options = {}) {
  const siteUrl = getSiteUrl();
  const orgId = getOrganizationId(siteUrl);
  const { includeAggregateRating = true } = options;

  const schema = {
    '@type': 'TravelAgency',
    '@id': orgId,
    name: ORG_NAME,
    url: siteUrl,
    logo: toAbsoluteUrl('/happy-feet-logo-transparent.png', siteUrl),
    image: toAbsoluteUrl('/happy-feet-logo-transparent.png', siteUrl),
    description:
      'Experience-first group departures and curated travel across India. Honest pricing, smaller groups, and support from enquiry to homecoming.',
    telephone: toSchemaTelephone(settings?.whatsappNumber),
    email: settings?.email || undefined,
    address: settings?.officeAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.officeAddress,
          addressLocality: 'Pune',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        }
      : undefined,
    sameAs: buildSameAs(settings),
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };

  if (includeAggregateRating && GOOGLE_REVIEWS_SUMMARY.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: GOOGLE_REVIEWS_SUMMARY.rating.toFixed(1),
      reviewCount: String(GOOGLE_REVIEWS_SUMMARY.totalReviews),
      bestRating: String(GOOGLE_REVIEWS_SUMMARY.maxRating),
      worstRating: '1',
    };
  }

  return withSchemaContext(schema);
}

export { ORG_NAME };
