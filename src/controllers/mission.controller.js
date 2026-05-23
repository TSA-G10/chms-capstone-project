const missionService = require("../services/mission.service");

const getMissions = async (req, res) => {
  try {
    const result = await missionService.getAllMissions(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getMission = async (req, res) => {
  try {
    const m = await missionService.getMissionById(req.params.id);
    return res.status(200).json({ success: true, data: m });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createMission = async (req, res) => {
  try {
    const m = await missionService.createMission(req.body);
    return res.status(201).json({ success: true, data: m });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateMission = async (req, res) => {
  try {
    const m = await missionService.updateMission(req.params.id, req.body);
    return res.status(200).json({ success: true, data: m });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteMission = async (req, res) => {
  try {
    await missionService.deleteMission(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Mission deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const addVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    if (!volunteerId)
      return res
        .status(400)
        .json({ success: false, error: "volunteerId is required." });
    const m = await missionService.addVolunteer(req.params.id, volunteerId);
    return res.status(200).json({ success: true, data: m });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await missionService.getVolunteers(req.params.id);
    return res.status(200).json({ success: true, data: volunteers });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getMissions,
  getMission,
  createMission,
  updateMission,
  deleteMission,
  addVolunteer,
  getVolunteers,
};
