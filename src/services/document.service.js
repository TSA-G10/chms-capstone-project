const cloudinary = require("../config/cloudinary");
const Document = require("../models/Document");
const uploadToCloud = require("../utils/uploadToCloud");

const uploadDocument = async (file, { entityType, entityId }, userId) => {
  const { url, public_id } = await uploadToCloud(file.buffer, "chms-documents");

  const doc = await Document.create({
    fileUrl: url,
    public_id,
    entityType,
    entityId,
    uploadedBy: userId,
    mimeType: file.mimetype,
  });

  return doc;
};

const getDocuments = async ({ entityType, entityId }) => {
  const filter = { isActive: true };
  if (entityType) filter.entityType = entityType;
  if (entityId) filter.entityId = entityId;
  return Document.find(filter).sort({ createdAt: -1 });
};

const getDocumentById = async (id) => {
  const doc = await Document.findById(id);
  if (!doc || !doc.isActive) throw new Error("Document not found.");
  return doc;
};

const deleteDocument = async (id) => {
  const doc = await Document.findById(id);
  if (!doc) throw new Error("Document not found.");

  await cloudinary.uploader.destroy(doc.public_id);
  doc.isActive = false;
  await doc.save();
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};