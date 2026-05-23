const express = require("express");
const router = express.Router();

const auditController = require("../controllers/audit.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Audit
 *   description: System audit logs — super_admin only
 */

/**
 * @swagger
 * /audit:
 *   get:
 *     summary: Get all audit logs
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of audit log entries
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires super_admin role
 */
router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin"),
  auditController.getAuditLogs,
);

module.exports = router;