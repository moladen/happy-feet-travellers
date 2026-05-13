const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const testimonialService = require('@/services/testimonialService');

const getTestimonials = asyncHandler(async (_req, res) => {
  const data = await testimonialService.listTestimonials();
  return sendSuccess(res, data);
});

const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.createTestimonial(req.body);
  return sendSuccess(res, testimonial, 'Testimonial created successfully', 201);
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
  return sendSuccess(res, testimonial, 'Testimonial updated successfully');
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);
  return sendSuccess(res, null, 'Testimonial deleted successfully');
});

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
