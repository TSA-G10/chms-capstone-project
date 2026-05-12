const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true, // allows multiple null values but enforces unique on non-null
      unique: true,
    },
    phone: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true },
    memberStatus: {
      type: String,
      enum: ["active", "inactive", "visitor", "transferred"],
      default: "visitor",
    },
    fellowshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fellowship",
      index: true,
    },
    joinDate: { type: Date, default: Date.now },
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Member", memberSchema);