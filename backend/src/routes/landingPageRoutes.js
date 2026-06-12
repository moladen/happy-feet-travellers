const express = require('express');
const {
  getLandingPages,
  getLandingPageById,
  postLandingPage,
  putLandingPage,
  removeLandingPage,
  getLandingPageEnquiries,
  getLandingPackageRelated,
} = require('@/controllers/landingPageController');
const { authMiddleware, optionalAuthMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', optionalAuthMiddleware, getLandingPages);
router.get('/:id/enquiries', authMiddleware, getLandingPageEnquiries);
router.get('/:landingSlug/packages/:packageSlug/related', getLandingPackageRelated);
router.get('/:idOrSlug', optionalAuthMiddleware, getLandingPageById);

router.post('/', authMiddleware, validate('createLandingPage'), postLandingPage);
router.put('/:id', authMiddleware, validate('updateLandingPage'), putLandingPage);
router.delete('/:id', authMiddleware, removeLandingPage);

module.exports = router;
