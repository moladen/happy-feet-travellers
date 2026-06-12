const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const { saveHeroUpload } = require('@/utils/heroMedia');
const AppError = require('@/utils/AppError');
const { saveTourUpload } = require('@/utils/tourMedia');
const { saveGuideUpload } = require('@/utils/guideMedia');

const uploadTourImage = asyncHandler(async (req, res) => {
  if (!req.file) throw AppError.badRequest('Image file is required');
  const url = saveTourUpload(req.file);
  sendSuccess(res, { url }, 'Image uploaded', 201);
});

const uploadHeroImage = asyncHandler(async (req, res) => {
  if (!req.file) throw AppError.badRequest('Image file is required');
  const url = saveHeroUpload(req.file);
  sendSuccess(res, { url }, 'Image uploaded', 201);
});

const uploadGuidePdf = asyncHandler(async (req, res) => {
  if (!req.file) throw AppError.badRequest('PDF file is required');
  const url = saveGuideUpload(req.file);
  sendSuccess(res, { url }, 'PDF uploaded', 201);
});

module.exports = { uploadTourImage, uploadHeroImage, uploadGuidePdf };
