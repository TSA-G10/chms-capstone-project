const staffService = require("../services/staff.service");

const getStaff = async (req, res) => {
  try {
    const result = await staffService.getAllStaff(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const s = await staffService.getStaffById(req.params.id);
    return res.status(200).json({ success: true, data: s });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const s = await staffService.createStaff(req.body);
    return res.status(201).json({ success: true, data: s });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const s = await staffService.updateStaff(req.params.id, req.body);
    return res.status(200).json({ success: true, data: s });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    await staffService.deleteStaff(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Staff record deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
