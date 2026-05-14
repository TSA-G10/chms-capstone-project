const express = require("express");
const router = express.Router();
const programController = require("../controllers/program.controller");
const enrollmentController = require("../controllers/enrollment.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

// Programs CRUD
router.get("/", authenticate, programController.getPrograms);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  programController.createProgram,
);
router.get("/:id", authenticate, programController.getProgram);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  programController.updateProgram,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  programController.deleteProgram,
);

// Sessions
router.post(
  "/:id/sessions",
  authenticate,
  authorizeRoles("admin", "pastor"),
  programController.addSession,
);

// Enrollment
router.post(
  "/:id/enroll",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  enrollmentController.enrollMember,
);
router.get(
  "/:id/participants",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  enrollmentController.getParticipants,
);

module.exports = router;
