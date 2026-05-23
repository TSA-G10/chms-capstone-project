const express = require("express");
const router = express.Router();
const orgUnitController = require("../controllers/orgUnit.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: OrgUnits
 *   description: Organisational units (departments, ministries, etc.)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrgUnit:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         leaderId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /org-units:
 *   get:
 *     summary: Get all organisational units
 *     tags: [OrgUnits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of org units
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new organisational unit
 *     tags: [OrgUnits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrgUnit'
 *     responses:
 *       201:
 *         description: Org unit created
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  orgUnitController.getOrgUnits,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  orgUnitController.createOrgUnit,
);

/**
 * @swagger
 * /org-units/{id}:
 *   get:
 *     summary: Get a single org unit by ID
 *     tags: [OrgUnits]
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
 *         description: Org unit found
 *       404:
 *         description: Org unit not found
 *   put:
 *     summary: Update an org unit
 *     tags: [OrgUnits]
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
 *             $ref: '#/components/schemas/OrgUnit'
 *     responses:
 *       200:
 *         description: Org unit updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Org unit not found
 *   delete:
 *     summary: Delete an org unit
 *     tags: [OrgUnits]
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
 *         description: Org unit deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Org unit not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  orgUnitController.getOrgUnit,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  orgUnitController.updateOrgUnit,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  orgUnitController.deleteOrgUnit,
);

/**
 * @swagger
 * /org-units/{id}/assign-leader:
 *   post:
 *     summary: Assign a leader to an organisational unit
 *     tags: [OrgUnits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Org unit ID
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
 *       200:
 *         description: Leader assigned successfully
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Org unit or member not found
 */
router.post(
  "/:id/assign-leader",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  orgUnitController.assignLeader,
);

module.exports = router;