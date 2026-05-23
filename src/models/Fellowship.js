const mongoose = require("mongoose");

const fellowshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Fellowship name is required"],
      trim: true,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationalUnit",
      index: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      index: true,
    },
    meetingDay: {
      type: String,
      lowercase: true,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    meetingTime: { type: String, trim: true },
    location: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Fellowship", fellowshipSchema);
