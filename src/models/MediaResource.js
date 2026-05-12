const mongoose = require("mongoose");

const mediaResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["book", "audio", "digital", "video"],
      required: [true, "Type is required"],
    },
    fileUrl: { type: String },
    public_id: { type: String },
    price: { type: Number, min: 0 },
    quantity: { type: Number, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MediaResource", mediaResourceSchema);
