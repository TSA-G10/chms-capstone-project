const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  inventoryController.getInventory,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  inventoryController.createInventoryItem,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  inventoryController.getInventoryItem,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  inventoryController.updateInventoryItem,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  inventoryController.deleteInventoryItem,
);
router.put(
  "/:id/link-expense",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  inventoryController.linkExpense,
);

module.exports = router;
