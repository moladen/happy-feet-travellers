const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const authService = require('@/services/authService');

const adminLogin = asyncHandler(async (req, res) => {
  const data = await authService.loginAdmin(req.body);
  return sendSuccess(res, data, 'Login successful');
});

const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await authService.getAdminProfile(req.user.id);
  return sendSuccess(res, admin);
});

module.exports = {
  adminLogin,
  getAdminProfile,
};
