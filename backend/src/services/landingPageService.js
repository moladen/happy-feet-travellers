const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');
const { generateSlug } = require('@/utils/slugGenerator');

const landingInclude = {
  packages: { orderBy: { sortOrder: 'asc' } },
  faqs: { orderBy: { sortOrder: 'asc' } },
  testimonials: { orderBy: { sortOrder: 'asc' } },
};

const publicLandingInclude = {
  packages: { where: { active: true }, orderBy: { sortOrder: 'asc' } },
  faqs: { orderBy: { sortOrder: 'asc' } },
  testimonials: { where: { active: true }, orderBy: { sortOrder: 'asc' } },
};

function normalizeStatus(status) {
  const s = String(status || 'draft').toLowerCase();
  return s === 'published' ? 'published' : 'draft';
}

function mapPackage(pkg, index) {
  const slug = generateSlug(pkg.slug || pkg.name || `package-${index + 1}`);
  return {
    slug,
    name: String(pkg.name || '').trim(),
    emoji: pkg.emoji || null,
    featuredImage: pkg.featuredImage || null,
    shortDescription: pkg.shortDescription || null,
    startingPrice: pkg.startingPrice || null,
    duration: pkg.duration || null,
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights.map(String) : [],
    viewDetailsUrl: pkg.viewDetailsUrl || null,
    detailContent: pkg.detailContent ?? null,
    sortOrder: Number.isFinite(pkg.sortOrder) ? pkg.sortOrder : index,
    active: pkg.active !== false,
  };
}

function mapFaq(faq, index) {
  return {
    category: String(faq.category || 'travel').toLowerCase(),
    question: String(faq.question || '').trim(),
    answer: String(faq.answer || '').trim(),
    sortOrder: Number.isFinite(faq.sortOrder) ? faq.sortOrder : index,
  };
}

function mapTestimonial(item, index) {
  return {
    name: String(item.name || '').trim(),
    city: item.city || null,
    image: item.image || null,
    review: String(item.review || '').trim(),
    rating: Math.min(5, Math.max(1, parseInt(item.rating, 10) || 5)),
    sortOrder: Number.isFinite(item.sortOrder) ? item.sortOrder : index,
    active: item.active !== false,
  };
}

async function syncNestedRelations(landingPageId, payload) {
  if (Array.isArray(payload.packages)) {
    await prisma.landingPackage.deleteMany({ where: { landingPageId } });
    const rows = payload.packages
      .map(mapPackage)
      .filter((p) => p.name);
    if (rows.length) {
      await prisma.landingPackage.createMany({
        data: rows.map((row) => ({ ...row, landingPageId })),
      });
    }
  }

  if (Array.isArray(payload.faqs)) {
    await prisma.landingFaq.deleteMany({ where: { landingPageId } });
    const rows = payload.faqs
      .map(mapFaq)
      .filter((f) => f.question && f.answer);
    if (rows.length) {
      await prisma.landingFaq.createMany({
        data: rows.map((row) => ({ ...row, landingPageId })),
      });
    }
  }

  if (Array.isArray(payload.testimonials)) {
    await prisma.landingTestimonial.deleteMany({ where: { landingPageId } });
    const rows = payload.testimonials
      .map(mapTestimonial)
      .filter((t) => t.name && t.review);
    if (rows.length) {
      await prisma.landingTestimonial.createMany({
        data: rows.map((row) => ({ ...row, landingPageId })),
      });
    }
  }
}

