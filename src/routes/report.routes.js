const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Attendance, finance, and program reports
 */

/**
 * @swagger
 * /reports/attendance:
 *   get:
 *     summary: Get attendance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance report data
 *       403:
 *         description: Forbidden — requires super_admin, admin, finance_officer, or pastor role
 */
router.get(
  "/attendance",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer", "pastor"),
  reportController.getAttendanceReport,
);

/**
 * @swagger
 * /reports/finance:
 *   get:
 *     summary: Get finance report (contributions and expenses over a period)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Finance report data
 *       403:
 *         description: Forbidden — requires super_admin, admin, or finance_officer role
 */
router.get(
  "/finance",
  authenticate,
  authorizeRoles("super_admin", "admin", "finance_officer"),
  reportController.getFinanceReport,
);

/**
 * @swagger
 * /reports/programs:
 *   get:
 *     summary: Get programs report (enrollment and session data)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Programs report data
 *       403:
 *         description: Forbidden — requires super_admin, admin, or pastor role
 */
router.get(
  "/programs",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  reportController.getProgramsReport,
);

module.exports = router;