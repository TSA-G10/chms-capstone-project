const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

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
