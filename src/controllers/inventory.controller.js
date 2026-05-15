const inventoryService = require("../services/inventory.service");

const getInventory = async (req, res) => {
  try {
    const result = await inventoryService.getAllInventory(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.getInventoryById(req.params.id);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.createInventoryItem(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.updateInventoryItem(
      req.params.id,
      req.body,
    );
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    await inventoryService.deleteInventoryItem(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Inventory item deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const linkExpense = async (req, res) => {
  try {
    const { expenseId } = req.body;
    if (!expenseId)
      return res
        .status(400)
        .json({ success: false, error: "expenseId is required." });
    const item = await inventoryService.linkExpense(req.params.id, expenseId);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  linkExpense,
};
