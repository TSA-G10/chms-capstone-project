const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/media.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const mediaUpload = require("../middlewares/mediaUpload");

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media records and file uploads (sermons, videos, audio)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         type:
 *           type: string
 *           enum: [sermon, video, audio, image]
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
 * /media:
 *   get:
 *     summary: Get all media records
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of media records
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new media record (metadata only, no file yet)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Media'
 *     responses:
 *       201:
 *         description: Media record created
 *       403:
 *         description: Forbidden — requires super_admin, admin, or pastor role
 */
router.get("/", authenticate, mediaController.getAllMedia);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  mediaController.createMedia,
);

/**
 * @swagger
 * /media/{id}:
 *   get:
 *     summary: Get a single media record by ID
 *     tags: [Media]
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
 *         description: Media record found
 *       404:
 *         description: Media not found
 *   put:
 *     summary: Update a media record
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Media'
 *     responses:
 *       200:
 *         description: Media updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Media not found
 *   delete:
 *     summary: Delete a media record
 *     tags: [Media]
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
 *         description: Media deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Media not found
 */
router.get("/:id", authenticate, mediaController.getMedia);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  mediaController.updateMedia,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  mediaController.deleteMedia,
);

/**
 * @swagger
 * /media/{id}/upload:
 *   post:
 *     summary: Upload a file to an existing media record
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media record ID to attach the file to
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
 *                 description: The media file (audio, video, image, etc.)
 *     responses:
 *       200:
 *         description: File uploaded and linked to media record
 *       403:
 *         description: Forbidden — requires super_admin, admin, or pastor role
 *       404:
 *         description: Media record not found
 */
router.post(
  "/:id/upload",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  mediaUpload.single("file"),
  mediaController.uploadMediaFile,
);

module.exports = router;