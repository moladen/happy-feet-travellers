import { mockTours } from '@/data/mockData';
import { resolveTourPriceAmount } from '@/lib/tourPrice';
import { sanitiseStockImageUrl, TRAVEL_FALLBACK_IMAGE } from '@/lib/stockImages';
import { publicFetch, shouldUseMockFallback } from '@/lib/publicApi';
import { isNotFoundError, withPublicDataFetch } from '@/lib/publicApiError';

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

const DEFAULT_TOUR_IMAGE = TRAVEL_FALLBACK_IMAGE.replace('w=1200', 'w=900');

const API_ASSET_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

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

const resolveImageUrl = (value) => {
  const src = String(value || '').trim();
  if (!src) return '';
  if (/^(data:|blob:|https?:\/\/)/i.test(src)) {
    return /^https?:\/\/images\.unsplash\.com/i.test(src) ? sanitiseStockImageUrl(src) : src;
  }
  if (src.startsWith('/images/') || src.startsWith('/videos/') || src.startsWith('/happy-feet-logo')) return src;
  if (src.startsWith('/')) return `${API_ASSET_BASE}${src}`;
  return `${API_ASSET_BASE}/${src}`;
};

const imageFromValue = (value) => {
  if (typeof value === 'string') return resolveImageUrl(value);
  if (!value || typeof value !== 'object') return '';
  return resolveImageUrl(
    value.image ||
      value.url ||
      value.src ||
      value.path ||
      value.imageUrl ||
      value.imageURL ||
      value.secure_url ||
      value.coverImage ||
      value.thumbnail ||
      ''
  );
};

const parseImageList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return value ? [value] : [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Use comma/single parsing below.
    }
  }
  return trimmed.includes(',') ? trimmed.split(',') : [trimmed];
};

export const normaliseTour = (tour) => {
  if (!tour || typeof tour !== 'object') return tour;

  const galleryOnly = [
    ...parseImageList(tour.gallery),
    ...parseImageList(tour.images),
  ]
    .map(imageFromValue)
    .filter(Boolean);
  const gallery = [...new Set(galleryOnly)];

  const coverImage = imageFromValue(tour.coverImage);
  const legacyImage = imageFromValue(tour.image);
  const cardImage = coverImage || legacyImage || gallery[0] || DEFAULT_TOUR_IMAGE;

  const price = resolveTourPriceAmount(tour.startingPrice, tour.price);
  return {
    ...tour,
    price,
    startingPrice: price,
    image: cardImage,
    gallery,
    date: tour.date || tour.dateLabel || formatDateRange(tour.startDate, tour.endDate) || 'Dates on request',
    duration: tour.durationLabel || tour.duration,
    reviews: tour.reviews ?? tour.reviewsCount ?? 0,
    rating: tour.rating != null ? tour.rating : 4.8,
    tags: Array.isArray(tour.tags) ? tour.tags : [],
    groupSize: tour.groupSize || null,
    destination: tour.destination || null,
    featured: Boolean(tour.featured),
    status: tour.status || 'active',
    seriesSlug: tour.seriesSlug || null,
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

export { ToursApiError } from '@/lib/publicApiError';

export const getTours = async (filters = null) => {
  const params = buildParams(filters);
  const isUpcoming =
    params?.category === 'upcoming' ||
    (typeof filters === 'string' && filters === 'upcoming');

  if (isUpcoming) {
    const { getUpcomingDepartures } = await import('@/services/upcomingDeparturesService');
    return getUpcomingDepartures({
      ...(typeof filters === 'object' ? filters : {}),
      limit: filters?.limit ?? 100,
      sort: filters?.sort ?? 'startDate',
    });
  }

  const isCustomized =
    params?.category === 'customized' ||
    (typeof filters === 'string' && filters === 'customized');

  if (isCustomized) {
    const { getPersonalizedTrips } = await import('@/services/personalizedTripsService');
    return getPersonalizedTrips({
      ...(typeof filters === 'object' ? filters : {}),
      limit: filters?.limit ?? 50,
      sort: filters?.sort ?? 'featured',
    });
  }

  return withPublicDataFetch({
    context: 'tours',
    mock: () => (params ? filterMockTours(params) : mockTours.map(normaliseTour)),
    run: async () => {
      const data = await publicFetch(`/tours${toQuery(params)}`);
      return normaliseList(pickList(data));
    },
  });
};

function mergePersonalizedFields(tour, pkg) {
  if (!pkg) return tour;
  return {
    ...tour,
    state: pkg.state ?? tour.state,
    packageCategory: pkg.packageCategory ?? tour.packageCategory,
    experienceCategory: pkg.packageCategory || pkg.experienceCategory || tour.experienceCategory,
    ctaData: pkg.ctaData ?? tour.ctaData,
    seoTitle: pkg.seoTitle ?? tour.seoTitle,
    seoDescription: pkg.seoDescription ?? tour.seoDescription,
    gallery:
      (Array.isArray(tour.gallery) && tour.gallery.length ? tour.gallery : null) ||
      pkg.gallery ||
      [],
  };
}

function slugCandidates(idOrSlug) {
  const raw = String(idOrSlug || '').trim();
  if (!raw) return [];
  const candidates = [raw];
  const withoutDate = raw.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  if (withoutDate !== raw) candidates.push(withoutDate);
  return [...new Set(candidates)];
}

async function fetchTourRecord(encodedId) {
  const data = await publicFetch(`/tours/${encodedId}`);
  const tour = normaliseTour(data);

  if (String(tour?.category || '').toLowerCase() === 'upcoming') {
    try {
      const departure = await publicFetch(`/upcoming-departures/${encodedId}`);
      return normaliseTour({ ...tour, ...departure });
    } catch {
      return tour;
    }
  }

  if (String(tour?.category || '').toLowerCase() === 'customized') {
    try {
      const pkg = await publicFetch(`/personalized-trips/${encodedId}`);
      return mergePersonalizedFields(tour, pkg);
    } catch {
      return tour;
    }
  }

  return tour;
}

export const getTourById = async (idOrSlug) => {
  const candidates = slugCandidates(idOrSlug);

  for (const candidate of candidates) {
    const encodedId = encodeURIComponent(candidate);
    try {
      return await fetchTourRecord(encodedId);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[getTourById]', candidate, err?.message || err);
      }
    }
  }

  for (const candidate of candidates) {
    const encodedId = encodeURIComponent(candidate);
    try {
      const pkg = await publicFetch(`/personalized-trips/${encodedId}`);
      return mergePersonalizedFields(normaliseTour(pkg), pkg);
    } catch {
      /* try next candidate */
    }
  }

  if (!shouldUseMockFallback()) return null;
  const match = mockTours.find((tour) =>
    candidates.some(
      (candidate) => String(tour.id) === String(candidate) || tour.slug === candidate
    )
  );
  return match ? normaliseTour(match) : null;
};
