const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    location: { type: String, trim: true },
    budget: { type: Number, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["planned", "active", "completed", "cancelled"],
      default: "planned",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Mission", missionSchema);