const express = require('express');
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getCategories,
} = require('@/controllers/personalizedTripController');
const { authMiddleware, optionalAuthMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/meta/categories', getCategories);
router.get('/', optionalAuthMiddleware, getPackages);
router.get('/:slug', optionalAuthMiddleware, getPackage);

router.post('/', authMiddleware, validate('createPersonalizedTrip'), createPackage);
router.put('/:id', authMiddleware, validate('updatePersonalizedTrip'), updatePackage);
router.delete('/:id', authMiddleware, deletePackage);

module.exports = router;
