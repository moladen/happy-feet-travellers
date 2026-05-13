const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');
const { generateSlug } = require('@/utils/slugGenerator');

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const buildWhere = (q) => {
  const where = {};
  if (q.category) where.category = q.category;
  if (q.subCategory) where.subCategory = q.subCategory;
  if (q.departureCity) where.departureCity = q.departureCity;

  if (q.minPrice || q.maxPrice) {
    where.price = {};
    if (q.minPrice) where.price.gte = parseFloat(q.minPrice);
    if (q.maxPrice) where.price.lte = parseFloat(q.maxPrice);
  }

  if (q.minDuration || q.maxDuration) {
    where.duration = {};
    if (q.minDuration) where.duration.gte = parseInt(q.minDuration, 10);
    if (q.maxDuration) where.duration.lte = parseInt(q.maxDuration, 10);
  } else if (q.duration) {
    where.duration = parseInt(q.duration, 10);
  }

  if (q.month) {
    const idx = MONTHS.indexOf(String(q.month).toLowerCase());
    if (idx >= 0) {
      const year = parseInt(q.year, 10) || new Date().getFullYear();
      const start = new Date(year, idx, 1);
      const end = new Date(year, idx + 1, 1);
      where.startDate = { gte: start, lt: end };
    }
  }

  if (q.upcoming === 'true' || q.category === 'upcoming') {
    where.startDate = where.startDate || { gte: new Date() };
  }

  if (q.search) {
    where.OR = [
      { title: { contains: q.search, mode: 'insensitive' } },
      { description: { contains: q.search, mode: 'insensitive' } },
    ];
  }

  return where;
};

async function listTours(query) {
  return withDatabaseErrors(async () => {
    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;
    const where = buildWhere(query);

    const orderBy =
      query.sort === 'priceAsc'
        ? { price: 'asc' }
        : query.sort === 'priceDesc'
          ? { price: 'desc' }
          : query.sort === 'startDate'
            ? { startDate: 'asc' }
            : { createdAt: 'desc' };

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({ where, skip, take: limit, orderBy }),
      prisma.tour.count({ where }),
    ]);

    return {
      tours,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  });
}

async function getTour(idOrSlug) {
  return withDatabaseErrors(async () => {
    if (!idOrSlug) throw AppError.badRequest('Tour identifier required');
    const tour = await prisma.tour.findFirst({
      where: { OR: [{ id: String(idOrSlug) }, { slug: String(idOrSlug) }] },
    });
    if (!tour) throw AppError.notFound('Tour not found');
    return tour;
  });
}

const ARRAY_FIELDS = ['images', 'highlights', 'inclusions', 'exclusions', 'thingsToCarry'];
const JSON_FIELDS = ['itinerary', 'faqs', 'pickupPoints', 'supplements', 'terms'];

function normaliseTourPayload(payload) {
  const data = { ...payload };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);
  for (const f of ARRAY_FIELDS) {
    if (data[f] === undefined) continue;
    if (!Array.isArray(data[f])) data[f] = [];
  }
  for (const f of JSON_FIELDS) {
    if (data[f] === undefined) continue;
    if (data[f] === null) data[f] = null;
  }
  return data;
}

async function createTour(payload) {
  return withDatabaseErrors(async () => {
    const slug = generateSlug(payload.slug || payload.title);
    const exists = await prisma.tour.findUnique({ where: { slug } });
    if (exists) throw AppError.conflict('Tour with this title already exists');

    const data = normaliseTourPayload({
      ...payload,
      slug,
      images: payload.images || [],
      highlights: payload.highlights || [],
      inclusions: payload.inclusions || [],
      exclusions: payload.exclusions || [],
      thingsToCarry: payload.thingsToCarry || [],
      itinerary: payload.itinerary ?? null,
      faqs: payload.faqs ?? null,
      pickupPoints: payload.pickupPoints ?? null,
      supplements: payload.supplements ?? null,
      terms: payload.terms ?? null,
    });

    return prisma.tour.create({ data });
  });
}

async function updateTour(id, updateData) {
  return withDatabaseErrors(async () => {
    const data = normaliseTourPayload(updateData);
    if (data.title || data.slug) {
      const newSlug = generateSlug(data.slug || data.title);
      const conflict = await prisma.tour.findUnique({ where: { slug: newSlug } });
      if (conflict && conflict.id !== id) {
        throw AppError.conflict('Tour with this title already exists');
      }
      data.slug = newSlug;
    }
    return prisma.tour.update({ where: { id }, data });
  });
}

async function deleteTour(id) {
  return withDatabaseErrors(() => prisma.tour.delete({ where: { id } }));
}

module.exports = {
  listTours,
  getTour,
  // legacy alias kept for backwards compatibility with existing controller code
  getTourBySlug: getTour,
  createTour,
  updateTour,
  deleteTour,
};
