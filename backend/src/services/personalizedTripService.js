const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');
const { generateSlug } = require('@/utils/slugGenerator');
const { persistTourMediaInPayload } = require('@/utils/tourMedia');
const {
  PERSONALIZED_CATEGORY,
  PACKAGE_STATUS,
  PACKAGE_CATEGORIES,
} = require('@/constants/personalizedTrips');

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
const JSON_FIELDS = [
  'itinerary',
  'faqs',
  'pickupPoints',
  'supplements',
  'terms',
  'ctaData',
];

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

function normaliseCtaData(cta) {
  if (!cta || typeof cta !== 'object') return null;
  const primaryLabel = String(cta.primaryLabel || cta.label || '').trim();
  const primaryHref = String(cta.primaryHref || cta.href || '').trim();
  if (!primaryLabel && !primaryHref) return null;
  return {
    primaryLabel: primaryLabel || 'Explore journey',
    primaryHref: primaryHref || '/contact',
    secondaryLabel: String(cta.secondaryLabel || '').trim() || null,
    secondaryHref: String(cta.secondaryHref || '').trim() || null,
    headline: String(cta.headline || '').trim() || null,
  };
}

function normalisePackageCategory(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const match = PACKAGE_CATEGORIES.find(
    (c) => c.toLowerCase() === raw.toLowerCase()
  );
  return match || raw;
}

