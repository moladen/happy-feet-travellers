const express = require('express');
const { getSettings, updateSettings } = require('@/controllers/settingsController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', getSettings);
router.put('/', authMiddleware, validate('updateSettings'), updateSettings);

module.exports = router;
