import { mockTours } from '@/data/mockData';
import { publicFetch } from '@/lib/publicApi';
import { isNotFoundError, withPublicDataFetch } from '@/lib/publicApiError';
import {
  tourMatchesSearchQuery,
  tourMatchesSubCategory,
} from '@/lib/tourSearchKeywords';

async function normaliseDepartures(list) {
  const { normaliseTour } = await import('@/services/toursService');
  return (Array.isArray(list) ? list : []).map(normaliseTour);
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

async function pickDepartures(data) {
  const raw = Array.isArray(data)
    ? data
    : data?.departures || data?.tours || [];
  return normaliseDepartures(raw);
}

const filterMockUpcoming = (params = {}) => {
  let list = mockTours.filter((t) => t.category === 'upcoming');
  const q = params.q || params.search || '';
  if (q) {
    list = list.filter((t) => tourMatchesSearchQuery(t, q));
  }
  if (params.featured === 'true' || params.featured === true) {
    list = list.filter((t) => t.featured);
  }
  if (params.subCategory) {
    list = list.filter((t) => tourMatchesSubCategory(t, params.subCategory));
  }
  if (params.destination) {
    list = list.filter((t) => tourMatchesSearchQuery(t, params.destination));
  }
  return normaliseDepartures(list);
};

/**
 * Public upcoming departures (auto-hides expired, archives on read).
 */
export async function getUpcomingDepartures(params = {}) {
  const query = {
    limit: params.limit ?? 50,
    sort: params.sort ?? 'startDate',
    ...params,
  };

  return withPublicDataFetch({
    context: 'departures',
    mock: () => filterMockUpcoming(query),
    run: async () => {
      const data = await publicFetch(`/upcoming-departures${toQuery(query)}`);
      return pickDepartures(data);
    },
  });
}

function slugCandidates(slug) {
  const raw = String(slug || '').trim();
  if (!raw) return [];
  const candidates = [raw];
  const withoutDate = raw.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  if (withoutDate !== raw) candidates.push(withoutDate);
  return [...new Set(candidates)];
}

export async function getUpcomingDepartureBySlug(slug) {
  for (const candidate of slugCandidates(slug)) {
    try {
      const id = encodeURIComponent(candidate);
      const data = await publicFetch(`/upcoming-departures/${id}`);
      const [one] = await normaliseDepartures([data]);
      if (one) return one;
    } catch (err) {
      if (!isNotFoundError(err)) {
        return withPublicDataFetch({
          context: 'departures',
          mock: async () => null,
          run: async () => {
            throw err;
          },
        });
      }
    }
  }

  return withPublicDataFetch({
    context: 'departures',
    mock: async () => {
      const match = mockTours.find(
        (t) =>
          t.category === 'upcoming' &&
          slugCandidates(slug).some(
            (candidate) => t.slug === candidate || String(t.id) === String(candidate)
          )
      );
      const [one] = match ? await normaliseDepartures([match]) : [];
      return one ?? null;
    },
    run: async () => null,
  });
}
