const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "finance_officer", "staff"),
  vendorController.getVendors,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  vendorController.createVendor,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "finance_officer", "staff"),
  vendorController.getVendor,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  vendorController.updateVendor,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  vendorController.deleteVendor,
);

module.exports = router;
