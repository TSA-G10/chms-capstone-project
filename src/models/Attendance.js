const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
      index: true,
    },
    checkedInAt: { type: Date, default: Date.now },
    method: {
      type: String,
      enum: ["manual", "qr"],
      default: "manual",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

// Compound unique index — prevents duplicate check-in
attendanceSchema.index({ checkedInAt: 1 });
attendanceSchema.index({ eventId: 1, checkedInAt: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
