const express = require("express");
const router = express.Router();
const orgUnitController = require("../controllers/orgUnit.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  orgUnitController.getOrgUnits,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.createOrgUnit,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  orgUnitController.getOrgUnit,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.updateOrgUnit,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.deleteOrgUnit,
);
router.post(
  "/:id/assign-leader",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.assignLeader,
);

module.exports = router;