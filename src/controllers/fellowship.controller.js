const fellowshipService = require("../services/fellowship.service");

const getFellowships = async (req, res) => {
  try {
    const result = await fellowshipService.getAllFellowships(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getFellowship = async (req, res) => {
  try {
    const f = await fellowshipService.getFellowshipById(req.params.id);
    return res.status(200).json({ success: true, data: f });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createFellowship = async (req, res) => {
  try {
    const f = await fellowshipService.createFellowship(req.body);
    return res.status(201).json({ success: true, data: f });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateFellowship = async (req, res) => {
  try {
    const f = await fellowshipService.updateFellowship(req.params.id, req.body);
    return res.status(200).json({ success: true, data: f });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteFellowship = async (req, res) => {
  try {
    await fellowshipService.deleteFellowship(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Fellowship deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const getFellowshipMembers = async (req, res) => {
  try {
    const result = await fellowshipService.getFellowshipMembers(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getFellowships,
  getFellowship,
  createFellowship,
  updateFellowship,
  deleteFellowship,
  getFellowshipMembers,
};
