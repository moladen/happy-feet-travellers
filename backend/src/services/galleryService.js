const prisma = require('@/config/database');
const { withDatabaseErrors } = require('@/utils/databaseErrors');

async function listGalleryImages() {
  return withDatabaseErrors(() =>
    prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })
  );
}

async function createGalleryImage(payload) {
  return withDatabaseErrors(() =>
    prisma.galleryImage.create({
      data: {
        title: payload.title || null,
        altText: payload.altText,
        category: payload.category || null,
        image: payload.image,
      },
    })
  );
}

async function updateGalleryImage(id, payload) {
  return withDatabaseErrors(() =>
    prisma.galleryImage.update({
      where: { id },
      data: {
        ...(payload.title !== undefined ? { title: payload.title || null } : {}),
        ...(payload.altText !== undefined ? { altText: payload.altText } : {}),
        ...(payload.category !== undefined ? { category: payload.category || null } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
      },
    })
  );
}

async function deleteGalleryImage(id) {
  return withDatabaseErrors(() => prisma.galleryImage.delete({ where: { id } }));
}

module.exports = {
  listGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};
