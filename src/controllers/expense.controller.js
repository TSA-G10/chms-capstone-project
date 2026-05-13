const expenseService = require("../services/expense.service");
const uploadToCloud = require("../utils/uploadToCloud");
const { expenseSchema } = require("../validators/finance.validator");

const createExpense = async (req, res) => {
  try {
    const { error } = expenseSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    let fileInfo = null;
    if (req.file) {
      fileInfo = await uploadToCloud(req.file.buffer, "chms-receipts");
    }

    const expense = await expenseService.createExpense(
      req.body,
      req.user._id,
      fileInfo,
    );
    return res.status(201).json({ success: true, data: expense });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const result = await expenseService.getAllExpenses(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createExpense, getExpenses };
