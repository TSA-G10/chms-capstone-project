const welfareService = require("../services/welfare.service");

const getWelfareCases = async (req, res) => {
  try {
    const result = await welfareService.getAllWelfareCases(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getWelfareCase = async (req, res) => {
  try {
    const wc = await welfareService.getWelfareCaseById(req.params.id);
    return res.status(200).json({ success: true, data: wc });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createWelfareCase = async (req, res) => {
  try {
    const wc = await welfareService.createWelfareCase(req.body);
    return res.status(201).json({ success: true, data: wc });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateWelfareCase = async (req, res) => {
  try {
    const wc = await welfareService.updateWelfareCase(req.params.id, req.body);
    return res.status(200).json({ success: true, data: wc });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteWelfareCase = async (req, res) => {
  try {
    await welfareService.deleteWelfareCase(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Welfare case closed." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const addSupportLog = async (req, res) => {
  try {
    const wc = await welfareService.addSupportLog(
      req.params.id,
      req.body,
      req.user._id,
    );
    return res.status(200).json({ success: true, data: wc });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getSupportLog = async (req, res) => {
  try {
    const log = await welfareService.getSupportLog(req.params.id);
    return res.status(200).json({ success: true, data: log });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getWelfareCases,
  getWelfareCase,
  createWelfareCase,
  updateWelfareCase,
  deleteWelfareCase,
  addSupportLog,
  getSupportLog,
};
