const Mission = require("../models/Mission");
const User = require("../models/User");

const getAllMissions = async ({ page = 1, limit = 20, status }) => {
  const filter = { isActive: true };
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const total = await Mission.countDocuments(filter);
  const data = await Mission.find(filter)
    .populate("volunteers", "firstName lastName role")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getMissionById = async (id) => {
  const m = await Mission.findOne({ _id: id, isActive: true }).populate(
    "volunteers",
    "firstName lastName email role",
  );
  if (!m) throw new Error("Mission not found.");
  return m;
};

const createMission = async (data) => Mission.create(data);

const updateMission = async (id, data) => {
  const m = await Mission.findOneAndUpdate({ _id: id, isActive: true }, data, {
    new: true,
    runValidators: true,
  });
  if (!m) throw new Error("Mission not found.");
  return m;
};

const deleteMission = async (id) => {
  const m = await Mission.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!m) throw new Error("Mission not found.");
};

const addVolunteer = async (missionId, volunteerId) => {
  const volunteer = await User.findOne({ _id: volunteerId, isActive: true });
  if (!volunteer) throw new Error("Volunteer (User) not found or inactive.");

  const m = await Mission.findOneAndUpdate(
    { _id: missionId, isActive: true },
    { $addToSet: { volunteers: volunteerId } }, // $addToSet prevents duplicates
    { new: true },
  ).populate("volunteers", "firstName lastName role");
  if (!m) throw new Error("Mission not found.");
  return m;
};

const getVolunteers = async (missionId) => {
  const m = await Mission.findOne({ _id: missionId, isActive: true }).populate(
    "volunteers",
    "firstName lastName email role phone",
  );
  if (!m) throw new Error("Mission not found.");
  return m.volunteers;
};

module.exports = {
  getAllMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
  addVolunteer,
  getVolunteers,
};
