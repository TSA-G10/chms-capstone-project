const mongoose = require("mongoose");

const supportLogSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    amount: { type: Number, min: 0 },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { _id: true },
);

const welfareCaseSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Case type is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    supportLog: [supportLogSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WelfareCase", welfareCaseSchema);