const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { withDatabaseErrors } = require('@/utils/databaseErrors');

async function subscribe({ email, source }) {
  return withDatabaseErrors(async () => {
    const normalised = String(email).trim().toLowerCase();
    const existing = await prisma.subscriber.findUnique({ where: { email: normalised } });
    if (existing) {
      if (existing.active) return existing;
      return prisma.subscriber.update({
        where: { email: normalised },
        data: { active: true, source: source || existing.source },
      });
    }
    return prisma.subscriber.create({
      data: { email: normalised, source: source || null },
    });
  });
}

async function unsubscribe(email) {
  return withDatabaseErrors(async () => {
    const normalised = String(email).trim().toLowerCase();
    const existing = await prisma.subscriber.findUnique({ where: { email: normalised } });
    if (!existing) throw AppError.notFound('Subscriber not found');
    return prisma.subscriber.update({
      where: { email: normalised },
      data: { active: false },
    });
  });
}

async function listSubscribers(query) {
  return withDatabaseErrors(async () => {
    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 50, 200);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.active !== undefined) where.active = query.active === 'true';

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.subscriber.count({ where }),
    ]);

    return {
      subscribers,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  });
}

module.exports = { subscribe, unsubscribe, listSubscribers };
