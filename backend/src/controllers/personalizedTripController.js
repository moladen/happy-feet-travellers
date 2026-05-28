const asyncHandler = require('@/utils/asyncHandler');
const AppError = require('@/utils/AppError');
const { sendSuccess } = require('@/utils/responseFormatter');
const personalizedTripService = require('@/services/personalizedTripService');

const getPackages = asyncHandler(async (req, res) => {
  const wantsAdmin =
    req.query.admin === 'true' ||
    req.query.includeDraft === 'true' ||
    req.query.includeArchived === 'true';
  if (wantsAdmin && !req.user) {
    throw AppError.unauthorized('Authentication required for admin package list');
  }
  const data = await personalizedTripService.listPackages(req.query, {
    admin: Boolean(req.user && wantsAdmin),
  });
  return sendSuccess(res, data);
});

const getPackage = asyncHandler(async (req, res) => {
  const admin = req.query.admin === 'true' && req.user;
  const pkg = await personalizedTripService.getPackage(req.params.slug, { admin });
  return sendSuccess(res, pkg);
});

const createPackage = asyncHandler(async (req, res) => {
  const pkg = await personalizedTripService.createPackage(req.body);
  return sendSuccess(res, pkg, 'Personalized trip package created successfully', 201);
});

const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await personalizedTripService.updatePackage(req.params.id, req.body);
  return sendSuccess(res, pkg, 'Personalized trip package updated successfully');
});

const deletePackage = asyncHandler(async (req, res) => {
  await personalizedTripService.deletePackage(req.params.id);
  return sendSuccess(res, null, 'Personalized trip package deleted successfully');
});

const getCategories = asyncHandler(async (_req, res) => {
  return sendSuccess(res, {
    categories: personalizedTripService.PACKAGE_CATEGORIES,
  });
});

module.exports = {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getCategories,
};
