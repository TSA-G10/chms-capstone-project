const mongoose = require("mongoose");

const programEnrollmentSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: [true, "Program ID is required"],
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
      index: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["enrolled", "completed", "dropped"],
      default: "enrolled",
    },
    outcomes: { type: String, trim: true },
  },
  { timestamps: true },
);

// Prevent duplicate enrollment
programEnrollmentSchema.index({ programId: 1, memberId: 1 }, { unique: true });

module.exports = mongoose.model("ProgramEnrollment", programEnrollmentSchema);
