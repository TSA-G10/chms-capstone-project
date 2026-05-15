const eventService = require("../services/event.service");
const {
  createEventSchema,
  updateEventSchema,
} = require("../validators/event.validator");

const getEvents = async (req, res) => {
  try {
    const result = await eventService.getAllEvents(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { error } = createEventSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const event = await eventService.createEvent(req.body, req.user._id);
    return res.status(201).json({ success: true, data: event });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { error } = updateEventSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const event = await eventService.updateEvent(req.params.id, req.body);
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Event deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
