const express = require("express");
const router = express.Router();

const documentController = require("../controllers/document.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document upload and management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         fileUrl:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Upload a new document (file upload)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires super_admin, admin, pastor, finance_officer, welfare_officer, or staff role
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "finance_officer", "welfare_officer", "staff"),
  upload.single("file"),
  documentController.uploadDocument,
);
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "finance_officer", "welfare_officer", "staff"),
  documentController.getDocuments,
);

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get a single document by ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document found
 *       404:
 *         description: Document not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Document not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "finance_officer", "welfare_officer", "staff", "member"),
  documentController.getDocumentById,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  documentController.deleteDocument,
);

module.exports = router;