const express = require("express");
const router = express.Router();

const auditController = require("../controllers/audit.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin"),
  auditController.getAuditLogs,
);

module.exports = router;
