const express = require("express");
const router = express.Router();
const fellowshipController = require("../controllers/fellowship.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  fellowshipController.getFellowships,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  fellowshipController.createFellowship,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  fellowshipController.getFellowship,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  fellowshipController.updateFellowship,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  fellowshipController.deleteFellowship,
);
router.get(
  "/:id/members",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  fellowshipController.getFellowshipMembers,
);

module.exports = router;
