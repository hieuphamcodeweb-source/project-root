const mongoose = require("mongoose");

const savedAddressSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      trim: true,
      default: "",
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
      default: "",
    },
    district: {
      type: String,
      trim: true,
      default: "",
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    dateRegistered: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Staff", "Admin", "Member", "User"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "banned"],
      required: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    addresses: {
      type: [savedAddressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
