/** URL + API helpers for /customized-trips filters (backed by GET /api/personalized-trips). */

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

/** Maps URL filters → GET /api/personalized-trips query */
export function buildApiPersonalizedQuery(search) {
  const api = { limit: 50, sort: 'featured' };
  const q = String(search.q || '').trim();
  if (q) api.search = q;

  const state = String(search.state || '').trim();
  if (state) api.state = state;

  const category = String(search.category || '').trim();
  if (category) api.packageCategory = category;

  if (search.featured) api.featured = 'true';

  const price = search.price;
  if (price === 'under-20k') api.maxPrice = 19999;
  else if (price === '20-40k') {
    api.minPrice = 20000;
    api.maxPrice = 40000;
  } else if (price === '40k-plus') api.minPrice = 40001;

  const duration = search.duration;
  if (duration === '3-5') {
    api.minDuration = 3;
    api.maxDuration = 5;
  } else if (duration === '6-8') {
    api.minDuration = 6;
    api.maxDuration = 8;
  } else if (duration === '9plus') api.minDuration = 9;

  return api;
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
