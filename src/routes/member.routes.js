const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Church member management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         memberStatus:
 *           type: string
 *           enum: [active, inactive, visitor, transferred]
 *         profileImageUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of members
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new member (with optional profile image upload)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [firstName, lastName]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               memberStatus:
 *                 type: string
 *                 enum: [active, inactive, visitor, transferred]
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile photo upload
 *     responses:
 *       201:
 *         description: Member created successfully
 *       403:
 *         description: Forbidden — requires super_admin, admin, or pastor role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  memberController.getMembers,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  upload.single("profileImage"),
  memberController.createMember,
);

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Get a single member by ID
 *     tags: [Members]
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
 *         description: Member found
 *       404:
 *         description: Member not found
 *   put:
 *     summary: Update a member's details
 *     tags: [Members]
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
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: Member updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Member not found
 *   delete:
 *     summary: Delete a member
 *     tags: [Members]
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
 *         description: Member deleted
 *       403:
 *         description: Forbidden — requires super_admin role only
 *       404:
 *         description: Member not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  memberController.getMember,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  memberController.updateMember,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin"),
  memberController.deleteMember,
);

/**
 * @swagger
 * /members/{id}/attendance:
 *   get:
 *     summary: Get attendance history for a specific member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member's attendance history
 *       404:
 *         description: Member not found
 *       403:
 *         description: Forbidden
 */
router.get(
  "/:id/attendance",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  memberController.getMemberAttendance,
);

module.exports = router;