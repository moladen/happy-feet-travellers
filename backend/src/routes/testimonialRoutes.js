const express = require('express');
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('@/controllers/testimonialController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', authMiddleware, validate('createTestimonial'), createTestimonial);
router.put('/:id', authMiddleware, validate('updateTestimonial'), updateTestimonial);

router.delete('/:id', authMiddleware, deleteTestimonial);

module.exports = router;
