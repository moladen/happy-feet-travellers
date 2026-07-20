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

function tourMatchesExperience(tour, categoryValue) {
  const c = String(categoryValue || '').trim().toLowerCase();
  if (!c || c === 'customized' || c === 'upcoming') return true;

  const keywords = {
    honeymoon: ['honeymoon', 'romantic', 'anniversary', 'wedding'],
    adventure: ['adventure', 'trek', 'trekking', 'expedition', 'himalaya'],
    spiritual: ['spiritual', 'temple', 'pilgrim', 'ashram', 'meditation'],
    family: ['family', 'kids', 'children', 'parents'],
    wildlife: ['wildlife', 'safari'],
    'road trips': ['road trip', 'roadtrip', 'self-drive'],
    mountains: ['mountain', 'himalaya', 'hills', 'spiti', 'ladakh'],
    beaches: ['beach', 'coastal', 'goa', 'andaman'],
  }[c] || [c];

  const pkg = String(tour.packageCategory || tour.experienceCategory || '').toLowerCase();
  if (pkg === c || pkg.includes(c)) return true;

  const tags = (Array.isArray(tour.tags) ? tour.tags : []).map((t) => String(t).toLowerCase());
  if (tags.some((t) => t === c || keywords.some((k) => t.includes(k)))) return true;

  const hay = [tour.title, tour.description, tour.suitableFor, tour.destination, tour.subCategory]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return keywords.some((k) => hay.includes(k));
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
    list = list.filter((t) =>
      tourMatchesExperience(t, params.packageCategory || params.category)
    );
  }
  if (params.featured === 'true' || params.featured === true) {
    list = list.filter((t) => t.featured);
  }
  const effectivePrice = (t) => {
    const start = Number(t.startingPrice);
    const price = Number(t.price);
    if (Number.isFinite(start) && start > 0) return start;
    return Number.isFinite(price) ? price : 0;
  };
  if (params.minPrice) {
    list = list.filter((t) => effectivePrice(t) >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    list = list.filter((t) => effectivePrice(t) <= Number(params.maxPrice));
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
