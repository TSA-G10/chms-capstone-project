const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  missionController.getMissions,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  missionController.createMission,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  missionController.getMission,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  missionController.updateMission,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  missionController.deleteMission,
);
router.post(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  missionController.addVolunteer,
);
router.get(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  missionController.getVolunteers,
);

module.exports = router;
