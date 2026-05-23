const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    department: { type: String, trim: true },
    isVolunteer: { type: Boolean, default: false },
    hireDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Staff", staffSchema);
