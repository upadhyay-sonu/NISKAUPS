const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionType: {
      type: String,
      enum: [
        "add_to_cart",
        "remove_from_cart",
        "favorite_added",
        "favorite_removed",
        "order_placed",
        "payment_completed",
      ],
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

ActivitySchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model("Activity", ActivitySchema);
