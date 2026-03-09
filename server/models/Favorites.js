const mongoose = require("mongoose");

const FavoritesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

FavoritesSchema.index({ user: 1 });
FavoritesSchema.index({ "products.product": 1 });

module.exports = mongoose.model("Favorites", FavoritesSchema);
