const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('@/controllers/blogController');
const { authMiddleware } = require('@/middlewares/authMiddleware');
const { validate } = require('@/validators/validate');

const router = express.Router();

router.get('/', getBlogs);
router.get('/:idOrSlug', getBlog);

router.post('/', authMiddleware, validate('createBlog'), createBlog);
router.put('/:id', authMiddleware, validate('updateBlog'), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
