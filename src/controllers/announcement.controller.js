const announcementService = require("../services/announcement.service");

const getAnnouncements = async (req, res) => {
  try {
    const result = await announcementService.getAllAnnouncements(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getAnnouncement = async (req, res) => {
  try {
    const a = await announcementService.getAnnouncementById(req.params.id);
    return res.status(200).json({ success: true, data: a });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const a = await announcementService.createAnnouncement(
      req.body,
      req.user._id,
    );
    return res.status(201).json({ success: true, data: a });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const a = await announcementService.updateAnnouncement(
      req.params.id,
      req.body,
    );
    return res.status(200).json({ success: true, data: a });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Announcement deleted." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};