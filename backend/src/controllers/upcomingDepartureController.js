const asyncHandler = require('@/utils/asyncHandler');
const AppError = require('@/utils/AppError');
const { sendSuccess } = require('@/utils/responseFormatter');
const upcomingDepartureService = require('@/services/upcomingDepartureService');

const getDepartures = asyncHandler(async (req, res) => {
  const wantsAdminView =
    req.query.admin === 'true' || req.query.includeArchived === 'true';
  if (wantsAdminView && !req.user) {
    throw AppError.unauthorized('Authentication required for admin departure list');
  }
  const data = await upcomingDepartureService.listDepartures(req.query, {
    admin: Boolean(req.user && wantsAdminView),
  });
  return sendSuccess(res, data);
});

const getDeparture = asyncHandler(async (req, res) => {
  const tour = await upcomingDepartureService.getDeparture(req.params.slug);
  return sendSuccess(res, tour);
});

const createDeparture = asyncHandler(async (req, res) => {
  const tour = await upcomingDepartureService.createDeparture(req.body);
  return sendSuccess(res, tour, 'Upcoming departure created successfully', 201);
});

const updateDeparture = asyncHandler(async (req, res) => {
  const tour = await upcomingDepartureService.updateDeparture(req.params.id, req.body);
  return sendSuccess(res, tour, 'Upcoming departure updated successfully');
});

const deleteDeparture = asyncHandler(async (req, res) => {
  await upcomingDepartureService.deleteDeparture(req.params.id);
  return sendSuccess(res, null, 'Upcoming departure deleted successfully');
});

module.exports = {
  getDepartures,
  getDeparture,
  createDeparture,
  updateDeparture,
  deleteDeparture,
};
