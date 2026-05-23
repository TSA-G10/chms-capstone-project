const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Church inventory and asset management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         quantity:
 *           type: integer
 *         condition:
 *           type: string
 *           enum: [new, good, fair, poor]
 *         linkedExpenseId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inventory items
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Inventory item created
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  inventoryController.getInventory,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  inventoryController.createInventoryItem,
);

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get a single inventory item by ID
 *     tags: [Inventory]
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
 *         description: Inventory item found
 *       404:
 *         description: Item not found
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
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
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Item updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
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
 *         description: Item deleted
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 *       404:
 *         description: Item not found
 */
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  inventoryController.getInventoryItem,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  inventoryController.updateInventoryItem,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  inventoryController.deleteInventoryItem,
);

/**
 * @swagger
 * /inventory/{id}/link-expense:
 *   put:
 *     summary: Link an expense record to an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [expenseId]
 *             properties:
 *               expenseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense linked to inventory item
 *       403:
 *         description: Forbidden — requires super_admin or finance_officer role
 *       404:
 *         description: Item or expense not found
 */
router.put(
  "/:id/link-expense",
  authenticate,
  authorizeRoles("super_admin", "finance_officer"),
  inventoryController.linkExpense,
);

module.exports = router;