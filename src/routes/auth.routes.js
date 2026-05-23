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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: >
 *     Authentication and session management. Login is public. Registration is
 *     admin-only — there is no public signup. Access tokens expire in 15 minutes;
 *     refresh tokens expire in 7 days.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     security: []
 *     description: >
 *       Public endpoint. Rate limited to 10 requests per 15 minutes per IP.
 *       Returns a short-lived access token (15 min) and a long-lived refresh token (7 days).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@church.org
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 *       429:
 *         description: Rate limit exceeded — too many login attempts
 */
router.post("/login", loginLimiter, authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Obtain a new access token using a refresh token
 *     tags: [Auth]
 *     security: []
 *     description: >
 *       Public endpoint. Refresh tokens are validated server-side.
 *       Use this when the access token has expired.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: Token refreshed
 *       401:
 *         description: Refresh token is invalid or expired
 */
router.post("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user account (admin only — no public signup)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Only `super_admin` or `admin` can register new users. There is no public
 *       self-registration. Passwords are hashed with bcrypt at 12 salt rounds.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, role]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Emeka
 *               lastName:
 *                 type: string
 *                 example: Okafor
 *               email:
 *                 type: string
 *                 format: email
 *                 example: emeka@church.org
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, pastor, finance_officer, welfare_officer, staff, volunteer]
 *                 example: finance_officer
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *     responses:
 *       201:
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Validation error or email already in use
 *       401:
 *         description: No token provided or token invalid
 *       403:
 *         description: Forbidden — only super_admin or admin can register users
 */
router.post(
    "/register",
    authenticate,
    authorizeRoles("super_admin", "admin"),
    authController.register,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out and invalidate the current session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Invalidates the user's refresh token server-side.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized — no valid token
 */
router.post("/logout", authenticate, authController.logout);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change the currently logged-in user's password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Users can only change their own password. The current password must be
 *       provided and verified before the new one is set.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPass123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPass456!
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Unauthorized — no valid token
 */
router.post("/change-password", authenticate, authController.changePassword);

module.exports = router;