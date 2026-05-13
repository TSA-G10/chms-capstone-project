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
