const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

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
