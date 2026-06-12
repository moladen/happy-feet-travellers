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

/** Public tour detail page (App Router: /tour/[id]) */
export function getTourDetailHref(tourOrCard) {
  const key = tourOrCard?.slug || tourOrCard?.id;
  return key ? `/tour/${encodeURIComponent(key)}` : '/contact';
}
