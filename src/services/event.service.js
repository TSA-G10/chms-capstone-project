const Event = require("../models/Event");

const getAllEvents = async ({ page = 1, limit = 20, type, from, to }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const total = await Event.countDocuments(filter);
  const data = await Event.find(filter)
    .populate("createdBy", "firstName lastName")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getEventById = async (id) => {
  const event = await Event.findOne({ _id: id, isActive: true }).populate(
    "createdBy",
    "firstName lastName role",
  );
  if (!event) throw new Error("Event not found.");
  return event;
};

const createEvent = async (data, userId) => {
  return Event.create({ ...data, createdBy: userId });
};

const updateEvent = async (id, data) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!event) throw new Error("Event not found.");
  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!event) throw new Error("Event not found.");
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
