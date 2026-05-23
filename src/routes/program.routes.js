const express = require("express");
const router = express.Router();
const programController = require("../controllers/program.controller");
const enrollmentController = require("../controllers/enrollment.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: Church programs, sessions, and member enrollment
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 */

/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of programs
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       201:
 *         description: Program created
 *       403:
 *         description: Forbidden — requires super_admin, admin, or pastor role
 */
router.get("/", authenticate, programController.getPrograms);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  programController.createProgram,
);

/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Get a single program by ID
 *     tags: [Programs]
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
 *         description: Program found
 *       404:
 *         description: Program not found
 *   put:
 *     summary: Update a program
 *     tags: [Programs]
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
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Program updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 *   delete:
 *     summary: Delete a program
 *     tags: [Programs]
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
 *         description: Program deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Program not found
 */
router.get("/:id", authenticate, programController.getProgram);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  programController.updateProgram,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  programController.deleteProgram,
);

/**
 * @swagger
 * /programs/{id}/sessions:
 *   post:
 *     summary: Add a session to a program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, date]
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session added to program
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 */
router.post(
  "/:id/sessions",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  programController.addSession,
);

/**
 * @swagger
 * /programs/{id}/enroll:
 *   post:
 *     summary: Enroll a member in a program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [memberId]
 *             properties:
 *               memberId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member enrolled in program
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program or member not found
 */
router.post(
  "/:id/enroll",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  enrollmentController.enrollMember,
);

/**
 * @swagger
 * /programs/{id}/participants:
 *   get:
 *     summary: Get all participants enrolled in a program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: List of enrolled participants
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 */
router.get(
  "/:id/participants",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  enrollmentController.getParticipants,
);

module.exports = router;