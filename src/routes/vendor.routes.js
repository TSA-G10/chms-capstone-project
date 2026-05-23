const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor/supplier management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vendor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         contactPerson:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendors
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       201:
 *         description: Vendor created
 *       403:
 *         description: Forbidden — requires super_admin, admin, or finance_officer role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer", "staff"),
  vendorController.getVendors,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer"),
  vendorController.createVendor,
);

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get a single vendor by ID
 *     tags: [Vendors]
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
 *         description: Vendor found
 *       404:
 *         description: Vendor not found
 *   put:
 *     summary: Update a vendor
 *     tags: [Vendors]
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
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       200:
 *         description: Vendor updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vendor not found
 *   delete:
 *     summary: Delete a vendor
 *     tags: [Vendors]
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
 *         description: Vendor deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Vendor not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer", "staff"),
  vendorController.getVendor,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer"),
  vendorController.updateVendor,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  vendorController.deleteVendor,
);

module.exports = router;