const Staff = require("../models/Staff");

const getAllStaff = async ({
  page = 1,
  limit = 20,
  department,
  isVolunteer,
}) => {
  const filter = { isActive: true };
  if (department) filter.department = department;
  if (isVolunteer !== undefined) filter.isVolunteer = isVolunteer === "true";
  const skip = (page - 1) * limit;
  const total = await Staff.countDocuments(filter);
  const data = await Staff.find(filter)
    .populate("userId", "firstName lastName email role")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getStaffById = async (id) => {
  const s = await Staff.findOne({ _id: id, isActive: true }).populate(
    "userId",
    "firstName lastName email role phone",
  );
  if (!s) throw new Error("Staff record not found.");
  return s;
};

const createStaff = async (data) => Staff.create(data);

const updateStaff = async (id, data) => {
  const s = await Staff.findOneAndUpdate({ _id: id, isActive: true }, data, {
    new: true,
    runValidators: true,
  });
  if (!s) throw new Error("Staff record not found.");
  return s;
};

const deleteStaff = async (id) => {
  const s = await Staff.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!s) throw new Error("Staff record not found.");
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
