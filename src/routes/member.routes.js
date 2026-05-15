const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  memberController.getMembers,
);

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  upload.single("profileImage"),
  memberController.createMember,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  memberController.getMember,
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  memberController.updateMember,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  memberController.deleteMember,
);

router.get(
  "/:id/attendance",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  memberController.getMemberAttendance,
);

module.exports = router;
