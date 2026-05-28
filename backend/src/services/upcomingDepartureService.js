const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');
const { generateSlug } = require('@/utils/slugGenerator');
const {
  DEPARTURE_STATUS,
  UPCOMING_CATEGORY,
} = require('@/constants/upcomingDepartures');
const {
  activeDepartureWhere,
  expiredDepartureWhere,
  isDepartureStillActive,
  isDepartureDateStillValid,
} = require('@/utils/departureExpiry');

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const ARRAY_FIELDS = ['images', 'highlights', 'inclusions', 'exclusions', 'thingsToCarry', 'tags'];
const JSON_FIELDS = ['itinerary', 'faqs', 'pickupPoints', 'supplements', 'terms'];

function normaliseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(/[\n,]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function parseDateOnly(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalisePayload(payload, { isCreate = false } = {}) {
  const data = { ...payload, category: UPCOMING_CATEGORY };

  if (data.startDate !== undefined) data.startDate = parseDateOnly(data.startDate);
  if (data.endDate !== undefined) data.endDate = parseDateOnly(data.endDate);
  if (data.dateLabel !== undefined) {
    const label = String(data.dateLabel || '').trim();
    data.dateLabel = label || null;
  }
  if (data.tags !== undefined) data.tags = normaliseTags(data.tags);
  if (data.featured !== undefined) data.featured = Boolean(data.featured);
  if (data.status !== undefined) {
    data.status = String(data.status).trim().toLowerCase() || DEPARTURE_STATUS.ACTIVE;
  } else if (isCreate) {
    data.status = DEPARTURE_STATUS.ACTIVE;
  }

  if (data.bookingDeposit !== undefined) {
    const amount = Number(data.bookingDeposit);
    data.bookingDeposit =
      Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
  }

  for (const f of ARRAY_FIELDS) {
    if (data[f] === undefined) continue;
    if (!Array.isArray(data[f])) data[f] = [];
  }
  for (const f of JSON_FIELDS) {
    if (data[f] === undefined) continue;
  }

  return data;
}

/** Future-dated batches should be visible unless explicitly saved as draft. */
function applyWebsitePublishStatus(data, merged, explicitStatus) {
  const status = explicitStatus ?? String(merged.status || DEPARTURE_STATUS.ACTIVE).toLowerCase();

  if (status === DEPARTURE_STATUS.DRAFT) {
    data.status = DEPARTURE_STATUS.DRAFT;
    return data;
  }

  if (isDepartureDateStillValid(merged)) {
    data.status = DEPARTURE_STATUS.ACTIVE;
    return data;
  }

  if (status === DEPARTURE_STATUS.ARCHIVED) {
    data.status = DEPARTURE_STATUS.ARCHIVED;
  }

  return data;
}

/** Undo mistaken auto-archive when end/start dates are still in the future. */
async function republishFutureArchivedDepartures() {
  const archived = await prisma.tour.findMany({
    where: {
      category: UPCOMING_CATEGORY,
      status: DEPARTURE_STATUS.ARCHIVED,
    },
  });

  const ids = archived.filter((row) => isDepartureDateStillValid(row)).map((row) => row.id);
  if (!ids.length) return 0;

  const result = await prisma.tour.updateMany({
    where: { id: { in: ids } },
    data: { status: DEPARTURE_STATUS.ACTIVE },
  });
  return result.count;
}

function buildSlug(payload) {
  const base = generateSlug(payload.slug || payload.title);
  if (payload.startDate) {
    const d = new Date(payload.startDate);
    if (!Number.isNaN(d.getTime())) {
      const stamp = d.toISOString().slice(0, 10);
      return `${base}-${stamp}`;
    }
  }
  return base;
}

function buildListWhere(query, { admin = false } = {}) {
  const where = admin
    ? { category: UPCOMING_CATEGORY }
    : { ...activeDepartureWhere() };

  if (admin) {
    if (query.includeArchived !== 'true') {
      where.status = { not: DEPARTURE_STATUS.ARCHIVED };
    }
    if (query.status) {
      where.status = String(query.status).toLowerCase();
    }
  }

  if (query.featured === 'true') {
    where.featured = true;
  }

  if (query.destination) {
    where.destination = { contains: String(query.destination), mode: 'insensitive' };
  }

  if (query.subCategory) {
    where.subCategory = String(query.subCategory);
  }

  if (query.tag) {
    where.tags = { has: String(query.tag) };
  }

  if (query.seriesSlug) {
    where.seriesSlug = String(query.seriesSlug);
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  if (query.minDuration || query.maxDuration) {
    where.duration = {};
    if (query.minDuration) where.duration.gte = parseInt(query.minDuration, 10);
    if (query.maxDuration) where.duration.lte = parseInt(query.maxDuration, 10);
  }

  if (query.month) {
    const idx = MONTHS.indexOf(String(query.month).toLowerCase());
    if (idx >= 0) {
      const year = parseInt(query.year, 10) || new Date().getFullYear();
      const start = new Date(year, idx, 1);
      const end = new Date(year, idx + 1, 1);
      where.startDate = { gte: start, lt: end };
    }
  }

  const search = String(query.search || query.q || '').trim();
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { destination: { contains: search, mode: 'insensitive' } },
      { departureCity: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  return where;
}

function resolveOrderBy(query) {
  if (query.sort === 'priceAsc') return { price: 'asc' };
  if (query.sort === 'priceDesc') return { price: 'desc' };
  if (query.sort === 'featured') return [{ featured: 'desc' }, { startDate: 'asc' }];
  if (query.sort === 'createdAt') return { createdAt: 'desc' };
  if (query.sort === 'startDate') return [{ featured: 'desc' }, { startDate: 'asc' }, { createdAt: 'desc' }];
  return [{ featured: 'desc' }, { startDate: 'asc' }, { createdAt: 'desc' }];
}

/** Auto-archive expired batches (recurring departures drop off when dates pass). */
async function archiveExpiredDepartures() {
  return prisma.tour.updateMany({
    where: expiredDepartureWhere(),
    data: { status: DEPARTURE_STATUS.ARCHIVED },
  });
}

function mapDeparture(tour) {
  return {
    ...tour,
    isActive: isDepartureStillActive(tour),
  };
}

async function listDepartures(query, { admin = false } = {}) {
  return withDatabaseErrors(async () => {
    if (!admin) {
      await republishFutureArchivedDepartures();
      await archiveExpiredDepartures();
    }

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const where = buildListWhere(query, { admin });
    const orderBy = resolveOrderBy(query);

    const [rows, total] = await Promise.all([
      prisma.tour.findMany({ where, skip, take: limit, orderBy }),
      prisma.tour.count({ where }),
    ]);

    const departures = rows.map(mapDeparture);

    return {
      departures,
      /** @deprecated use departures — kept for /tours compatibility */
      tours: departures,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 0,
      },
    };
  });
}

async function getDeparture(idOrSlug) {
  return withDatabaseErrors(async () => {
    if (!idOrSlug) throw AppError.badRequest('Departure identifier required');

    const tour = await prisma.tour.findFirst({
      where: {
        category: UPCOMING_CATEGORY,
        OR: [{ id: String(idOrSlug) }, { slug: String(idOrSlug) }],
      },
    });

    if (!tour) throw AppError.notFound('Upcoming departure not found');

    if (tour.status === DEPARTURE_STATUS.ARCHIVED || !isDepartureStillActive(tour)) {
      throw AppError.notFound('This departure is no longer available');
    }

    return mapDeparture(tour);
  });
}

async function createDeparture(payload) {
  return withDatabaseErrors(async () => {
    const slug = buildSlug(payload);
    const exists = await prisma.tour.findUnique({ where: { slug } });
    if (exists) throw AppError.conflict('A departure with this slug already exists');

    const data = normalisePayload(
      {
        ...payload,
        slug,
        images: payload.images || [],
        highlights: payload.highlights || [],
        inclusions: payload.inclusions || [],
        exclusions: payload.exclusions || [],
        thingsToCarry: payload.thingsToCarry || [],
        tags: normaliseTags(payload.tags),
        itinerary: payload.itinerary ?? null,
        faqs: payload.faqs ?? null,
        pickupPoints: payload.pickupPoints ?? null,
        supplements: payload.supplements ?? null,
        terms: payload.terms ?? null,
      },
      { isCreate: true }
    );

    const explicitStatus = payload.status !== undefined ? String(payload.status).toLowerCase() : null;
    applyWebsitePublishStatus(data, data, explicitStatus);

    const created = await prisma.tour.create({ data });
    return mapDeparture(created);
  });
}

async function updateDeparture(id, payload) {
  return withDatabaseErrors(async () => {
    const existing = await prisma.tour.findFirst({
      where: { id },
    });
    if (!existing) throw AppError.notFound('Upcoming departure not found');

    const data = normalisePayload(payload);
    if (data.title || data.slug || data.startDate) {
      const newSlug = buildSlug({
        slug: data.slug || data.title || existing.title,
        startDate: data.startDate || existing.startDate,
        title: data.title || existing.title,
      });
      const conflict = await prisma.tour.findUnique({ where: { slug: newSlug } });
      if (conflict && conflict.id !== id) {
        throw AppError.conflict('A departure with this slug already exists');
      }
      data.slug = newSlug;
    }

    const merged = { ...existing, ...data, category: UPCOMING_CATEGORY };
    const explicitStatus =
      payload.status !== undefined ? String(payload.status).toLowerCase() : null;

    applyWebsitePublishStatus(data, merged, explicitStatus);

    const updated = await prisma.tour.update({ where: { id }, data });
    return mapDeparture(updated);
  });
}

async function deleteDeparture(id) {
  return withDatabaseErrors(async () => {
    const existing = await prisma.tour.findFirst({
      where: { id },
    });
    if (!existing) throw AppError.notFound('Upcoming departure not found');
    await prisma.tour.delete({ where: { id } });
  });
}

module.exports = {
  listDepartures,
  getDeparture,
  createDeparture,
  updateDeparture,
  deleteDeparture,
  archiveExpiredDepartures,
  republishFutureArchivedDepartures,
};
