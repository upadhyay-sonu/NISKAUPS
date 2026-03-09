const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    excerpt: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    category: {
      type: String,
      enum: ['news', 'tips', 'reviews', 'interviews', 'events'],
      default: 'news',
    },
    tags: [String],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Create slug from title
BlogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Index for search
BlogSchema.index({ title: 'text', content: 'text' });
BlogSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Blog', BlogSchema);
