const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    type: {
      type: String,
      lowercase: true,
      enum: ["service", "ceremony", "special", "fellowship"],
      required: [true, "Event type is required"],
    },
    description: { type: String, trim: true },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
