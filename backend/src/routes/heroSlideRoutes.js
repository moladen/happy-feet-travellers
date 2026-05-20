const express = require('express');
const {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} = require('@/controllers/heroSlideController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { heroImageUpload } = require('@/middlewares/heroUploadMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', getHeroSlides);
router.patch('/reorder', authMiddleware, validate('reorderHeroSlides'), reorderHeroSlides);
router.post('/', authMiddleware, heroImageUpload('image'), validate('createHeroSlide'), createHeroSlide);
router.put('/:id', authMiddleware, heroImageUpload('image'), validate('updateHeroSlide'), updateHeroSlide);
router.delete('/:id', authMiddleware, deleteHeroSlide);

module.exports = router;
