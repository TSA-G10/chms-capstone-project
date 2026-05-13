const Attendance = require("../models/Attendance");
const ServiceContribution = require("../models/ServiceContribution");
const Expense = require("../models/Expense");
const ProgramEnrollment = require("../models/ProgramEnrollment");
const Program = require("../models/Program");

// Report Service
const getAttendanceReport = async ({ from, to }) => {
  const matchStage = {};
  if (from || to) {
    matchStage.checkedInAt = {};
    if (from) matchStage.checkedInAt.$gte = new Date(from);
    if (to) matchStage.checkedInAt.$lte = new Date(to);
  }

  const results = await Attendance.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$eventId",
        totalAttendees: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $project: {
        _id: 0,
        eventId: "$_id",
        eventTitle: "$event.title",
        eventDate: "$event.date",
        eventType: "$event.type",
        totalAttendees: 1,
      },
    },
    { $sort: { eventDate: -1 } },
  ]);

  return results;
};

// Financial Report Service
const getFinanceReport = async ({ period = "monthly" }) => {
  // Build date grouping based on period
  const groupId =
    period === "yearly"
      ? { year: { $year: "$date" } }
      : period === "quarterly"
        ? {
            year: { $year: "$date" },
            quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
          }
        : { year: { $year: "$date" }, month: { $month: "$date" } }; // default: monthly

  const incomeByPeriod = await ServiceContribution.aggregate([
    { $group: { _id: groupId, totalIncome: { $sum: "$totalAmount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const expensesByPeriod = await Expense.aggregate([
    { $group: { _id: groupId, totalExpenses: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Merge income and expenses by period key
  const periodMap = {};

  for (const row of incomeByPeriod) {
    const key = JSON.stringify(row._id);
    if (!periodMap[key])
      periodMap[key] = { period: row._id, totalIncome: 0, totalExpenses: 0 };
    periodMap[key].totalIncome = row.totalIncome;
  }

  for (const row of expensesByPeriod) {
    const key = JSON.stringify(row._id);
    if (!periodMap[key])
      periodMap[key] = { period: row._id, totalIncome: 0, totalExpenses: 0 };
    periodMap[key].totalExpenses = row.totalExpenses;
  }

  return Object.values(periodMap).map((row) => ({
    ...row,
    net: row.totalIncome - row.totalExpenses,
  }));
};
