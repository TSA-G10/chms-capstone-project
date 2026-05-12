const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    public_id: { type: String, required: true },
    entityType: { type: String, required: true }, // e.g. 'Member', 'Expense'
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    mimeType: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);