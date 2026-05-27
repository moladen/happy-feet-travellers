const express = require('express');
const {
  getDepartures,
  getDeparture,
  createDeparture,
  updateDeparture,
  deleteDeparture,
} = require('@/controllers/upcomingDepartureController');
const { authMiddleware, optionalAuthMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', optionalAuthMiddleware, getDepartures);
router.get('/:slug', getDeparture);

router.post('/', authMiddleware, validate('createUpcomingDeparture'), createDeparture);
router.put('/:id', authMiddleware, validate('updateUpcomingDeparture'), updateDeparture);
router.delete('/:id', authMiddleware, deleteDeparture);

module.exports = router;
