const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  missionController.getMissions,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  missionController.createMission,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  missionController.getMission,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  missionController.updateMission,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  missionController.deleteMission,
);
router.post(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("admin", "pastor"),
  missionController.addVolunteer,
);
router.get(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  missionController.getVolunteers,
);

module.exports = router;
