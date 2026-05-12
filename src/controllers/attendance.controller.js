const attendanceService = require("../services/attendance.service");

const recordAttendance = async (req, res) => {
  try {
    const { memberId, memberIds, method } = req.body;

    // Accept either memberId (single) or memberIds (array)
    const ids = memberIds || memberId;
    if (!ids) {
      return res
        .status(400)
        .json({ success: false, error: "memberId or memberIds is required." });
    }

    const results = await attendanceService.recordAttendance(
      req.params.id,
      ids,
      req.user._id,
      method,
    );

    // If ALL were duplicates, return 409
    const allDuplicates =
      results.inserted.length === 0 &&
      results.duplicates.length > 0 &&
      results.errors.length === 0;

    if (allDuplicates) {
      return res.status(409).json({
        success: false,
        error: "All members already checked in for this event.",
        data: results,
      });
    }

    // Partial or full success
    return res.status(201).json({
      success: true,
      message: `${results.inserted.length} checked in. ${results.duplicates.length} duplicate(s) skipped.`,
      data: results,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getEventAttendance = async (req, res) => {
  try {
    const result = await attendanceService.getEventAttendance(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { recordAttendance, getEventAttendance };
