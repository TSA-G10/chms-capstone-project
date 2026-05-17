const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  staffController.getStaff,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  staffController.createStaff,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  staffController.getStaffById,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  staffController.updateStaff,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  staffController.deleteStaff,
);

module.exports = router;