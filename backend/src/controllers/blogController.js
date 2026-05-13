const asyncHandler = require('@/utils/asyncHandler');
const { sendSuccess } = require('@/utils/responseFormatter');
const blogService = require('@/services/blogService');

const getBlogs = asyncHandler(async (req, res) => {
  const data = await blogService.listBlogs(req.query);
  return sendSuccess(res, data);
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlog(req.params.idOrSlug);
  return sendSuccess(res, blog);
});

const createBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.createBlog(req.body);
  return sendSuccess(res, blog, 'Blog created successfully', 201);
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.updateBlog(req.params.id, req.body);
  return sendSuccess(res, blog, 'Blog updated successfully');
});

const deleteBlog = asyncHandler(async (req, res) => {
  await blogService.deleteBlog(req.params.id);
  return sendSuccess(res, null, 'Blog deleted successfully');
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
