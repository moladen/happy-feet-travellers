import { API_BASE_URL } from '@/constants/site';
import { mockTours } from '@/data/mockData';

function apiBase() {
  return (API_BASE_URL || 'http://127.0.0.1:5000/api').replace(/\/$/, '');
}

/** Backend `{ success, message, data }` — same shape axios `unwrap` uses on `response.data`. */
function unwrapJsonBody(body) {
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
}

function toQuery(params) {
  if (!params) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    sp.set(key, String(value));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

/** When CMS has no cover image yet — neutral travel placeholder (also in next.config remotePatterns). */
const DEFAULT_TOUR_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';

/** Normalise list from GET /tours (`{ tours, pagination }`) or legacy shapes. */
const pickList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.tours)) return data.tours;
  return [];
};

const formatDateRange = (start, end) => {
  if (!start) return null;
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  if (Number.isNaN(s.getTime())) return null;
  const fmt = { day: '2-digit', month: 'short', year: 'numeric' };
  if (!e || Number.isNaN(e.getTime())) return s.toLocaleDateString('en-GB', fmt);
  return `${s.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${e.toLocaleDateString('en-GB', fmt)}`;
};

/**
 * Normalise an API tour record to the shape components rendered from mockData expect.
 * Older components read `image`, `gallery`, `date`, `reviews` etc. — these come from
 * `coverImage`, `images`, `dateLabel`/`startDate+endDate`, `reviewsCount` on the API model.
 */
const normaliseTour = (tour) => {
  if (!tour || typeof tour !== 'object') return tour;
  const images = Array.isArray(tour.images) ? tour.images : [];
  const price = Number(tour.price ?? tour.startingPrice ?? 0);
  return {
    ...tour,
    price: Number.isFinite(price) ? price : 0,
    image: tour.image || tour.coverImage || images[0] || DEFAULT_TOUR_IMAGE,
    gallery: tour.gallery || (images.length ? images : tour.coverImage ? [tour.coverImage] : []),
    date: tour.date || tour.dateLabel || formatDateRange(tour.startDate, tour.endDate) || 'Dates on request',
    duration: tour.durationLabel || tour.duration,
    reviews: tour.reviews ?? tour.reviewsCount ?? 0,
    rating: tour.rating != null ? tour.rating : 4.8,
  };
};

const normaliseList = (list) => (Array.isArray(list) ? list.map(normaliseTour) : []);

const TOP_LEVEL_CATEGORIES = new Set(['upcoming', 'customized']);

const buildParams = (filters) => {
  if (!filters) return undefined;
  if (typeof filters === 'string') {
    return TOP_LEVEL_CATEGORIES.has(filters)
      ? { category: filters }
      : { subCategory: filters };
  }
  return filters;
};

export const getTours = async (filters = null) => {
  const params = buildParams(filters);

  try {
    const base = apiBase();
    const query = toQuery(params);
    const res = await fetch(`${base}/tours${query}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`GET /tours ${res.status}`);
    const body = await res.json();
    const data = unwrapJsonBody(body);
    return normaliseList(pickList(data));
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getTours]', err?.message || err);
    }
    if (!params) return mockTours.map(normaliseTour);
    const cat = params.category;
    const sub = params.subCategory;
    return mockTours
      .filter(
        (t) =>
          (!cat || t.category === cat) &&
          (!sub || t.subCategory === sub || t.category === sub)
      )
      .map(normaliseTour);
  }
};

export const getTourById = async (idOrSlug) => {
  try {
    const base = apiBase();
    const id = encodeURIComponent(String(idOrSlug));
    const res = await fetch(`${base}/tours/${id}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`GET /tours/${id} ${res.status}`);
    const body = await res.json();
    const data = unwrapJsonBody(body);
    return normaliseTour(data);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getTourById]', err?.message || err);
    }
    const match = mockTours.find(
      (tour) => String(tour.id) === String(idOrSlug) || tour.slug === idOrSlug
    );
    return match ? normaliseTour(match) : null;
  }
};
