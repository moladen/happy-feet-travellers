const prisma = require('@/config/database');
const AppError = require('@/utils/AppError');
const { saveHeroUpload, deleteHeroFileIfStored } = require('@/utils/heroMedia');

function toPublicSlide(slide) {
  return {
    id: slide.id,
    src: slide.imageUrl,
    alt: slide.altText,
    tag: slide.tag || 'Travel',
    emoji: slide.emoji || '✨',
    sortOrder: slide.sortOrder,
    active: slide.active,
  };
}

function parseSortOrder(value, fallback = 0) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseActive(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

async function listHeroSlides({ activeOnly = true } = {}) {
  const slides = await prisma.heroSlide.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return slides.map(toPublicSlide);
}

async function getNextSortOrder() {
  const last = await prisma.heroSlide.findFirst({
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? -1) + 1;
}

async function createHeroSlide({ file, altText, tag, emoji, sortOrder, active }) {
  if (!file) throw new AppError('Hero image file is required', 400);
  if (!altText || String(altText).trim().length < 3) {
    throw new AppError('Alt text is required (min 3 characters)', 400);
  }

  const imageUrl = saveHeroUpload(file);
  const slide = await prisma.heroSlide.create({
    data: {
      imageUrl,
      altText: String(altText).trim(),
      tag: tag ? String(tag).trim() : null,
      emoji: emoji ? String(emoji).trim() : '✨',
      sortOrder: parseSortOrder(sortOrder, await getNextSortOrder()),
      active: parseActive(active, true),
    },
  });
  return toPublicSlide(slide);
}

async function updateHeroSlide(id, { file, altText, tag, emoji, sortOrder, active }) {
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) throw new AppError('Hero slide not found', 404);

  let imageUrl = existing.imageUrl;
  if (file) {
    const nextUrl = saveHeroUpload(file);
    deleteHeroFileIfStored(existing.imageUrl);
    imageUrl = nextUrl;
  }

  const data = { imageUrl };
  if (altText !== undefined) data.altText = String(altText).trim();
  if (tag !== undefined) data.tag = tag ? String(tag).trim() : null;
  if (emoji !== undefined) data.emoji = emoji ? String(emoji).trim() : '✨';
  if (sortOrder !== undefined) data.sortOrder = parseSortOrder(sortOrder, existing.sortOrder);
  if (active !== undefined) data.active = parseActive(active, existing.active);

  const slide = await prisma.heroSlide.update({ where: { id }, data });
  return toPublicSlide(slide);
}

async function deleteHeroSlide(id) {
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) throw new AppError('Hero slide not found', 404);
  await prisma.heroSlide.delete({ where: { id } });
  deleteHeroFileIfStored(existing.imageUrl);
}

async function reorderHeroSlides(orderedIds) {
  if (!Array.isArray(orderedIds) || !orderedIds.length) {
    throw new AppError('order must be a non-empty array of slide ids', 400);
  }
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.heroSlide.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );
  return listHeroSlides({ activeOnly: false });
}

module.exports = {
  listHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
};
