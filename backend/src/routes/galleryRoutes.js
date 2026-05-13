const express = require('express');
const {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require('@/controllers/galleryController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', getGalleryImages);
router.post('/', authMiddleware, validate('createGalleryImage'), createGalleryImage);
router.put('/:id', authMiddleware, validate('updateGalleryImage'), updateGalleryImage);
router.delete('/:id', authMiddleware, deleteGalleryImage);

module.exports = router;
