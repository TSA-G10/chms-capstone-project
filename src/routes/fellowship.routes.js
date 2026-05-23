const express = require("express");
const router = express.Router();
const fellowshipController = require("../controllers/fellowship.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Fellowships
 *   description: Fellowship groups management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Fellowship:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         leader:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /fellowships:
 *   get:
 *     summary: Get all fellowships
 *     tags: [Fellowships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of fellowships
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new fellowship
 *     tags: [Fellowships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fellowship'
 *     responses:
 *       201:
 *         description: Fellowship created
 *       403:
 *         description: Forbidden — requires super_admin, admin, or pastor role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  fellowshipController.getFellowships,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  fellowshipController.createFellowship,
);

/**
 * @swagger
 * /fellowships/{id}:
 *   get:
 *     summary: Get a single fellowship by ID
 *     tags: [Fellowships]
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
 *         description: Fellowship found
 *       404:
 *         description: Fellowship not found
 *   put:
 *     summary: Update a fellowship
 *     tags: [Fellowships]
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
 *             $ref: '#/components/schemas/Fellowship'
 *     responses:
 *       200:
 *         description: Fellowship updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Fellowship not found
 *   delete:
 *     summary: Delete a fellowship
 *     tags: [Fellowships]
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
 *         description: Fellowship deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Fellowship not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  fellowshipController.getFellowship,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  fellowshipController.updateFellowship,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  fellowshipController.deleteFellowship,
);

/**
 * @swagger
 * /fellowships/{id}/members:
 *   get:
 *     summary: Get all members in a fellowship
 *     tags: [Fellowships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Fellowship ID
 *     responses:
 *       200:
 *         description: List of members in the fellowship
 *       404:
 *         description: Fellowship not found
 *       403:
 *         description: Forbidden
 */
router.get(
  "/:id/members",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  fellowshipController.getFellowshipMembers,
);

module.exports = router;