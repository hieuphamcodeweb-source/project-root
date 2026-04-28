const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      required: true,
      default: "active",
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", category: "text", sku: "text" });

module.exports = mongoose.model("Product", productSchema);
