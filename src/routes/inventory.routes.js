const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

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
router.put(
  "/:id/link-expense",
  authenticate,
  authorizeRoles("super_admin", "finance_officer"),
  inventoryController.linkExpense,
);

module.exports = router;
