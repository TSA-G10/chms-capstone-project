const Expense = require("../models/Expense");

const createExpense = async (data, userId, fileInfo) => {
  const expenseData = { ...data, recordedBy: userId };
  if (fileInfo) {
    expenseData.receiptUrl = fileInfo.url;
    expenseData.public_id = fileInfo.public_id;
  }
  return Expense.create(expenseData);
};

const getAllExpenses = async ({ page = 1, limit = 20, category, from, to }) => {
  const filter = {};
  if (category) filter.category = category;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const total = await Expense.countDocuments(filter);
  const data = await Expense.find(filter)
    .populate("vendorId", "name contactPerson")
    .populate("approvedBy", "firstName lastName")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { createExpense, getAllExpenses };
