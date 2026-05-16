const mediaService = require("../services/media.service");

const getAllMedia = async (req, res) => {
  try {
    const result = await mediaService.getAllMedia(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getMedia = async (req, res) => {
  try {
    const media = await mediaService.getMediaById(req.params.id);
    return res.status(200).json({ success: true, data: media });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createMedia = async (req, res) => {
  try {
    const media = await mediaService.createMedia(req.body);
    return res.status(201).json({ success: true, data: media });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateMedia = async (req, res) => {
  try {
    const media = await mediaService.updateMedia(req.params.id, req.body);
    return res.status(200).json({ success: true, data: media });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    await mediaService.deleteMedia(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Media resource deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const uploadMediaFile = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded." });
    const media = await mediaService.uploadMediaFile(req.params.id, req.file);
    return res.status(200).json({ success: true, data: media });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllMedia,
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
  uploadMediaFile,
};