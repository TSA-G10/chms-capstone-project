const InventoryItem = require("../models/InventoryItem");
const Expense = require("../models/Expense");

const getAllInventory = async ({ page = 1, limit = 20, category }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const total = await InventoryItem.countDocuments(filter);
  const data = await InventoryItem.find(filter)
    .populate("vendorId", "name contactPerson phone")
    .populate("expenseId", "title amount date")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getInventoryById = async (id) => {
  const item = await InventoryItem.findOne({ _id: id, isActive: true })
    .populate("vendorId", "name contactPerson phone email")
    .populate("expenseId", "title amount date category");
  if (!item) throw new Error("Inventory item not found.");
  return item;
};

const createInventoryItem = async (data) => InventoryItem.create(data);

const updateInventoryItem = async (id, data) => {
  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!item) throw new Error("Inventory item not found.");
  return item;
};

const deleteInventoryItem = async (id) => {
  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!item) throw new Error("Inventory item not found.");
};

const linkExpense = async (itemId, expenseId) => {
  // Validate the expense exists
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new Error("Expense not found.");

  const item = await InventoryItem.findOneAndUpdate(
    { _id: itemId, isActive: true },
    { expenseId },
    { new: true },
  ).populate("expenseId", "title amount date");
  if (!item) throw new Error("Inventory item not found.");
  return item;
};

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  linkExpense,
};
