const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const tourService = require('@/services/tourService');

const getTours = asyncHandler(async (req, res) => {
  const data = await tourService.listTours(req.query);
  return sendSuccess(res, data);
});

const getTour = asyncHandler(async (req, res) => {
  const tour = await tourService.getTour(req.params.idOrSlug);
  return sendSuccess(res, tour);
});

const createTour = asyncHandler(async (req, res) => {
  const tour = await tourService.createTour(req.body);
  return sendSuccess(res, tour, 'Tour created successfully', 201);
});

const updateTour = asyncHandler(async (req, res) => {
  const tour = await tourService.updateTour(req.params.id, req.body);
  return sendSuccess(res, tour, 'Tour updated successfully');
});

const deleteTour = asyncHandler(async (req, res) => {
  await tourService.deleteTour(req.params.id);
  return sendSuccess(res, null, 'Tour deleted successfully');
});

module.exports = {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
