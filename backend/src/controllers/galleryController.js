const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const galleryService = require('@/services/galleryService');

const getGalleryImages = asyncHandler(async (_req, res) => {
  const items = await galleryService.listGalleryImages();
  return sendSuccess(res, { items });
});

const createGalleryImage = asyncHandler(async (req, res) => {
  const image = await galleryService.createGalleryImage(req.body);
  return sendSuccess(res, image, 'Gallery image created successfully', 201);
});

const updateGalleryImage = asyncHandler(async (req, res) => {
  const image = await galleryService.updateGalleryImage(req.params.id, req.body);
  return sendSuccess(res, image, 'Gallery image updated successfully');
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  await galleryService.deleteGalleryImage(req.params.id);
  return sendSuccess(res, null, 'Gallery image deleted successfully');
});

module.exports = {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};
