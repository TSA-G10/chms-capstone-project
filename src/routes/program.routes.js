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
  authorizeRoles("super_admin", "admin", "pastor"),
  programController.createProgram,
);
router.get("/:id", authenticate, programController.getProgram);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  programController.updateProgram,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  programController.deleteProgram,
);

// Sessions
router.post(
  "/:id/sessions",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  programController.addSession,
);

// Enrollment
router.post(
  "/:id/enroll",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  enrollmentController.enrollMember,
);
router.get(
  "/:id/participants",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  enrollmentController.getParticipants,
);

module.exports = router;
