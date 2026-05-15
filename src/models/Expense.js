const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "operations",
        "welfare",
        "missions",
        "programs",
        "maintenance",
        "other",
      ],
      required: [true, "Category is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: { type: String, default: "NGN" },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      index: true,
    },
    receiptUrl: { type: String },
    public_id: { type: String },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
