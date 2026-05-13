const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  subscribe,
  unsubscribe,
  listSubscribers,
} = require('@/controllers/subscriberController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

const subscribeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many subscribe requests, slow down.' },
});

router.post('/', subscribeLimiter, validate('createSubscriber'), subscribe);
router.post('/unsubscribe', subscribeLimiter, validate('createSubscriber'), unsubscribe);

router.get('/', authMiddleware, listSubscribers);

module.exports = router;
