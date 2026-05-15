const mongoose = require("mongoose");

const orgUnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Unit name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["zone", "area", "district", "region"],
      required: [true, "Unit type is required"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationalUnit",
      default: null,
      index: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OrganizationalUnit", orgUnitSchema);
