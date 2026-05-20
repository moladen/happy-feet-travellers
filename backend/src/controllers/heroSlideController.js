const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const heroSlideService = require('@/services/heroSlideService');

const getHeroSlides = asyncHandler(async (req, res) => {
  const activeOnly = req.query.all !== '1';
  const slides = await heroSlideService.listHeroSlides({ activeOnly });
  sendSuccess(res, { slides });
});

const createHeroSlide = asyncHandler(async (req, res) => {
  const slide = await heroSlideService.createHeroSlide({
    file: req.file,
    altText: req.body.altText,
    tag: req.body.tag,
    emoji: req.body.emoji,
    sortOrder: req.body.sortOrder,
    active: req.body.active,
  });
  sendSuccess(res, { slide }, 'Hero slide uploaded', 201);
});

const updateHeroSlide = asyncHandler(async (req, res) => {
  const slide = await heroSlideService.updateHeroSlide(req.params.id, {
    file: req.file,
    altText: req.body.altText,
    tag: req.body.tag,
    emoji: req.body.emoji,
    sortOrder: req.body.sortOrder,
    active: req.body.active,
  });
  sendSuccess(res, { slide }, 'Hero slide updated');
});

const deleteHeroSlide = asyncHandler(async (req, res) => {
  await heroSlideService.deleteHeroSlide(req.params.id);
  sendSuccess(res, null, 'Hero slide removed');
});

const reorderHeroSlides = asyncHandler(async (req, res) => {
  const slides = await heroSlideService.reorderHeroSlides(req.body.order);
  sendSuccess(res, { slides }, 'Hero slide order updated');
});

module.exports = {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
};
