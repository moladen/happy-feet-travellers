const express = require('express');

const tourRoutes = require('@/routes/tourRoutes');
const blogRoutes = require('@/routes/blogRoutes');
const testimonialRoutes = require('@/routes/testimonialRoutes');
const enquiryRoutes = require('@/routes/enquiryRoutes');
const subscriberRoutes = require('@/routes/subscriberRoutes');
const authRoutes = require('@/routes/authRoutes');
const galleryRoutes = require('@/routes/galleryRoutes');
const settingsRoutes = require('@/routes/settingsRoutes');

const router = express.Router();

router.get('/health', (_req, res) =>
  res.status(200).json({
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
);

router.use('/tours', tourRoutes);
router.use('/blogs', blogRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/gallery', galleryRoutes);
router.use('/enquiry', enquiryRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
