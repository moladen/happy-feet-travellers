import { resolveTourPriceAmount } from '@/lib/tourPrice';
import {
  expandSearchTerms,
  normaliseSearchTerm,
  tourMatchesSearchQuery,
  tourMatchesSubCategory,
} from '@/lib/tourSearchKeywords';

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DURATION_OPTIONS = [
  { value: '', label: 'Any Duration' },
  { value: '1-2', label: '1-2 Days' },
  { value: '2-3', label: '2-3 Days' },
  { value: '3-4', label: '3-4 Days' },
  { value: '4-5', label: '4-5 Days' },
  { value: '5-6', label: '5-6 Days' },
  { value: '6-7', label: '6-7 Days' },
  { value: '7plus', label: '7+ Days' },
];

/** @returns {{ min: number, max: number } | null} */
export function durationFilterRange(durationKey) {
  const key = String(durationKey || '').trim();
  if (!key) return null;
  if (key === '7plus') return { min: 7, max: Infinity };
  const match = key.match(/^(\d+)-(\d+)$/);
  if (!match) return null;
  return { min: Number(match[1]), max: Number(match[2]) };
}

export function tourMatchesDurationKey(days, durationKey) {
  const range = durationFilterRange(durationKey);
  if (!range) return true;
  const n = Number(days);
  if (!Number.isFinite(n) || n <= 0) return false;
  return n >= range.min && n <= range.max;
}

/** `2026-05` → `May 2026` for departures URL / API */
export function monthInputToLabel(value) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return '';
  const [year, mm] = value.split('-');
  const index = parseInt(mm, 10) - 1;
  if (index < 0 || index > 11) return '';
  return `${MONTH_LABELS[index]} ${year}`;
}

/** `May 2026` → `2026-05` for `<input type="month" />` */
export function monthLabelToInput(label) {
  const raw = String(label || '').trim().toLowerCase();
  if (!raw) return '';
  const tokens = raw.split(/\s+/).filter(Boolean);
  const monthToken = tokens.find((t) => MONTH_NAMES.includes(t));
  const yearToken = tokens.find((t) => /^\d{4}$/.test(t));
  if (!monthToken || !yearToken) return '';
  const index = MONTH_NAMES.indexOf(monthToken);
  return `${yearToken}-${String(index + 1).padStart(2, '0')}`;
}

export function normaliseSearch(value) {
  return normaliseSearchTerm(value);
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

/** Build query for GET /api/upcoming-departures */
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

  const durationRange = durationFilterRange(search.duration);
  if (durationRange) {
    api.minDuration = durationRange.min;
    if (Number.isFinite(durationRange.max)) api.maxDuration = durationRange.max;
  }

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
  const monthRaw = normaliseSearch(search.month);
  const price = search.price;
  const duration = search.duration;

  const queryMatch = tourMatchesSearchQuery(tour, search.q);
  const subMatch = tourMatchesSubCategory(tour, search.sub);

  const haystack = [
    tour.title,
    tour.slug,
    tour.description,
    tour.category,
    tour.subCategory,
    tour.departureCity,
    tour.destination,
    tour.state,
    tour.date,
    tour.dateLabel,
    tour.duration,
    tour.durationLabel,
    monthLabel(tour.startDate),
    tour.dateLabel,
    ...(Array.isArray(tour.highlights) ? tour.highlights : []),
    ...(Array.isArray(tour.tags) ? tour.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  let monthMatch = true;
  if (monthRaw) {
    const tokens = monthRaw.split(/\s+/).filter(Boolean);
    monthMatch = tokens.every((t) => haystack.includes(t));
  }

  const amount = resolveTourPriceAmount(tour.startingPrice, tour.price);
  let priceMatch = true;
  if (price === 'under-10k') priceMatch = amount > 0 && amount < 10000;
  else if (price === '10-20k') priceMatch = amount >= 10000 && amount <= 20000;
  else if (price === '20k-plus') priceMatch = amount > 20000;

  const days = parseInt(tour.duration, 10);
  const durationMatch = tourMatchesDurationKey(days, duration);

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

/** Expand a footer/search token for API `search` param (first term — backend expands aliases). */
export { expandSearchTerms };
