const WelfareCase = require("../models/WelfareCase");
const Member = require("../models/Member");

const getAllWelfareCases = async ({ page = 1, limit = 20, status }) => {
  const filter = { isActive: true };
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const total = await WelfareCase.countDocuments(filter);
  const data = await WelfareCase.find(filter)
    .populate("memberId", "firstName lastName phone memberStatus")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getWelfareCaseById = async (id) => {
  const wc = await WelfareCase.findOne({ _id: id, isActive: true })
    .populate("memberId", "firstName lastName phone address memberStatus")
    .populate("supportLog.recordedBy", "firstName lastName role");
  if (!wc) throw new Error("Welfare case not found.");
  return wc;
};

const createWelfareCase = async (data) => {
  // Validate member exists
  const member = await Member.findOne({ _id: data.memberId, isActive: true });
  if (!member) throw new Error("Member not found or inactive.");
  return WelfareCase.create(data);
};

const updateWelfareCase = async (id, data) => {
  const wc = await WelfareCase.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!wc) throw new Error("Welfare case not found.");
  return wc;
};

const deleteWelfareCase = async (id) => {
  const wc = await WelfareCase.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!wc) throw new Error("Welfare case not found.");
};

const addSupportLog = async (id, logEntry, userId) => {
  const wc = await WelfareCase.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $push: {
        supportLog: {
          ...logEntry,
          recordedBy: userId,
          date: logEntry.date || new Date(),
        },
      },
    },
    { new: true, runValidators: true },
  ).populate("supportLog.recordedBy", "firstName lastName role");
  if (!wc) throw new Error("Welfare case not found.");
  return wc;
};

const getSupportLog = async (id) => {
  const wc = await WelfareCase.findOne({ _id: id, isActive: true })
    .select("supportLog")
    .populate("supportLog.recordedBy", "firstName lastName role");
  if (!wc) throw new Error("Welfare case not found.");
  return wc.supportLog;
};

module.exports = {
  getAllWelfareCases,
  getWelfareCaseById,
  createWelfareCase,
  updateWelfareCase,
  deleteWelfareCase,
  addSupportLog,
  getSupportLog,
};
