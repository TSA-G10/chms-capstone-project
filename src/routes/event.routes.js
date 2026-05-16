const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const attendanceController = require("../controllers/attendance.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

// Events CRUD
router.get(
  "/",
  authenticate,
  eventController.getEvents, // all authenticated users
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  eventController.createEvent,
);
router.get(
  "/:id",
  authenticate,
  eventController.getEvent, // all authenticated users
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  eventController.updateEvent,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  eventController.deleteEvent,
);

// Attendance
router.post(
  "/:id/attendance",
  authenticate,
  authorizeRoles("staff", "admin", "pastor"),
  attendanceController.recordAttendance,
);
router.get(
  "/:id/attendance",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  attendanceController.getEventAttendance,
);

module.exports = router;
