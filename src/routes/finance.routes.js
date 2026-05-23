const express = require("express");
const router = express.Router();
const contributionController = require("../controllers/contribution.controller");
const expenseController = require("../controllers/expense.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Contributions, expenses, and financial summaries
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contribution:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [tithe, offering, donation, pledge]
 *         memberId:
 *           type: string
 *           description: Optional — contributions can be anonymous (no memberId required)
 *         date:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *     Expense:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         receiptUrl:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /finance/contributions:
 *   post:
 *     summary: Record a new contribution
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Records a financial contribution. Note: `memberId` is optional —
 *       contributions can be recorded anonymously without linking to a member.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contribution'
 *     responses:
 *       201:
 *         description: Contribution recorded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires super_admin, finance_officer, or admin role
 *   get:
 *     summary: Get all contributions
 *     tags: [Finance]
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
 *         description: List of contributions
 *       403:
 *         description: Forbidden
 */
router.post(
  "/contributions",
  authenticate,
  authorizeRoles("super_admin", "finance_officer", "admin"),
  contributionController.createContribution,
);
router.get(
  "/contributions",
  authenticate,
  authorizeRoles("super_admin", "finance_officer", "admin"),
  contributionController.getContributions,
);

/**
 * @swagger
 * /finance/expenses:
 *   post:
 *     summary: Record a new expense (with optional receipt upload)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [amount, category]
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Optional receipt file upload
 *     responses:
 *       201:
 *         description: Expense recorded successfully
 *       403:
 *         description: Forbidden — requires super_admin, finance_officer, or admin role
 *   get:
 *     summary: Get all expenses
 *     tags: [Finance]
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
 *         description: List of expenses
 *       403:
 *         description: Forbidden
 */
router.post(
  "/expenses",
  authenticate,
  authorizeRoles("super_admin", "finance_officer", "admin"),
  upload.single("receipt"),
  expenseController.createExpense,
);
router.get(
  "/expenses",
  authenticate,
  authorizeRoles("super_admin", "finance_officer", "admin"),
  expenseController.getExpenses,
);

/**
 * @swagger
 * /finance/summary:
 *   get:
 *     summary: Get financial summary (totals, balance)
 *     tags: [Finance]
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
 *         description: Financial summary with total contributions, expenses, and balance
 *       403:
 *         description: Forbidden — requires super_admin or admin role
 */
router.get(
  "/summary",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  contributionController.getFinanceSummary,
);

module.exports = router;