function normalisePayload(payload, { isCreate = false } = {}) {
  const data = { ...payload, category: PERSONALIZED_CATEGORY };

  if (data.packageCategory !== undefined) {
    data.packageCategory = normalisePackageCategory(data.packageCategory);
  }
  if (data.state !== undefined) {
    data.state = String(data.state || '').trim() || null;
  }
  if (data.destination !== undefined) {
    data.destination = String(data.destination || '').trim() || null;
  }
  if (data.tags !== undefined) data.tags = normaliseTags(data.tags);
  if (data.ctaData !== undefined) data.ctaData = normaliseCtaData(data.ctaData);
  if (data.featured !== undefined) data.featured = Boolean(data.featured);
  if (data.status !== undefined) {
    data.status = String(data.status).trim().toLowerCase() || PACKAGE_STATUS.ACTIVE;
  } else if (isCreate) {
    data.status = PACKAGE_STATUS.ACTIVE;
  }

  if (data.bookingDeposit !== undefined) {
    const amount = Number(data.bookingDeposit);
    data.bookingDeposit =
      Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
  }

  if (data.seoTitle !== undefined) {
    data.seoTitle = String(data.seoTitle || '').trim() || null;
  }
  if (data.seoDescription !== undefined) {
    data.seoDescription = String(data.seoDescription || '').trim() || null;
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

function publicPackageWhere() {
  return {
    category: PERSONALIZED_CATEGORY,
    status: PACKAGE_STATUS.ACTIVE,
  };
}

/** Keywords aligned with frontend card tags (personalizedTourExperience.js). */
const EXPERIENCE_FILTER_KEYWORDS = {
  honeymoon: ['honeymoon', 'romantic', 'anniversary', 'wedding'],
  adventure: ['adventure', 'trek', 'trekking', 'expedition', 'himalaya'],
  spiritual: ['spiritual', 'temple', 'pilgrim', 'ashram', 'meditation', 'varanasi', 'rishikesh'],
  family: ['family', 'kids', 'children', 'parents'],
  wildlife: ['wildlife', 'safari', 'national park'],
  'road trips': ['road trip', 'roadtrip', 'self-drive', 'highway'],
  mountains: ['mountain', 'himalaya', 'hills', 'spiti', 'ladakh'],
  beaches: ['beach', 'coastal', 'goa', 'andaman', 'lakshadweep'],
};

function titleCase(word) {
  return String(word || '')
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

/**
 * Match Experience filter the same way cards show tags:
 * packageCategory OR personality tags OR title/description keywords.
 */
function buildExperienceCategoryOr(pkgCat) {
  const normalised = normalisePackageCategory(pkgCat);
  const key = String(normalised || pkgCat || '')
    .trim()
    .toLowerCase();
  if (!key) return null;

  const keywords = EXPERIENCE_FILTER_KEYWORDS[key] || [key];
  const or = [];

  if (normalised) {
    or.push({ packageCategory: { equals: normalised, mode: 'insensitive' } });
  }
  or.push({ packageCategory: { contains: key, mode: 'insensitive' } });

  const tagVariants = new Set([
    normalised,
    titleCase(key),
    ...keywords.map((k) => titleCase(k)),
    ...keywords,
  ].filter(Boolean));

  if (key === 'honeymoon') {
    tagVariants.add('Honeymoon Escape');
    tagVariants.add('Best for Couples');
  }
  if (key === 'family') tagVariants.add('Family Time');
  if (key === 'beaches') tagVariants.add('Coastal Escape');

  for (const tag of tagVariants) {
    or.push({ tags: { has: tag } });
  }

  for (const kw of keywords) {
    or.push({ title: { contains: kw, mode: 'insensitive' } });
    or.push({ description: { contains: kw, mode: 'insensitive' } });
    or.push({ suitableFor: { contains: kw, mode: 'insensitive' } });
    or.push({ destination: { contains: kw, mode: 'insensitive' } });
  }

  return or;
}

function buildListWhere(query, { admin = false } = {}) {
  const where = admin
    ? { category: PERSONALIZED_CATEGORY }
    : publicPackageWhere();

  const and = [];

  if (admin) {
    if (query.includeDraft !== 'true') {
      where.status = { not: PACKAGE_STATUS.ARCHIVED };
    }
    if (query.status) {
      where.status = String(query.status).toLowerCase();
    }
  }

  if (query.featured === 'true') {
    where.featured = true;
  }

  if (query.state) {
    where.state = { equals: String(query.state), mode: 'insensitive' };
  }

  if (query.destination) {
    where.destination = { contains: String(query.destination), mode: 'insensitive' };
  }

  const pkgCat = query.packageCategory || query.category;
  if (pkgCat && pkgCat !== 'customized' && pkgCat !== 'upcoming') {
    const experienceOr = buildExperienceCategoryOr(pkgCat);
    if (experienceOr?.length) and.push({ OR: experienceOr });
  }

  if (query.subCategory) {
    where.subCategory = String(query.subCategory);
  }

  if (query.tag) {
    where.tags = { has: String(query.tag) };
  }

  if (query.minPrice || query.maxPrice) {
    const priceFilter = {};
    if (query.minPrice) priceFilter.gte = parseFloat(query.minPrice);
    if (query.maxPrice) priceFilter.lte = parseFloat(query.maxPrice);
    // Match either list price or startingPrice (admin may fill either)
    and.push({
      OR: [{ price: priceFilter }, { startingPrice: priceFilter }],
    });
  }

  if (query.minDuration || query.maxDuration) {
    where.duration = {};
    if (query.minDuration) where.duration.gte = parseInt(query.minDuration, 10);
    if (query.maxDuration) where.duration.lte = parseInt(query.maxDuration, 10);
  } else if (query.duration) {
    where.duration = parseInt(query.duration, 10);
  }

  const search = String(query.search || query.q || '').trim();
  if (search) {
    and.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { packageCategory: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  if (and.length) where.AND = and;

  return where;
}

function resolveOrderBy(query) {
  if (query.sort === 'priceAsc') return { price: 'asc' };
  if (query.sort === 'priceDesc') return { price: 'desc' };
  if (query.sort === 'durationAsc') return { duration: 'asc' };
  if (query.sort === 'durationDesc') return { duration: 'desc' };
  if (query.sort === 'title') return { title: 'asc' };
  if (query.sort === 'featured') return [{ featured: 'desc' }, { title: 'asc' }];
  return [{ featured: 'desc' }, { createdAt: 'desc' }];
}

async function buildFacets(where) {
  const rows = await prisma.tour.findMany({
    where,
    select: {
      state: true,
      packageCategory: true,
      destination: true,
    },
  });

  const states = new Set();
  const categories = new Set();
  const destinations = new Set();

  for (const row of rows) {
    if (row.state) states.add(row.state);
    if (row.packageCategory) categories.add(row.packageCategory);
    if (row.destination) destinations.add(row.destination);
  }

  return {
    states: [...states].sort(),
    packageCategories: [...categories].sort(),
    destinations: [...destinations].sort(),
    allowedCategories: PACKAGE_CATEGORIES,
  };
}

function mapPackage(tour) {
  return {
    ...tour,
    gallery: Array.isArray(tour.images) ? tour.images : [],
    image: tour.coverImage,
    category: tour.category,
    experienceCategory: tour.packageCategory,
  };
}

async function listPackages(query, { admin = false } = {}) {
  return withDatabaseErrors(async () => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const where = buildListWhere(query, { admin });
    const orderBy = resolveOrderBy(query);

    const [rows, total, facets] = await Promise.all([
      prisma.tour.findMany({ where, skip, take: limit, orderBy }),
      prisma.tour.count({ where }),
      query.includeFacets === 'true'
        ? buildFacets(admin ? { category: PERSONALIZED_CATEGORY } : publicPackageWhere())
        : null,
    ]);

    const packages = rows.map(mapPackage);

    return {
      packages,
      tours: packages,
      facets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 0,
      },
    };
  });
}

async function getPackage(idOrSlug, { admin = false } = {}) {
  return withDatabaseErrors(async () => {
    if (!idOrSlug) throw AppError.badRequest('Package identifier required');

    const where = {
      category: PERSONALIZED_CATEGORY,
      OR: [{ id: String(idOrSlug) }, { slug: String(idOrSlug) }],
    };
    if (!admin) {
      where.status = PACKAGE_STATUS.ACTIVE;
    }

    const tour = await prisma.tour.findFirst({ where });
    if (!tour) throw AppError.notFound('Personalized trip package not found');

    return mapPackage(tour);
  });
}

async function createPackage(payload) {
  return withDatabaseErrors(async () => {
    const mediaPayload = persistTourMediaInPayload(payload);
    const slug = generateSlug(mediaPayload.slug || mediaPayload.title);
    const exists = await prisma.tour.findUnique({ where: { slug } });
    if (exists) throw AppError.conflict('A package with this slug already exists');

    const data = normalisePayload(
      {
        ...mediaPayload,
        slug,
        images: mediaPayload.images || [],
        highlights: mediaPayload.highlights || [],
        inclusions: mediaPayload.inclusions || [],
        exclusions: mediaPayload.exclusions || [],
        thingsToCarry: mediaPayload.thingsToCarry || [],
        tags: normaliseTags(mediaPayload.tags),
        itinerary: mediaPayload.itinerary ?? null,
        faqs: mediaPayload.faqs ?? null,
        pickupPoints: mediaPayload.pickupPoints ?? null,
        supplements: mediaPayload.supplements ?? null,
        terms: mediaPayload.terms ?? null,
        ctaData: mediaPayload.ctaData ?? null,
      },
      { isCreate: true }
    );

    const created = await prisma.tour.create({ data });
    return mapPackage(created);
  });
}

async function updatePackage(id, payload) {
  return withDatabaseErrors(async () => {
    const existing = await prisma.tour.findFirst({
      where: { id },
    });
    if (!existing) throw AppError.notFound('Personalized trip package not found');

    const data = normalisePayload(persistTourMediaInPayload(payload));
    if (data.title || data.slug) {
      const newSlug = generateSlug(data.slug || data.title || existing.title);
      const conflict = await prisma.tour.findUnique({ where: { slug: newSlug } });
      if (conflict && conflict.id !== id) {
        throw AppError.conflict('A package with this slug already exists');
      }
      data.slug = newSlug;
    }

    const updated = await prisma.tour.update({ where: { id }, data });
    return mapPackage(updated);
  });
}

async function deletePackage(id) {
  return withDatabaseErrors(async () => {
    const existing = await prisma.tour.findFirst({
      where: { id, category: PERSONALIZED_CATEGORY },
    });
    if (!existing) throw AppError.notFound('Personalized trip package not found');
    await prisma.tour.delete({ where: { id } });
  });
}

module.exports = {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  PACKAGE_CATEGORIES,
};
