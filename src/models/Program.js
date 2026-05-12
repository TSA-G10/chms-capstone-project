const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionNumber: { type: Number, required: true },
    title: { type: String, trim: true },
    date: { type: Date },
    facilitator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { _id: true },
);

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Program title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["empowerment", "pre_marital", "parental", "missions", "other"],
      required: [true, "Program type is required"],
    },
    description: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    sessions: [sessionSchema],
    coordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    maxParticipants: { type: Number, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Program", programSchema);