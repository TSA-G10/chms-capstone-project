const express = require("express");
const router = express.Router();
const welfareController = require("../controllers/welfare.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "welfare_officer"),
  welfareController.getWelfareCases,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "welfare_officer"),
  welfareController.createWelfareCase,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "welfare_officer"),
  welfareController.getWelfareCase,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "welfare_officer"),
  welfareController.updateWelfareCase,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  welfareController.deleteWelfareCase,
);
router.post(
  "/:id/support-log",
  authenticate,
  authorizeRoles("admin", "welfare_officer"),
  welfareController.addSupportLog,
);
router.get(
  "/:id/support-log",
  authenticate,
  authorizeRoles("admin", "pastor", "welfare_officer"),
  welfareController.getSupportLog,
);

module.exports = router;
