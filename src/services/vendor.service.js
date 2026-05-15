const Vendor = require("../models/Vendor");

const getAllVendors = async ({ page = 1, limit = 20, category }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;
  const skip = (page - 1) * limit;
  const total = await Vendor.countDocuments(filter);
  const data = await Vendor.find(filter)
    .sort({ name: 1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getVendorById = async (id) => {
  const vendor = await Vendor.findOne({ _id: id, isActive: true });
  if (!vendor) throw new Error("Vendor not found.");
  return vendor;
};

const createVendor = async (data) => Vendor.create(data);

const updateVendor = async (id, data) => {
  const vendor = await Vendor.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!vendor) throw new Error("Vendor not found.");
  return vendor;
};

const deleteVendor = async (id) => {
  const vendor = await Vendor.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!vendor) throw new Error("Vendor not found.");
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};
