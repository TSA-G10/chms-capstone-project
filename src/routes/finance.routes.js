const express = require("express");
const router = express.Router();
const contributionController = require("../controllers/contribution.controller");
const expenseController = require("../controllers/expense.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

// Contributions
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

// Expenses
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

// Summary — admin only
router.get(
  "/summary",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  contributionController.getFinanceSummary,
);

module.exports = router;
