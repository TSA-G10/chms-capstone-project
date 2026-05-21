const Fellowship = require("../models/Fellowship");
const Member = require("../models/Member");

const getAllFellowships = async ({ page = 1, limit = 20, unitId }) => {
  const filter = { isActive: true };
  if (unitId) filter.unitId = unitId;
  const skip = (page - 1) * limit;
  const total = await Fellowship.countDocuments(filter);
  const data = await Fellowship.find(filter)
    .populate("unitId", "name type")
    .populate("leaderId", "firstName lastName")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getFellowshipById = async (id) => {
  const f = await Fellowship.findOne({ _id: id, isActive: true })
    .populate("unitId", "name type")
    .populate("leaderId", "firstName lastName phone");
  if (!f) throw new Error("Fellowship not found.");
  return f;
};

const createFellowship = async (data) => Fellowship.create(data);

const updateFellowship = async (id, data) => {
  const f = await Fellowship.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!f) throw new Error("Fellowship not found.");
  return f;
};

const deleteFellowship = async (id) => {
  const f = await Fellowship.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!f) throw new Error("Fellowship not found.");
};

const getFellowshipMembers = async (id, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const filter = { fellowshipId: id, isActive: true };
  const total = await Member.countDocuments(filter);
  const data = await Member.find(filter)
    .select("firstName lastName phone memberStatus")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = {
  getAllFellowships,
  getFellowshipById,
  createFellowship,
  updateFellowship,
  deleteFellowship,
  getFellowshipMembers,
};
