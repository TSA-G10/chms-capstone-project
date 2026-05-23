const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff records management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
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
 *         role:
 *           type: string
 *         department:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff members
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new staff record
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       201:
 *         description: Staff created
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  staffController.getStaff,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  staffController.createStaff,
);

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get a single staff member by ID
 *     tags: [Staff]
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
 *         description: Staff member found
 *       404:
 *         description: Staff member not found
 *   put:
 *     summary: Update a staff record
 *     tags: [Staff]
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
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: Staff updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Staff member not found
 *   delete:
 *     summary: Delete a staff record
 *     tags: [Staff]
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
 *         description: Staff deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Staff member not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  staffController.getStaffById,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  staffController.updateStaff,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  staffController.deleteStaff,
);

module.exports = router;