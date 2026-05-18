import { mockTours } from '@/data/mockData';
import { resolveTourPriceAmount } from '@/lib/tourPrice';
import { publicFetch, shouldUseMockFallback } from '@/lib/publicApi';

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

const DEFAULT_TOUR_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';

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

const normaliseTour = (tour) => {
  if (!tour || typeof tour !== 'object') return tour;
  const images = Array.isArray(tour.images) ? tour.images : [];
  const price = resolveTourPriceAmount(tour.startingPrice, tour.price);
  return {
    ...tour,
    price,
    startingPrice: price,
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

const filterMockTours = (params) => {
  const cat = params?.category;
  const sub = params?.subCategory;
  return mockTours
    .filter(
      (t) =>
        (!cat || t.category === cat) &&
        (!sub || t.subCategory === sub || t.category === sub)
    )
    .map(normaliseTour);
};

export const getTours = async (filters = null) => {
  const params = buildParams(filters);

  try {
    const data = await publicFetch(`/tours${toQuery(params)}`);
    return normaliseList(pickList(data));
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getTours]', err?.message || err);
    }
    if (shouldUseMockFallback()) {
      return params ? filterMockTours(params) : mockTours.map(normaliseTour);
    }
    return [];
  }
};

export const getTourById = async (idOrSlug) => {
  try {
    const id = encodeURIComponent(String(idOrSlug));
    const data = await publicFetch(`/tours/${id}`);
    return normaliseTour(data);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getTourById]', err?.message || err);
    }
    if (!shouldUseMockFallback()) return null;
    const match = mockTours.find(
      (tour) => String(tour.id) === String(idOrSlug) || tour.slug === idOrSlug
    );
    return match ? normaliseTour(match) : null;
  }
};
