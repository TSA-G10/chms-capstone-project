const Attendance = require("../models/Attendance");

// Accepts a single memberId string OR an array of memberIds
const recordAttendance = async (
  eventId,
  memberIds,
  userId,
  method = "manual",
) => {
  const ids = Array.isArray(memberIds) ? memberIds : [memberIds];

  const results = { inserted: [], duplicates: [], errors: [] };

  for (const memberId of ids) {
    try {
      const record = await Attendance.create({
        eventId,
        memberId,
        method,
        recordedBy: userId,
      });
      results.inserted.push(record);
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key — compound index {eventId, memberId} violated
        results.duplicates.push(memberId);
      } else {
        results.errors.push({ memberId, error: err.message });
      }
    }
  }

  return results;
};

const getEventAttendance = async (eventId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments({ eventId });
  const data = await Attendance.find({ eventId })
    .populate("memberId", "firstName lastName phone memberStatus")
    .sort({ checkedInAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { recordAttendance, getEventAttendance };
