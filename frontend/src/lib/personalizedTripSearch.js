/** URL + API helpers for /customized-trips filters (backed by GET /api/personalized-trips). */

import { resolveTourPriceAmount } from '@/lib/tourPrice';
import { tourMatchesExperienceFilter } from '@/lib/personalizedTourExperience';

export const PACKAGE_CATEGORY_OPTIONS = [
  { value: '', label: 'All experiences' },
  { value: 'Honeymoon', label: 'Honeymoon' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Spiritual', label: 'Spiritual' },
  { value: 'Family', label: 'Family' },
  { value: 'Wildlife', label: 'Wildlife' },
  { value: 'Road Trips', label: 'Road Trips' },
  { value: 'Mountains', label: 'Mountains' },
  { value: 'Beaches', label: 'Beaches' },
];

const PRICE_OPTIONS = [
  { value: '', label: 'Any budget' },
  { value: 'under-20k', label: 'Under ₹20,000' },
  { value: '20-40k', label: '₹20,000 – ₹40,000' },
  { value: '40k-plus', label: '₹40,000+' },
];

const DURATION_OPTIONS = [
  { value: '', label: 'Any duration' },
  { value: '3-5', label: '3–5 days' },
  { value: '6-8', label: '6–8 days' },
  { value: '9plus', label: '9+ days' },
];

export { PRICE_OPTIONS, DURATION_OPTIONS };

export function parsePersonalizedSearchParams(params = {}) {
  return {
    q: params.q || '',
    state: params.state || '',
    category: params.category || '',
    price: params.price || '',
    duration: params.duration || '',
    featured: params.featured === 'true' || params.featured === '1',
  };
}

/**
 * Maps URL filters → GET /api/personalized-trips query.
 * Region / experience / budget / duration are applied client-side so partial
 * matches work (e.g. "Mumbai" in departureCity, not only exact state name).
 */
export function buildApiPersonalizedQuery(search) {
  const api = { limit: 100, sort: 'featured' };
  const q = String(search.q || '').trim();
  if (q) api.search = q;
  if (search.featured) api.featured = 'true';
  return api;
}

function matchesPriceFilter(tour, priceKey) {
  if (!priceKey) return true;
  const amount = resolveTourPriceAmount(tour?.startingPrice, tour?.price);
  if (priceKey === 'under-20k') return amount > 0 && amount < 20000;
  if (priceKey === '20-40k') return amount >= 20000 && amount <= 40000;
  if (priceKey === '40k-plus') return amount >= 40000;
  return true;
}

function resolveDurationDays(tour) {
  const days = Number(tour?.duration);
  if (Number.isFinite(days) && days > 0) return days;
  const label = String(tour?.durationLabel || '');
  const nightDay = label.match(/(\d+)\s*N\s*(\d+)\s*D/i);
  if (nightDay) return Number(nightDay[2]);
  const onlyDays = label.match(/(\d+)\s*D/i);
  if (onlyDays) return Number(onlyDays[1]);
  return 0;
}

function matchesDurationFilter(tour, durationKey) {
  if (!durationKey) return true;
  const days = resolveDurationDays(tour);
  if (!days) return false;
  if (durationKey === '3-5') return days >= 3 && days <= 5;
  if (durationKey === '6-8') return days >= 6 && days <= 8;
  if (durationKey === '9plus') return days >= 9;
  return true;
}

/** Match state name, departure city, or destination (partial, case-insensitive). */
function matchesRegionFilter(tour, regionValue) {
  const needle = String(regionValue || '').trim().toLowerCase();
  if (!needle) return true;
  const hay = [tour?.state, tour?.departureCity, tour?.destination, tour?.title]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(needle);
}

/**
 * All active filters are AND-ed:
 * region + experience + budget + duration + featured + search.
 */
export function filterPersonalizedTours(tours, search) {
  const list = Array.isArray(tours) ? tours : [];
  const q = String(search?.q || '').trim().toLowerCase();

  return list.filter((tour) => {
    if (search?.featured && !tour.featured) return false;
    if (!matchesRegionFilter(tour, search?.state)) return false;

    if (q) {
      const hay = [
        tour.title,
        tour.description,
        tour.destination,
        tour.state,
        tour.departureCity,
        tour.packageCategory,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (!tourMatchesExperienceFilter(tour, search?.category)) return false;
    if (!matchesPriceFilter(tour, search?.price)) return false;
    if (!matchesDurationFilter(tour, search?.duration)) return false;

    return true;
  });
}

export function buildCustomizedTripsUrl(search) {
  const sp = new URLSearchParams();
  if (search.q) sp.set('q', search.q);
  if (search.state) sp.set('state', search.state);
  if (search.category) sp.set('category', search.category);
  if (search.price) sp.set('price', search.price);
  if (search.duration) sp.set('duration', search.duration);
  if (search.featured) sp.set('featured', 'true');
  const s = sp.toString();
  return s ? `/customized-trips?${s}` : '/customized-trips';
}

export function hasActivePersonalizedFilters(search) {
  return Boolean(
    search.q || search.state || search.category || search.price || search.duration || search.featured
  );
}
