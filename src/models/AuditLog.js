const mongoose = require("mongoose");

// Note: No timestamps: true plugin — uses manual timestamp field
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  action: {
    type: String,
    required: [true, "Action is required"],
    enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"],
  },
  entity: {
    type: String,
    required: [true, "Entity name is required"],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  changes: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
