const express = require("express");
const router = express.Router();
const welfareController = require("../controllers/welfare.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Welfare
 *   description: Welfare cases and support log management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WelfareCase:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         memberId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [open, in_progress, resolved, closed]
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /welfare:
 *   get:
 *     summary: Get all welfare cases
 *     tags: [Welfare]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of welfare cases
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new welfare case
 *     tags: [Welfare]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WelfareCase'
 *     responses:
 *       201:
 *         description: Welfare case created
 *       403:
 *         description: Forbidden — requires super_admin, admin, or welfare_officer role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "welfare_officer"),
  welfareController.getWelfareCases,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "welfare_officer"),
  welfareController.createWelfareCase,
);

/**
 * @swagger
 * /welfare/{id}:
 *   get:
 *     summary: Get a single welfare case by ID
 *     tags: [Welfare]
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
 *         description: Welfare case found
 *       404:
 *         description: Case not found
 *   put:
 *     summary: Update a welfare case
 *     tags: [Welfare]
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
 *             $ref: '#/components/schemas/WelfareCase'
 *     responses:
 *       200:
 *         description: Welfare case updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Case not found
 *   delete:
 *     summary: Delete a welfare case
 *     tags: [Welfare]
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
 *         description: Welfare case deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Case not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "welfare_officer"),
  welfareController.getWelfareCase,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "welfare_officer"),
  welfareController.updateWelfareCase,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  welfareController.deleteWelfareCase,
);

/**
 * @swagger
 * /welfare/{id}/support-log:
 *   post:
 *     summary: Add a support log entry to a welfare case
 *     tags: [Welfare]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Welfare case ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [note]
 *             properties:
 *               note:
 *                 type: string
 *               supportType:
 *                 type: string
 *                 enum: [financial, emotional, medical, material, other]
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Support log entry added
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Welfare case not found
 *   get:
 *     summary: Get all support log entries for a welfare case
 *     tags: [Welfare]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Welfare case ID
 *     responses:
 *       200:
 *         description: List of support log entries
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Welfare case not found
 */
router.post(
  "/:id/support-log",
  authenticate,
  authorizeRoles("super_admin", "admin", "welfare_officer"),
  welfareController.addSupportLog,
);
router.get(
  "/:id/support-log",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "welfare_officer"),
  welfareController.getSupportLog,
);

module.exports = router;