const programService = require("../services/program.service");

const getPrograms = async (req, res) => {
  try {
    const result = await programService.getAllPrograms(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getProgram = async (req, res) => {
  try {
    const program = await programService.getProgramById(req.params.id);
    return res.status(200).json({ success: true, data: program });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createProgram = async (req, res) => {
  try {
    const program = await programService.createProgram(req.body);
    return res.status(201).json({ success: true, data: program });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateProgram = async (req, res) => {
  try {
    const program = await programService.updateProgram(req.params.id, req.body);
    return res.status(200).json({ success: true, data: program });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteProgram = async (req, res) => {
  try {
    await programService.deleteProgram(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Program deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const addSession = async (req, res) => {
  try {
    const program = await programService.addSession(req.params.id, req.body);
    return res.status(200).json({ success: true, data: program });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

// Add to exports
module.exports = {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  addSession,
};