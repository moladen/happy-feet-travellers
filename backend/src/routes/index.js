const express = require('express');
const prisma = require('@/config/database');

const tourRoutes = require('@/routes/tourRoutes');
const blogRoutes = require('@/routes/blogRoutes');
const testimonialRoutes = require('@/routes/testimonialRoutes');
const enquiryRoutes = require('@/routes/enquiryRoutes');
const subscriberRoutes = require('@/routes/subscriberRoutes');
const authRoutes = require('@/routes/authRoutes');
const galleryRoutes = require('@/routes/galleryRoutes');
const settingsRoutes = require('@/routes/settingsRoutes');
const heroSlideRoutes = require('@/routes/heroSlideRoutes');
const teamMemberRoutes = require('@/routes/teamMemberRoutes');

const router = express.Router();

router.get('/health', async (_req, res) => {
  const payload = {
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: { ok: false },
  };
  try {
    await prisma.$queryRaw`SELECT 1`;
    payload.database = { ok: true };
  } catch (e) {
    payload.database = {
      ok: false,
      hint: 'Check DATABASE_URL in backend/.env and that PostgreSQL is running.',
      error: process.env.NODE_ENV === 'development' ? String(e.message || e) : undefined,
    };
  }
  res.status(200).json(payload);
});

router.use('/tours', tourRoutes);
router.use('/blogs', blogRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/gallery', galleryRoutes);
router.use('/enquiry', enquiryRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/hero-slides', heroSlideRoutes);
router.use('/team-members', teamMemberRoutes);

module.exports = router;
