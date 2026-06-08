const prisma = require('@/config/database');
const { getRelatedForTour } = require('@/services/contentLinkingService');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');
const { generateSlug } = require('@/utils/slugGenerator');
const { activeDepartureWhere } = require('@/utils/departureExpiry');
const upcomingDepartureService = require('@/services/upcomingDepartureService');

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
    const active = activeDepartureWhere();
    Object.assign(where, active);
    if (q.featured === 'true') where.featured = true;
    if (q.destination) {
      where.destination = { contains: String(q.destination), mode: 'insensitive' };
    }
    if (q.tag) where.tags = { has: String(q.tag) };
  }

  if (q.category === 'customized' && q.includeDraft !== 'true') {
    where.category = 'customized';
    where.status = 'active';
    if (q.featured === 'true') where.featured = true;
    if (q.state) where.state = { equals: String(q.state), mode: 'insensitive' };
    if (q.packageCategory) {
      where.packageCategory = { equals: String(q.packageCategory), mode: 'insensitive' };
    }
    if (q.destination) {
      where.destination = { contains: String(q.destination), mode: 'insensitive' };
    }
    if (q.tag) where.tags = { has: String(q.tag) };
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
    if (query.category === 'upcoming' && query.includeArchived !== 'true') {
      await upcomingDepartureService.archiveExpiredDepartures();
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;
    const where = buildWhere(query);

    const orderBy =
      query.sort === 'priceAsc'
        ? { price: 'asc' }
        : query.sort === 'priceDesc'
          ? { price: 'desc' }
          : query.sort === 'startDate' || query.category === 'upcoming'
            ? [{ featured: 'desc' }, { startDate: 'asc' }]
            : query.category === 'customized'
              ? [{ featured: 'desc' }, { title: 'asc' }]
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
    const related = await getRelatedForTour(tour);
    return { ...tour, relatedBlogs: related.blogs, relatedLandingPage: related.landingPage };
  });
}

const ARRAY_FIELDS = [
  'images',
  'highlights',
  'inclusions',
  'exclusions',
  'thingsToCarry',
  'tags',
  'topicKeys',
  'relatedBlogSlugs',
];
const JSON_FIELDS = ['itinerary', 'faqs', 'pickupPoints', 'supplements', 'terms'];

function normaliseTourPayload(payload) {
  const data = { ...payload };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);
  if (data.bookingDeposit !== undefined) {
    const amount = Number(data.bookingDeposit);
    data.bookingDeposit =
      Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
  }
  if (data.tags !== undefined) {
    data.tags = Array.isArray(data.tags)
      ? data.tags.map((t) => String(t).trim()).filter(Boolean)
      : [];
  }
  if (data.featured !== undefined) data.featured = Boolean(data.featured);
  if (data.status !== undefined) data.status = String(data.status).trim().toLowerCase();
  if (data.ctaData !== undefined && data.ctaData !== null && typeof data.ctaData === 'object') {
    data.ctaData = data.ctaData;
  }
  if (data.packageCategory !== undefined) {
    data.packageCategory = String(data.packageCategory || '').trim() || null;
  }
  if (data.state !== undefined) data.state = String(data.state || '').trim() || null;
  if (data.seoTitle !== undefined) data.seoTitle = String(data.seoTitle || '').trim() || null;
  if (data.seoDescription !== undefined) {
    data.seoDescription = String(data.seoDescription || '').trim() || null;
  }
  if (data.landingPageSlug !== undefined) {
    data.landingPageSlug = String(data.landingPageSlug || '').trim() || null;
  }
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
    if (String(payload?.category || '').toLowerCase() === 'upcoming') {
      return upcomingDepartureService.createDeparture({
        ...payload,
        category: 'upcoming',
      });
    }

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
    const existing = await prisma.tour.findFirst({ where: { id } });
    const nextCategory = String(updateData?.category || existing?.category || '').toLowerCase();
    if (nextCategory === 'upcoming') {
      return upcomingDepartureService.updateDeparture(id, {
        ...updateData,
        category: 'upcoming',
      });
    }

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
