const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
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
    author: {
      type: String,
      required: [true, 'Please add an author name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    shortDescription: String,
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      enum: ['current', 'signed', 'special', 'coming-soon'],
      required: true,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    publisher: String,
    publicationDate: Date,
    pages: Number,
    isbn: String,
    language: { type: String, default: 'English' },
    isLimitedEdition: { type: Boolean, default: false },
    limitedCopies: Number,
    copiesSold: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    totalReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Create slug from title
ProductSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Index for faster queries
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ author: 1 });
ProductSchema.index({ title: 'text', description: 'text', author: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
