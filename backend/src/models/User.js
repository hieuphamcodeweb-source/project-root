const mongoose = require("mongoose");

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
      enum: ["Staff", "Admin", "Member"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "banned"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
