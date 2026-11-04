import { resolveTourPriceAmount } from '@/lib/tourPrice';

export function formatTourPriceLabel(tour) {
  const amount = resolveTourPriceAmount(tour?.startingPrice, tour?.price);
  if (!amount || amount <= 0) return 'Price on request';
  return `Starting from ₹${amount.toLocaleString('en-IN')} / person`;
}

/** Map API tour to card shape used on home / customized sections */
export function mapTourToPackageCard(tour) {
  if (!tour) return null;
  const highlights = Array.isArray(tour.highlights) ? tour.highlights.filter(Boolean) : [];
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    duration: tour.durationLabel || (tour.duration ? `${tour.duration} days` : 'Flexible dates'),
    price: formatTourPriceLabel(tour),
    highlights: highlights.length ? highlights : ['Contact us for a tailored itinerary'],
    detail: tour.description || '',
    image: tour.coverImage || tour.image,
  };
}

/**
 * Accept a bare slug/id or a pasted tour URL (e.g. "https://site.com/tour/my-slug?x=1")
 * and return just the slug/id.
 */
export function normalizeTourKey(value) {
  let key = String(value ?? '').trim();
  if (!key) return '';
  try {
    key = decodeURIComponent(key);
  } catch {
    // keep as-is
  }
  key = key.replace(/[?#].*$/, '');
  const match = key.match(/\/tour\/([^/]+)/i);
  if (match) return match[1];
  if (/^https?:\/\//i.test(key)) {
    return key.replace(/\/+$/, '').split('/').pop() || '';
  }
  return key.replace(/^\/+|\/+$/g, '');
}

/** Public tour detail page (App Router: /tour/[id]) */
export function getTourDetailHref(tourOrCard) {
  const key = normalizeTourKey(tourOrCard?.slug || tourOrCard?.id);
  return key ? `/tour/${encodeURIComponent(key)}` : '/contact';
}
