const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('@/controllers/tourController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', getTours);
router.get('/:idOrSlug', getTour);

router.post('/', authMiddleware, validate('createTour'), createTour);
router.put('/:id', authMiddleware, validate('updateTour'), updateTour);
router.delete('/:id', authMiddleware, deleteTour);

module.exports = router;
