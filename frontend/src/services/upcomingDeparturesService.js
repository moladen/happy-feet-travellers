import { mockTours } from '@/data/mockData';
import { publicFetch } from '@/lib/publicApi';
import { isNotFoundError, withPublicDataFetch } from '@/lib/publicApiError';

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
  const q = String(params.q || params.search || '')
    .trim()
    .toLowerCase();
  if (q) {
    list = list.filter((t) =>
      [t.title, t.description, t.subCategory, t.destination]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }
  if (params.featured === 'true' || params.featured === true) {
    list = list.filter((t) => t.featured);
  }
  if (params.subCategory) {
    list = list.filter((t) => t.subCategory === params.subCategory);
  }
  if (params.destination) {
    const d = String(params.destination).toLowerCase();
    list = list.filter((t) => String(t.destination || t.title).toLowerCase().includes(d));
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

export async function getUpcomingDepartureBySlug(slug) {
  try {
    const id = encodeURIComponent(String(slug));
    const data = await publicFetch(`/upcoming-departures/${id}`);
    const [one] = await normaliseDepartures([data]);
    return one ?? null;
  } catch (err) {
    if (isNotFoundError(err)) return null;
    return withPublicDataFetch({
      context: 'departures',
      mock: async () => {
        const match = mockTours.find(
          (t) => t.category === 'upcoming' && (t.slug === slug || String(t.id) === String(slug))
        );
        const [one] = match ? await normaliseDepartures([match]) : [];
        return one ?? null;
      },
      run: async () => {
        throw err;
      },
    });
  }
}
