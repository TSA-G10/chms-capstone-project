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
  authorizeRoles("finance_officer", "admin"),
  contributionController.createContribution,
);
router.get(
  "/contributions",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  contributionController.getContributions,
);

// Expenses
router.post(
  "/expenses",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  upload.single("receipt"),
  expenseController.createExpense,
);
router.get(
  "/expenses",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  expenseController.getExpenses,
);

// Summary — admin only
router.get(
  "/summary",
  authenticate,
  authorizeRoles("admin"),
  contributionController.getFinanceSummary,
);

module.exports = router;
