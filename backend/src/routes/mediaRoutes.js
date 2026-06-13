const express = require('express');
const { uploadTourImage, uploadHeroImage, uploadGuidePdf } = require('@/controllers/mediaUploadController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { tourImageUpload } = require('@/middlewares/tourUploadMiddleware');
const { heroImageUpload } = require('@/middlewares/heroUploadMiddleware');
const { guidePdfUpload } = require('@/middlewares/guideUploadMiddleware');

const router = express.Router();

router.post('/tour-image', authMiddleware, tourImageUpload('image'), uploadTourImage);
router.post('/hero-image', authMiddleware, heroImageUpload('image'), uploadHeroImage);
router.post('/guide-pdf', authMiddleware, guidePdfUpload('pdf'), uploadGuidePdf);

module.exports = router;
