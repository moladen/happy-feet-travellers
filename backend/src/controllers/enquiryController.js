const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const enquiryService = require('@/services/enquiryService');

const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.createEnquiry(req.body);
  return sendSuccess(res, enquiry, 'Enquiry submitted successfully', 201);
});

const getEnquiries = asyncHandler(async (req, res) => {
  const data = await enquiryService.listEnquiries(req.query);
  return sendSuccess(res, data);
});

const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.updateEnquiryStatus(req.params.id, req.body.status);
  return sendSuccess(res, enquiry, 'Enquiry updated');
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  await enquiryService.deleteEnquiry(req.params.id);
  return sendSuccess(res, null, 'Enquiry deleted successfully');
});

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
