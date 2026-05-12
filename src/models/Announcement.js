const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      trim: true,
    },
    audience: {
      type: String,
      enum: ["all", "zone", "fellowship", "staff"],
      default: "all",
    },
    publishedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Announcement", announcementSchema);