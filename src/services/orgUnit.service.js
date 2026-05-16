const OrganizationalUnit = require("../models/OrganizationalUnit");
const User = require("../models/User");

const getAllOrgUnits = async ({ page = 1, limit = 20, type }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const total = await OrganizationalUnit.countDocuments(filter);
  const data = await OrganizationalUnit.find(filter)
    .populate("leaderId", "firstName lastName role")
    .populate("parentId", "name type")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getOrgUnitById = async (id) => {
  const unit = await OrganizationalUnit.findOne({ _id: id, isActive: true })
    .populate("leaderId", "firstName lastName role")
    .populate("parentId", "name type");
  if (!unit) throw new Error("Organizational unit not found.");
  return unit;
};

const createOrgUnit = async (data) => {
  return OrganizationalUnit.create(data);
};

const updateOrgUnit = async (id, data) => {
  const unit = await OrganizationalUnit.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!unit) throw new Error("Organizational unit not found.");
  return unit;
};

const deleteOrgUnit = async (id) => {
  // Block delete if active children exist
  const children = await OrganizationalUnit.countDocuments({
    parentId: id,
    isActive: true,
  });
  if (children > 0)
    throw new Error(
      "Cannot delete unit with active sub-units. Deactivate children first.",
    );

  const unit = await OrganizationalUnit.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!unit) throw new Error("Organizational unit not found.");
};

const assignLeader = async (id, leaderId) => {
  const leader = await User.findOne({ _id: leaderId, isActive: true });
  if (!leader) throw new Error("Leader not found or inactive.");

  const unit = await OrganizationalUnit.findOneAndUpdate(
    { _id: id, isActive: true },
    { leaderId },
    { new: true },
  ).populate("leaderId", "firstName lastName role");
  if (!unit) throw new Error("Organizational unit not found.");
  return unit;
};

module.exports = {
  getAllOrgUnits,
  getOrgUnitById,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit,
  assignLeader,
};