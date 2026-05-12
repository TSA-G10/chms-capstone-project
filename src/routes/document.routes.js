const express = require("express");
const router = express.Router();

const documentController = require("../controllers/document.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

router.post(
  "/",
  authenticate,
  authorizeRoles(
    "admin",
    "pastor",
    "finance_officer",
    "welfare_officer",
    "staff",
  ),
  upload.single("file"),
  documentController.uploadDocument,
);

router.get(
  "/",
  authenticate,
  authorizeRoles(
    "admin",
    "pastor",
    "finance_officer",
    "welfare_officer",
    "staff",
  ),
  documentController.getDocuments,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles(
    "admin",
    "pastor",
    "finance_officer",
    "welfare_officer",
    "staff",
  ),
  documentController.getDocumentById,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  documentController.deleteDocument,
);

module.exports = router;