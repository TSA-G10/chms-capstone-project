const Announcement = require("../models/Announcement");

const getAllAnnouncements = async ({ page = 1, limit = 20, audience }) => {
  const now = new Date();
  // Only return published announcements (publishedAt <= now) in public list
  const filter = { isActive: true, publishedAt: { $lte: now } };
  if (audience && audience !== "all")
    filter.audience = { $in: [audience, "all"] };

  const skip = (page - 1) * limit;
  const total = await Announcement.countDocuments(filter);
  const data = await Announcement.find(filter)
    .populate("createdBy", "firstName lastName role")
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getAnnouncementById = async (id) => {
  const a = await Announcement.findOne({ _id: id, isActive: true }).populate(
    "createdBy",
    "firstName lastName role",
  );
  if (!a) throw new Error("Announcement not found.");
  return a;
};

const createAnnouncement = async (data, userId) => {
  return Announcement.create({ ...data, createdBy: userId });
};

const updateAnnouncement = async (id, data) => {
  const a = await Announcement.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!a) throw new Error("Announcement not found.");
  return a;
};

const deleteAnnouncement = async (id) => {
  const a = await Announcement.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!a) throw new Error("Announcement not found.");
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};