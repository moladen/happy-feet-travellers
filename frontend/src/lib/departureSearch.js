import { resolveTourPriceAmount } from '@/lib/tourPrice';

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

export function normaliseSearch(value) {
  return String(value || '').trim().toLowerCase();
}

function monthLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toLowerCase();
}

export function parseDepartureSearchParams(params = {}) {
  return {
    q: params.q || '',
    month: params.month || '',
    guests: params.guests || '',
    sub: params.sub || '',
    price: params.price || '',
    duration: params.duration || '',
  };
}

/** Build query for GET /api/tours */
export function buildApiTourQuery(search) {
  const api = { limit: 100 };
  const q = normaliseSearch(search.q);
  if (q) api.search = q;

  const sub = normaliseSearch(search.sub);
  if (sub && sub !== 'all') api.subCategory = sub;

  const price = search.price;
  if (price === 'under-10k') api.maxPrice = 9999;
  else if (price === '10-20k') {
    api.minPrice = 10000;
    api.maxPrice = 20000;
  } else if (price === '20k-plus') api.minPrice = 20001;

  const duration = search.duration;
  if (duration === '3-4') {
    api.minDuration = 3;
    api.maxDuration = 4;
  } else if (duration === '5-6') {
    api.minDuration = 5;
    api.maxDuration = 6;
  } else if (duration === '7plus') api.minDuration = 7;

  const monthRaw = normaliseSearch(search.month);
  if (monthRaw) {
    const tokens = monthRaw.split(/\s+/).filter(Boolean);
    const monthToken = tokens.find((t) => MONTH_NAMES.includes(t));
    const yearToken = tokens.find((t) => /^\d{4}$/.test(t));
    if (monthToken) api.month = monthToken;
    if (yearToken) api.year = yearToken;
  }

  return api;
}

export function tourMatchesDepartureSearch(tour, search) {
  const q = normaliseSearch(search.q);
  const monthRaw = normaliseSearch(search.month);
  const sub = normaliseSearch(search.sub);
  const price = search.price;
  const duration = search.duration;

  const haystack = [
    tour.title,
    tour.slug,
    tour.description,
    tour.category,
    tour.subCategory,
    tour.departureCity,
    tour.date,
    tour.dateLabel,
    tour.duration,
    tour.durationLabel,
    tour.urgency,
    tour.offers,
    tour.meals,
    tour.stayType,
    tour.transport,
    tour.suitableFor,
    monthLabel(tour.startDate),
    ...(Array.isArray(tour.highlights) ? tour.highlights : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const words = q ? q.split(/\s+/).filter(Boolean) : [];
  const queryMatch = words.length === 0 || words.every((w) => haystack.includes(w));

  let monthMatch = true;
  if (monthRaw) {
    const tokens = monthRaw.split(/\s+/).filter(Boolean);
    monthMatch = tokens.every((t) => haystack.includes(t));
  }

  let subMatch = true;
  if (sub && sub !== 'all') {
    subMatch = normaliseSearch(tour.subCategory) === sub || haystack.includes(sub);
  }

  const amount = resolveTourPriceAmount(tour.startingPrice, tour.price);
  let priceMatch = true;
  if (price === 'under-10k') priceMatch = amount > 0 && amount < 10000;
  else if (price === '10-20k') priceMatch = amount >= 10000 && amount <= 20000;
  else if (price === '20k-plus') priceMatch = amount > 20000;

  const days = parseInt(tour.duration, 10);
  let durationMatch = true;
  if (duration === '3-4') durationMatch = days >= 3 && days <= 4;
  else if (duration === '5-6') durationMatch = days >= 5 && days <= 6;
  else if (duration === '7plus') durationMatch = days >= 7;

  return queryMatch && monthMatch && subMatch && priceMatch && durationMatch;
}

export function buildDeparturesUrl(search, { preserveGuests = true } = {}) {
  const params = new URLSearchParams();
  if (search.q?.trim()) params.set('q', search.q.trim());
  if (search.month?.trim()) params.set('month', search.month.trim());
  if (preserveGuests && search.guests?.trim()) params.set('guests', search.guests.trim());
  if (search.sub && search.sub !== 'all') params.set('sub', search.sub);
  if (search.price) params.set('price', search.price);
  if (search.duration) params.set('duration', search.duration);
  const qs = params.toString();
  return qs ? `/upcoming-departures?${qs}` : '/upcoming-departures';
}
