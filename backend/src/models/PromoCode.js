const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    /** Cap for percent-type promos only; omit or null for no cap */
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    /** Max times each user account may redeem this code (null = unlimited per user). */
    perUserUsageLimit: {
      type: Number,
      default: null,
      min: 1,
    },
    /** @deprecated Global cap — kept for old documents; logic uses perUserUsageLimit + Order counts. */
    usageLimit: {
      type: Number,
      default: null,
      min: 1,
    },
    /** @deprecated No longer incremented; kept for legacy data. */
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
