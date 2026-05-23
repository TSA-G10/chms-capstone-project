const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Missions
 *   description: Mission trips and volunteer management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Mission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [planned, ongoing, completed, cancelled]
 */

/**
 * @swagger
 * /missions:
 *   get:
 *     summary: Get all missions
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of missions
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       201:
 *         description: Mission created
 *       403:
 *         description: Forbidden — requires super_admin, admin, or pastor role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  missionController.getMissions,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  missionController.createMission,
);

/**
 * @swagger
 * /missions/{id}:
 *   get:
 *     summary: Get a single mission by ID
 *     tags: [Missions]
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
 *         description: Mission found
 *       404:
 *         description: Mission not found
 *   put:
 *     summary: Update a mission
 *     tags: [Missions]
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
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       200:
 *         description: Mission updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Mission not found
 *   delete:
 *     summary: Delete a mission
 *     tags: [Missions]
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
 *         description: Mission deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Mission not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  missionController.getMission,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  missionController.updateMission,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  missionController.deleteMission,
);

/**
 * @swagger
 * /missions/{id}/volunteers:
 *   post:
 *     summary: Add a volunteer to a mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
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
 *         description: Volunteer added to mission
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Mission not found
 *   get:
 *     summary: Get all volunteers for a mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: List of volunteers
 *       404:
 *         description: Mission not found
 */
router.post(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  missionController.addVolunteer,
);
router.get(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  missionController.getVolunteers,
);

module.exports = router;