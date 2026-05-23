const AuditLog = require("../models/AuditLog");

const getAuditLogs = async ({
  page = 1,
  limit = 20,
  entity,
  action,
  userId,
}) => {
  const filter = {};
  if (entity) filter.entity = entity;
  if (action) filter.action = action;
  if (userId) filter.userId = userId;

  const skip = (page - 1) * limit;
  const total = await AuditLog.countDocuments(filter);
  const logs = await AuditLog.find(filter)
    .populate("userId", "firstName lastName email role")
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { total, page: Number(page), limit: Number(limit), data: logs };
};

module.exports = { getAuditLogs };
