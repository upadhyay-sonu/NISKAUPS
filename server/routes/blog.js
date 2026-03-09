const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/:slug', getPost);

// Admin routes
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;
