const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    /** Mã đơn hàng hiển thị (8 ký tự: 4 chữ + 4 số). Đơn cũ có thể không có. */
    orderCode: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      unique: true,
      index: true,
      validate: {
        validator(v) {
          if (v == null || v === "") return true;
          return /^[A-Z]{4}\d{4}$/.test(v);
        },
      },
    },
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    /** Demo / future: amount deducted from items subtotal */
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    promoCode: {
      type: String,
      trim: true,
      default: "",
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    shippingAddress: {
      addressId: { type: String, trim: true },
      recipientName: { type: String, trim: true },
      phone: { type: String, trim: true },
      street: { type: String, trim: true },
      ward: { type: String, trim: true },
      district: { type: String, trim: true },
      province: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
