const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/attendance",
  authenticate,
  authorizeRoles("admin", "finance_officer", "pastor"),
  reportController.getAttendanceReport,
);

router.get(
  "/finance",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  reportController.getFinanceReport,
);

router.get(
  "/programs",
  authenticate,
  authorizeRoles("admin", "pastor"),
  reportController.getProgramsReport,
);

module.exports = router;
