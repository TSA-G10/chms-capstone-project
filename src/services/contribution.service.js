const ServiceContribution = require("../models/ServiceContribution");

const createContribution = async (data, userId) => {
  // Explicitly strip any memberId if somehow present — defence in depth
  const { memberId, ...safeData } = data;
  return ServiceContribution.create({ ...safeData, recordedBy: userId });
};

const getAllContributions = async ({
  page = 1,
  limit = 20,
  date,
  category,
  channel,
  from,
  to,
}) => {
  const filter = {};
  if (category) filter.category = category;
  if (channel) filter.channel = channel;
  if (date) filter.date = new Date(date);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const total = await ServiceContribution.countDocuments(filter);
  const data = await ServiceContribution.find(filter)
    .populate("eventId", "title date type")
    .populate("recordedBy", "firstName lastName")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getFinanceSummary = async ({ from, to } = {}) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.date = {};
    if (from) dateFilter.date.$gte = new Date(from);
    if (to) dateFilter.date.$lte = new Date(to);
  }

  // Total income — aggregate all contributions
  const incomeAgg = await ServiceContribution.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Income breakdown by category
  const incomeByCategory = await ServiceContribution.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Total expenses — aggregate all expenses
  const Expense = require("../models/Expense");
  const expenseAgg = await Expense.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$amount" },
      },
    },
  ]);

  // Expenses breakdown by category
  const expensesByCategory = await Expense.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
      },
    },
  ]);

  const totalIncome = incomeAgg[0]?.totalIncome || 0;
  const totalExpenses = expenseAgg[0]?.totalExpenses || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    currency: "NGN",
    incomeByCategory: incomeByCategory.map((i) => ({
      category: i._id,
      amount: i.amount,
    })),
    expensesByCategory: expensesByCategory.map((i) => ({
      category: i._id,
      amount: i.amount,
    })),
  };
};

module.exports = { createContribution, getAllContributions, getFinanceSummary };