function buildLandingData(payload, { isCreate = false } = {}) {
  const status = normalizeStatus(payload.status);
  const data = {
    title: payload.title,
    heroHeading: payload.heroHeading ?? null,
    heroSubheading: payload.heroSubheading ?? null,
    heroBannerImage: payload.heroBannerImage ?? null,
    seasonDates: payload.seasonDates ?? null,
    ctaButtonText: payload.ctaButtonText ?? null,
    ctaButtonLink: payload.ctaButtonLink ?? null,
    whatsappCtaLink: payload.whatsappCtaLink ?? null,
    whatsappGroupLink: payload.whatsappGroupLink ?? null,
    whatsappGroupEnabled: payload.whatsappGroupEnabled !== false,
    introContent: payload.introContent ?? null,
    whyVisit: payload.whyVisit ?? null,
    bestTimeToVisit: payload.bestTimeToVisit ?? null,
    destinationHighlights: payload.destinationHighlights ?? null,
    fullMoonCalendar: payload.fullMoonCalendar ?? null,
    customBlocks: payload.customBlocks ?? null,
    formConfig: payload.formConfig ?? null,
    seoTitle: payload.seoTitle ?? null,
    seoDescription: payload.seoDescription ?? null,
    seoKeywords: Array.isArray(payload.seoKeywords) ? payload.seoKeywords.map(String) : [],
    ogImage: payload.ogImage ?? null,
    status,
    publishedAt:
      status === 'published'
        ? payload.publishedAt
          ? new Date(payload.publishedAt)
          : new Date()
        : null,
  };

  if (payload.slug || payload.title) {
    data.slug = generateSlug(payload.slug || payload.title);
  }

  if (isCreate && !data.slug) {
    data.slug = generateSlug(payload.title);
  }

  return data;
}

async function listLandingPages(query = {}) {
  return withDatabaseErrors(async () => {
    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;
    const where = {};

    if (query.status) where.status = normalizeStatus(query.status);
    if (query.published === 'true' || query.published === true) {
      where.status = 'published';
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [landingPages, total] = await Promise.all([
      prisma.landingPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ updatedAt: 'desc' }],
        include: {
          _count: { select: { packages: true, faqs: true, testimonials: true, enquiries: true } },
        },
      }),
      prisma.landingPage.count({ where }),
    ]);

    return {
      landingPages,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  });
}

async function getLandingPage(idOrSlug, { admin = false } = {}) {
  return withDatabaseErrors(async () => {
    const where = { OR: [{ id: String(idOrSlug) }, { slug: String(idOrSlug) }] };
    const page = await prisma.landingPage.findFirst({
      where,
      include: admin ? landingInclude : publicLandingInclude,
    });
    if (!page) throw AppError.notFound('Landing page not found');
    if (!admin && page.status !== 'published') {
      throw AppError.notFound('Landing page not found');
    }
    return page;
  });
}

async function createLandingPage(payload) {
  return withDatabaseErrors(async () => {
    const data = buildLandingData(payload, { isCreate: true });
    const exists = await prisma.landingPage.findUnique({ where: { slug: data.slug } });
    if (exists) throw AppError.conflict('Landing page slug already exists');

    const created = await prisma.landingPage.create({
      data: {
        title: payload.title,
        ...data,
      },
    });

    await syncNestedRelations(created.id, payload);
    return getLandingPage(created.id, { admin: true });
  });
}

async function updateLandingPage(id, payload) {
  return withDatabaseErrors(async () => {
    const existing = await prisma.landingPage.findUnique({ where: { id } });
    if (!existing) throw AppError.notFound('Landing page not found');

    const data = buildLandingData(payload);
    if (data.slug) {
      const conflict = await prisma.landingPage.findUnique({ where: { slug: data.slug } });
      if (conflict && conflict.id !== id) {
        throw AppError.conflict('Landing page slug already exists');
      }
    }

    await prisma.landingPage.update({
      where: { id },
      data: {
        title: payload.title ?? existing.title,
        ...data,
      },
    });

    if (
      payload.packages !== undefined ||
      payload.faqs !== undefined ||
      payload.testimonials !== undefined
    ) {
      await syncNestedRelations(id, payload);
    }

    return getLandingPage(id, { admin: true });
  });
}

async function deleteLandingPage(id) {
  return withDatabaseErrors(async () => {
    await prisma.landingPage.delete({ where: { id } });
    return { id };
  });
}

async function listLandingEnquiries(landingPageId, query = {}) {
  return withDatabaseErrors(async () => {
    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;

    const where = { landingPageId };
    if (query.status) where.status = query.status;

    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.enquiry.count({ where }),
    ]);

    return {
      enquiries,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  });
}

module.exports = {
  listLandingPages,
  getLandingPage,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  listLandingEnquiries,
};
