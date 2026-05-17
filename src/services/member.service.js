const Member = require("../models/Member");

const getAllMembers = async ({
  page = 1,
  limit = 20,
  status,
  fellowshipId,
}) => {
  const filter = { isActive: true };
  if (status) filter.memberStatus = status;
  if (fellowshipId) filter.fellowshipId = fellowshipId;

  const skip = (page - 1) * limit;
  const total = await Member.countDocuments(filter);
  const data = await Member.find(filter)
    .lean()
    .sort({ lastName: 1, firstName: 1 })
    .skip(skip)
    .limit(Number(limit));

  return { total, page: Number(page), limit: Number(limit), data };
};

const getMemberById = async (id) => {
  const member = await Member.findOne({ _id: id, isActive: true }).populate(
    "fellowshipId",
    "name meetingDay location",
  );
  if (!member) throw new Error("Member not found.");
  return member;
};

const createMember = async (data, profileImageUrl) => {
  if (profileImageUrl) data.profileImage = profileImageUrl;
  return Member.create(data);
};

const updateMember = async (id, data) => {
  const member = await Member.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!member) throw new Error("Member not found.");
  return member;
};

const deleteMember = async (id) => {
  const member = await Member.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!member) throw new Error("Member not found.");
};

const getMemberAttendance = async (id, { page = 1, limit = 20 }) => {
  const Attendance = require("../models/Attendance");
  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments({ memberId: id });
  const data = await Attendance.find({ memberId: id })
    .populate("eventId", "title date type location")
    .sort({ checkedInAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberAttendance,
};
