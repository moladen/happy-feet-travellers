const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const settingsService = require('@/services/settingsService');

const getSettings = asyncHandler(async (_req, res) => {
  const settings = await settingsService.getSettings();
  return sendSuccess(res, settings);
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.upsertSettings(req.body);
  return sendSuccess(res, settings, 'Settings updated successfully');
});

module.exports = {
  getSettings,
  updateSettings,
};
