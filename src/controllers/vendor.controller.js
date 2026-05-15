const vendorService = require("../services/vendor.service");

const getVendors = async (req, res) => {
  try {
    const result = await vendorService.getAllVendors(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getVendor = async (req, res) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    return res.status(200).json({ success: true, data: vendor });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const vendor = await vendorService.createVendor(req.body);
    return res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await vendorService.updateVendor(req.params.id, req.body);
    return res.status(200).json({ success: true, data: vendor });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    await vendorService.deleteVendor(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Vendor deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
};
