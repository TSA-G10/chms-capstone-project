const orgUnitService = require("../services/orgUnit.service");

const getOrgUnits = async (req, res) => {
  try {
    const result = await orgUnitService.getAllOrgUnits(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getOrgUnit = async (req, res) => {
  try {
    const unit = await orgUnitService.getOrgUnitById(req.params.id);
    return res.status(200).json({ success: true, data: unit });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createOrgUnit = async (req, res) => {
  try {
    const unit = await orgUnitService.createOrgUnit(req.body);
    return res.status(201).json({ success: true, data: unit });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateOrgUnit = async (req, res) => {
  try {
    const unit = await orgUnitService.updateOrgUnit(req.params.id, req.body);
    return res.status(200).json({ success: true, data: unit });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteOrgUnit = async (req, res) => {
  try {
    await orgUnitService.deleteOrgUnit(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Unit deactivated." });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const assignLeader = async (req, res) => {
  try {
    const { leaderId } = req.body;
    if (!leaderId)
      return res
        .status(400)
        .json({ success: false, error: "leaderId is required." });
    const unit = await orgUnitService.assignLeader(req.params.id, leaderId);
    return res.status(200).json({ success: true, data: unit });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getOrgUnits,
  getOrgUnit,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit,
  assignLeader,
};
