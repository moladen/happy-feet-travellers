import { resolveTourPriceAmount } from '@/lib/tourPrice';
import { getOrganizationId, getSiteUrl, toAbsoluteUrl } from '@/lib/schema/siteUrl';
import { withSchemaContext } from '@/lib/schema/jsonLdUtils';
import { ORG_NAME } from '@/lib/schema/organization';

function buildOffer({ priceAmount, pageUrl, priceLabel }) {
  if (priceAmount > 0) {
    return {
      '@type': 'Offer',
      price: String(Math.round(priceAmount)),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    };
  }

  const label = String(priceLabel || '').trim();
  if (label && !/request|quote|tbd/i.test(label)) {
    const digits = label.replace(/[^\d]/g, '');
    if (digits) {
      return {
        '@type': 'Offer',
        price: digits,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: pageUrl,
      };
    }
  }

  return {
    '@type': 'Offer',
    url: pageUrl,
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'INR',
      description: label || 'Price on request',
    },
  };
}

function buildItinerary(itinerary) {
  if (!Array.isArray(itinerary) || !itinerary.length) return undefined;
  return {
    '@type': 'ItemList',
    itemListElement: itinerary.slice(0, 14).map((day, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: [day.day, day.title].filter(Boolean).join(' — ') || `Day ${index + 1}`,
      description: String(day.details || day.description || '').trim() || undefined,
    })),
  };
}

/**
 * TouristTrip schema for public tour detail pages.
 * @param {object} tour
 * @param {string} pageUrl
 */
export function buildTourTravelPackageSchema(tour, pageUrl) {
  if (!tour?.title) return null;

  const siteUrl = getSiteUrl();
  const priceAmount = resolveTourPriceAmount(tour.startingPrice, tour.price);
  const image =
    toAbsoluteUrl(tour.coverImage || tour.image, siteUrl) ||
    toAbsoluteUrl('/hero/tropical-paradise.jpg', siteUrl);

  return withSchemaContext({
    '@type': 'TouristTrip',
    name: tour.title,
    description: String(tour.description || tour.seoDescription || '').trim() || undefined,
    url: pageUrl,
    image: image ? [image] : undefined,
    touristType: tour.suitableFor || tour.category || 'Leisure travellers',
    itinerary: buildItinerary(tour.itinerary),
    offers: buildOffer({ priceAmount, pageUrl }),
    provider: {
      '@type': 'TravelAgency',
      '@id': getOrganizationId(siteUrl),
      name: ORG_NAME,
      url: siteUrl,
    },
  });
}

/**
 * TouristTrip schema for campaign landing package pages.
 * @param {object} pkg
 * @param {object} page
 * @param {string} pageUrl
 */
export function buildLandingPackageSchema(pkg, page, pageUrl) {
  if (!pkg?.name) return null;

  const siteUrl = getSiteUrl();
  const detail = pkg.detailContent || {};
  const paragraphs = detail.paragraphs || (pkg.shortDescription ? [pkg.shortDescription] : []);
  const description = paragraphs.join(' ').trim() || pkg.shortDescription || page?.heroSubheading;

  const image = toAbsoluteUrl(pkg.featuredImage || pkg.image || page?.heroBannerImage, siteUrl);

  return withSchemaContext({
    '@type': 'TouristTrip',
    name: pkg.name,
    description: description || undefined,
    url: pageUrl,
    image: image ? [image] : undefined,
    touristType: detail.idealFor || 'Leisure travellers',
    offers: buildOffer({
      priceAmount: 0,
      pageUrl,
      priceLabel: pkg.startingPrice,
    }),
    provider: {
      '@type': 'TravelAgency',
      '@id': getOrganizationId(siteUrl),
      name: ORG_NAME,
      url: siteUrl,
    },
  });
}
