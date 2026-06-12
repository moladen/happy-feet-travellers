const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');
const { generateSlug } = require('@/utils/slugGenerator');
const { getRelatedForBlog } = require('@/services/contentLinkingService');

async function listBlogs(query) {
  return withDatabaseErrors(async () => {
    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.category) where.category = query.category;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({ where, skip, take: limit, orderBy: { publishedAt: 'desc' } }),
      prisma.blog.count({ where }),
    ]);

    return {
      blogs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  });
}

async function getBlog(idOrSlug) {
  return withDatabaseErrors(async () => {
    if (!idOrSlug) throw AppError.badRequest('Blog identifier required');
    const blog = await prisma.blog.findFirst({
      where: { OR: [{ id: String(idOrSlug) }, { slug: String(idOrSlug) }] },
    });
    if (!blog) throw AppError.notFound('Blog not found');
    const related = await getRelatedForBlog(blog);
    return {
      ...blog,
      relatedTours: related.tours,
      relatedPackages: related.packages,
      relatedLandingPage: related.landingPage,
    };
  });
}

async function createBlog(payload) {
  return withDatabaseErrors(async () => {
    const slug = generateSlug(payload.slug || payload.title);
    const exists = await prisma.blog.findUnique({ where: { slug } });
    if (exists) throw AppError.conflict('Blog with this title already exists');

    return prisma.blog.create({
      data: {
        ...payload,
        slug,
        authorImage: payload.authorImage || null,
        authorInstagram: payload.authorInstagram || null,
        seoTitle: payload.seoTitle || null,
        seoDescription: payload.seoDescription || null,
        excerpt: payload.excerpt || null,
        category: payload.category || null,
        topicKeys: Array.isArray(payload.topicKeys) ? payload.topicKeys : [],
        relatedTourSlugs: Array.isArray(payload.relatedTourSlugs) ? payload.relatedTourSlugs : [],
        relatedPackageSlugs: Array.isArray(payload.relatedPackageSlugs) ? payload.relatedPackageSlugs : [],
        landingPageSlug: payload.landingPageSlug || null,
        publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : new Date(),
      },
    });
  });
}

async function updateBlog(id, updateData) {
  return withDatabaseErrors(async () => {
    const data = { ...updateData };
    if (data.title || data.slug) {
      const newSlug = generateSlug(data.slug || data.title);
      const conflict = await prisma.blog.findUnique({ where: { slug: newSlug } });
      if (conflict && conflict.id !== id) {
        throw AppError.conflict('Blog with this title already exists');
      }
      data.slug = newSlug;
    }
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt);
    return prisma.blog.update({ where: { id }, data });
  });
}

async function deleteBlog(id) {
  return withDatabaseErrors(() => prisma.blog.delete({ where: { id } }));
}

module.exports = {
  listBlogs,
  getBlog,
  getBlogBySlug: getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
