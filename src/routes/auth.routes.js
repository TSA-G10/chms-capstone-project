const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

// Rate limiter — 10 requests per 15 minutes per IP on login
const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 10,
    message: {
        success: false,
        error: "Too many login attempts. Try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Public routes
router.post("/login", loginLimiter, authController.login);
router.post("/refresh", authController.refresh);

// Protected routes
router.post(
    "/register",
    authenticate,
    authorizeRoles("super_admin", "admin"),
    authController.register,
);
router.post("/logout", authenticate, authController.logout);
router.post("/change-password", authenticate, authController.changePassword);

module.exports = router;