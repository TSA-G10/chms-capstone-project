const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/attendance",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer", "pastor"),
  reportController.getAttendanceReport,
);

router.get(
  "/finance",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer"),
  reportController.getFinanceReport,
);

router.get(
  "/programs",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  reportController.getProgramsReport,
);

module.exports = router;
