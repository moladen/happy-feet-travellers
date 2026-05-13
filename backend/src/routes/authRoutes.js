const express = require('express');
const { adminLogin, getAdminProfile } = require('@/controllers/authController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.post('/login', validate('adminLogin'), adminLogin);
router.get('/profile', authMiddleware, getAdminProfile);

module.exports = router;
