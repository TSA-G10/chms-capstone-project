const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/media.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const mediaUpload = require("../middlewares/mediaUpload");

router.get("/", authenticate, mediaController.getAllMedia);
router.post(
  "/",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  mediaController.createMedia,
);
router.get("/:id", authenticate, mediaController.getMedia);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  mediaController.updateMedia,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  mediaController.deleteMedia,
);

router.post(
  "/:id/upload",
  authenticate,
  authorizeRoles("super_admin", "admin", "pastor"),
  mediaUpload.single("file"),
  mediaController.uploadMediaFile,
);

module.exports = router;
