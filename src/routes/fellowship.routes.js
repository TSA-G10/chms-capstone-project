const express = require("express");
const router = express.Router();
const fellowshipController = require("../controllers/fellowship.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  fellowshipController.getFellowships,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  fellowshipController.createFellowship,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  fellowshipController.getFellowship,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  fellowshipController.updateFellowship,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  fellowshipController.deleteFellowship,
);
router.get(
  "/:id/members",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor", "staff"),
  fellowshipController.getFellowshipMembers,
);

module.exports = router;
