const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcement.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get("/", authenticate, announcementController.getAnnouncements);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  announcementController.createAnnouncement,
);
router.get("/:id", authenticate, announcementController.getAnnouncement);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  announcementController.updateAnnouncement,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  announcementController.deleteAnnouncement,
);

module.exports = router;