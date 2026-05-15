const mongoose = require("mongoose");

const serviceContributionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      enum: ["tithe", "offering", "donation", "special"],
      required: [true, "Category is required"],
    },
    channel: {
      type: String,
      enum: ["cash", "transfer", "pos", "online"],
      required: [true, "Channel is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: { type: String, default: "NGN" },
    notes: { type: String, trim: true },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "ServiceContribution",
  serviceContributionSchema,
);