const reportService = require("../services/report.service");

const getAttendanceReport = async (req, res) => {
  try {
    const data = await reportService.getAttendanceReport(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getFinanceReport = async (req, res) => {
  try {
    const data = await reportService.getFinanceReport(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getProgramsReport = async (req, res) => {
  try {
    const data = await reportService.getProgramsReport();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAttendanceReport, getFinanceReport, getProgramsReport };
