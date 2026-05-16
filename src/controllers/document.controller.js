const documentService = require("../services/document.service");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded." });
    const { entityType, entityId } = req.body;
    if (!entityType || !entityId) {
      return res.status(400).json({
        success: false,
        error: "entityType and entityId are required.",
      });
    }

    const doc = await documentService.uploadDocument(
      req.file,
      { entityType, entityId },
      req.user._id,
    );
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const docs = await documentService.getDocuments(req.query);
    return res.status(200).json({ success: true, data: docs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    await documentService.deleteDocument(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Document deleted." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};