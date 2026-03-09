const Blog = require('../models/Blog');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const { category, sort = 'newest', page = 1, limit = 10 } = req.query;

    let filter = { isPublished: true };

    if (category) {
      filter.category = category;
    }

    let sortObj = { publishedAt: -1 };

    if (sort === 'popular') {
      sortObj = { views: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Blog.countDocuments(filter);

    const posts = await Blog.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate('author', 'name');

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:slug
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create blog post (Admin only)
// @route   POST /api/blog
// @access  Private/Admin
exports.createPost = async (req, res) => {
  try {
    const post = new Blog({
      ...req.body,
      author: req.user.id,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update blog post (Admin only)
// @route   PUT /api/blog/:id
// @access  Private/Admin
exports.updatePost = async (req, res) => {
  try {
    let post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete blog post (Admin only)
// @route   DELETE /api/blog/:id
// @access  Private/Admin
exports.deletePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
