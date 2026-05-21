const MediaResource = require("../models/MediaResource");
const cloudinary = require("../config/cloudinary");

const getAllMedia = async ({ page = 1, limit = 20, type }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const total = await MediaResource.countDocuments(filter);
  const data = await MediaResource.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getMediaById = async (id) => {
  const media = await MediaResource.findOne({ _id: id, isActive: true });
  if (!media) throw new Error("Media resource not found.");
  return media;
};

const createMedia = async (data) => MediaResource.create(data);

const updateMedia = async (id, data) => {
  const media = await MediaResource.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!media) throw new Error("Media resource not found.");
  return media;
};

const deleteMedia = async (id) => {
  const media = await MediaResource.findOne({ _id: id, isActive: true });
  if (!media) throw new Error("Media resource not found.");

  // If a file is attached to this resource, remove it from Cloudinary
  if (media.public_id) {
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: "image",
    });
  }

  media.isActive = false;
  await media.save();
};

const uploadMediaFile = async (id, file) => {
  const media = await MediaResource.findOne({ _id: id, isActive: true });
  if (!media) throw new Error("Media resource not found.");

  // Determine Cloudinary resource type by mimetype
  const resourceType = file.mimetype.startsWith("audio") ? "video" : "image";
  // Note: Cloudinary uses 'video' resource_type for audio files

  const uploadToCloud = require("../utils/uploadToCloud");
  const { url, public_id } = await uploadToCloud(
    file.buffer,
    "chms-media",
    resourceType,
  );

  // If there was a previous file, delete it from Cloudinary
  if (media.public_id) {
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: resourceType,
    });
  }

  media.fileUrl = url;
  media.public_id = public_id;
  await media.save();
  return media;
};

module.exports = {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
  uploadMediaFile,
};
