import { mockTours } from '@/data/mockData';
import { publicFetch } from '@/lib/publicApi';
import { isNotFoundError, withPublicDataFetch } from '@/lib/publicApiError';

async function normalisePackages(list) {
  const { normaliseTour } = await import('@/services/toursService');
  return (Array.isArray(list) ? list : []).map((pkg) => {
    const tour = normaliseTour(pkg);
    return {
      ...tour,
      experienceCategory: pkg.packageCategory || pkg.experienceCategory || null,
      state: pkg.state || null,
      ctaData: pkg.ctaData || null,
      seoTitle: pkg.seoTitle || null,
      seoDescription: pkg.seoDescription || null,
      gallery: tour.gallery || [],
    };
  });
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

async function pickPackages(data) {
  const raw = Array.isArray(data)
    ? data
    : data?.packages || data?.tours || [];
  return normalisePackages(raw);
}

function filterMock(params = {}) {
  let list = mockTours.filter((t) => t.category === 'customized');
  const q = String(params.q || params.search || '')
    .trim()
    .toLowerCase();
  if (q) {
    list = list.filter((t) =>
      [t.title, t.description, t.destination, t.state, t.packageCategory]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }
  if (params.state) {
    const s = String(params.state).toLowerCase();
    list = list.filter((t) => String(t.state || '').toLowerCase() === s);
  }
  if (params.packageCategory || params.category) {
    const c = String(params.packageCategory || params.category).toLowerCase();
    if (c !== 'customized' && c !== 'upcoming') {
      list = list.filter(
        (t) =>
          String(t.packageCategory || t.subCategory || '').toLowerCase().includes(c)
      );
    }
  }
  if (params.featured === 'true' || params.featured === true) {
    list = list.filter((t) => t.featured);
  }
  if (params.minPrice) {
    list = list.filter((t) => Number(t.price) >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    list = list.filter((t) => Number(t.price) <= Number(params.maxPrice));
  }
  return normalisePackages(list);
}

export async function getPersonalizedTrips(params = {}) {
  const query = {
    limit: params.limit ?? 50,
    sort: params.sort ?? 'featured',
    includeFacets: params.includeFacets ?? 'false',
    ...params,
  };

  return withPublicDataFetch({
    context: 'personalized',
    mock: () => filterMock(query),
    run: async () => {
      const data = await publicFetch(`/personalized-trips${toQuery(query)}`);
      return pickPackages(data);
    },
  });
}

export async function getPersonalizedTripsWithMeta(params = {}) {
  const query = { includeFacets: 'true', ...params };
  try {
    const data = await publicFetch(`/personalized-trips${toQuery(query)}`);
    const packages = await pickPackages(data);
    return {
      packages,
      facets: data?.facets || null,
      pagination: data?.pagination || null,
    };
  } catch (err) {
    const packages = await withPublicDataFetch({
      context: 'personalized',
      mock: () => filterMock(query),
      run: async () => {
        throw err;
      },
    });
    return { packages, facets: null, pagination: null, error: true };
  }
}

export async function getPersonalizedTripBySlug(slug) {
  try {
    const id = encodeURIComponent(String(slug));
    const data = await publicFetch(`/personalized-trips/${id}`);
    const [one] = await normalisePackages([data]);
    return one ?? null;
  } catch (err) {
    if (isNotFoundError(err)) return null;
    return withPublicDataFetch({
      context: 'personalized',
      mock: async () => {
        const match = mockTours.find(
          (t) =>
            t.category === 'customized' &&
            (t.slug === slug || String(t.id) === String(slug))
        );
        const [one] = match ? await normalisePackages([match]) : [];
        return one ?? null;
      },
      run: async () => {
        throw err;
      },
    });
  }
}

export async function getPersonalizedCategories() {
  try {
    const data = await publicFetch('/personalized-trips/meta/categories');
    return data?.categories || [];
  } catch {
    return [];
  }
}
