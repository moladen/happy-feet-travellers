const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('@/controllers/enquiryController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

// Stricter rate-limit for the public submit endpoint to discourage form spam.
const enquiryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiries, please slow down.' },
});

router.post('/', enquiryLimiter, validate('createEnquiry'), createEnquiry);

router.get('/', authMiddleware, getEnquiries);
router.patch('/:id/status', authMiddleware, updateEnquiryStatus);
router.delete('/:id', authMiddleware, deleteEnquiry);

module.exports = router;
