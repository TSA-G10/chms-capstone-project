# ChMS Capstone Project

## Team Implementation Plan — Authentication & RBAC

### Extracted from Document VI: Master Implementation Plan

---

| Field      | Detail                             |
| ---------- | ---------------------------------- |
| Team       | Team 02 — Authentication & RBAC    |
| Members    | Auth Dev 1, Auth Dev 2, Auth Dev 3 |
| Lead       | Auth Lead                          |
| Version    | 2.1                                |
| Date       | May 5, 2026                        |
| Submission | May 24, 2026                       |

> This is your team's primary daily reference. It contains your phase-by-phase tasks, exit criteria, copy-paste implementation code, and exact git commands. For full system context refer to the master control documents (Doc I–VI).

---

## Branch Structure

This project uses a **3-tier branch model**. Understand this before writing a single line of code:

```
main                          ← General admin only. Final submission. Do not touch.
  └── develop                 ← Auth Lead PRs here when a phase is complete and verified.
        └── team-02-auth-rbac    ← Your team's working branch. All feature branches stem from here.
              └── feature/auth-jwt-utilities   ← Auth Dev 1 works here
              └── feature/auth-middleware       ← Auth Dev 2 works here
              └── feature/auth-endpoints        ← Auth Dev 3 works here
```

**The rules:**

- Contributors **never** push directly to `develop` or `main`
- Contributors **never** branch off `develop` — always branch off `team-02-auth-rbac`
- Auth Lead reviews and merges all PRs into `team-02-auth-rbac`
- Auth Lead opens the PR from `team-02-auth-rbac` → `develop` only when the phase is confirmed done and ready for integration

---

## Your Team's Scope

**You own:** JWT token lifecycle, authentication middleware, role-based access control, all /auth endpoints, document upload endpoints, and audit logging. Every other team's routes depend on your middleware. Deliver Phase 1 by end of Day 3 — no API team can protect their routes without you.

---

## Phase 1 — Auth Foundation (Days 1–3: May 5–7)

---

### STEP 1 — Get Latest Team Branch and Create Your Feature Branch

Every developer runs this before writing a single line of code:

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git checkout -b feature/auth-jwt-utilities        # Auth Dev 1
# OR
git checkout -b feature/auth-middleware            # Auth Dev 2
# OR
git checkout -b feature/auth-endpoints            # Auth Dev 3

# Immediately push your branch to remote
git push origin feature/auth-jwt-utilities        # replace with your branch name
```

---

### T-AU-001 — JWT Utility (Auth Dev 1)

**Branch:** `feature/auth-jwt-utilities`

Create `src/utils/jwt.js`:

```js
const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
```

**Git commands after completing this task:**

```bash
git add src/utils/jwt.js
git commit -m "feat(auth): add JWT utility — generateAccessToken, generateRefreshToken, verifyToken"
git push origin feature/auth-jwt-utilities
# Open Pull Request: feature/auth-jwt-utilities → team-02-auth-rbac
# Request review from Auth Lead
```

**After Auth Lead approves and merges into the team branch:**

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d feature/auth-jwt-utilities
```

---

### T-AU-002 — authenticate Middleware (Auth Dev 2)

**Branch:** `feature/auth-middleware`

Create `src/middlewares/authenticate.js`:

```js
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: "User not found or account deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Token expired." });
    }
    return res.status(401).json({ success: false, error: "Invalid token." });
  }
};

module.exports = authenticate;
```

---

### T-AU-003 — authorizeRoles Middleware (Auth Dev 3)

**Branch:** `feature/auth-endpoints`

Create `src/middlewares/authorizeRoles.js`:

```js
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
```

**Git commands after completing T-AU-002 and T-AU-003:**

```bash
# Auth Dev 2:
git add src/middlewares/authenticate.js
git commit -m "feat(auth): add authenticate middleware with Bearer token extraction"
git push origin feature/auth-middleware
# Open Pull Request: feature/auth-middleware → team-02-auth-rbac
# Request review from Auth Lead

# Auth Dev 3:
git add src/middlewares/authorizeRoles.js
git commit -m "feat(auth): add authorizeRoles RBAC middleware"
git push origin feature/auth-endpoints
# (Auth Dev 3 continues building auth endpoints on this branch)
```

**After Auth Lead approves and merges into the team branch:**

```bash
# Auth Dev 2
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d feature/auth-middleware

# Auth Dev 3 — do NOT delete feature/auth-endpoints yet; you continue on it for T-AU-004, T-AU-005, T-AU-006
```

---

### T-AU-004 — POST /auth/register (Auth Dev 1)

**Branch:** `feature/auth-jwt-utilities` (continue on this branch after jwt.js is merged, or coordinate with Auth Lead to combine into `feature/auth-endpoints`)

Create `src/validators/auth.validator.js`:

```js
const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid(
      "super_admin",
      "admin",
      "pastor",
      "finance_officer",
      "welfare_officer",
      "staff",
      "volunteer",
    )
    .required(),
  phone: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = { registerSchema, loginSchema, changePasswordSchema };
```

Create `src/services/auth.service.js`:

```js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwt");

const register = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  phone,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered.");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    phone,
  });

  // Never return the password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) throw new Error("Invalid credentials.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials.");

  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.lastLogin = new Date();
  await user.save();

  return { accessToken, refreshToken };
};

const refresh = ({ refreshToken }) => {
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  const accessToken = generateAccessToken({
    id: decoded.id,
    role: decoded.role,
  });
  return { accessToken };
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found.");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect.");

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
};

module.exports = { register, login, refresh, changePassword };
```

Create `src/controllers/auth.controller.js`:

```js
const authService = require("../services/auth.service");
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require("../validators/auth.validator");

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const user = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully.",
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const tokens = await authService.login(req.body);
    return res.status(200).json({ success: true, data: tokens });
  } catch (err) {
    return res.status(401).json({ success: false, error: err.message });
  }
};

const refresh = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, error: "Refresh token required." });

    const result = authService.refresh({ refreshToken });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired refresh token." });
  }
};

const logout = (req, res) => {
  // Stateless JWT — client discards token
  // Extend here to blacklist token in Redis if needed in future
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
};

const changePassword = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    await authService.changePassword(req.user._id, req.body);
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { register, login, refresh, logout, changePassword };
```

---

### T-AU-005 & T-AU-006 — Auth Routes with Rate Limiting (Auth Dev 3)

**Branch:** `feature/auth-endpoints`

Install rate limiter (coordinate with Team 6 — may already be in package.json):

```bash
# Only run if not already installed
npm install express-rate-limit
```

Create `src/routes/auth.routes.js`:

```js
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
```

Mount in `src/app.js` (coordinate with Team 6):

```js
const authRoutes = require("./routes/auth.routes");
app.use("/api/v1/auth", authRoutes);
```

**Git commands after completing all Phase 1 tasks:**

```bash
# Auth Dev 1
git add src/validators/auth.validator.js src/services/auth.service.js src/controllers/auth.controller.js
git commit -m "feat(auth): add register, login, refresh, logout, change-password service and controller"
git push origin feature/auth-jwt-utilities
# Open Pull Request: feature/auth-jwt-utilities → team-02-auth-rbac
# Request review from Auth Lead

# Auth Dev 3
git add src/routes/auth.routes.js
git commit -m "feat(auth): add auth routes with rate limiting on /login"
git push origin feature/auth-endpoints
# Open Pull Request: feature/auth-endpoints → team-02-auth-rbac
# Request review from Auth Lead
```

---

### STEP 2 — After Your PR is Approved and Merged

```bash
# Auth Dev 1
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d feature/auth-jwt-utilities

# Auth Dev 2
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d feature/auth-middleware

# Auth Dev 3
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d feature/auth-endpoints
```

---

### STEP 3 — Auth Lead: PR Team Branch to Develop

> **This step is for Auth Lead only.** Run this only when all Phase 1 tasks are confirmed complete and tested locally.

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac

# Go to GitHub and open a Pull Request:
# team-02-auth-rbac → develop
# Title: "feat(auth): merge Phase 1 auth foundation — Team 02"
# Confirm all exit criteria are met before submitting
```

---

**Phase 1 Exit Criteria:**

- [ ] All 5 auth endpoints tested via Postman
- [ ] `authenticate` middleware: valid token → passes, expired token → 401, missing token → 401
- [ ] `authorizeRoles` tested: correct role → passes, wrong role → 403
- [ ] Rate limiting confirmed on `/auth/login` (11th request in window returns 429)
- [ ] Passwords never returned in any response — verified in Postman
- [ ] Auth Lead has opened and merged PR: `team-02-auth-rbac` → `develop`

---

## Phase 2 — Route Protection (Days 4–10: May 8–14)

> No new auth endpoints. Your job is to ensure every route from Teams 3, 4, and 5 is correctly protected before their PRs are merged.

**How to review a PR for auth correctness:**

Open the PR on GitHub. In the Files Changed tab, check every route file for this exact pattern:

```js
// CORRECT — always in this order
router.get(
  "/resource",
  authenticate, // 1. verify token
  authorizeRoles("admin", "pastor"), // 2. check role
  controller.getResource, // 3. handle request
);

// WRONG — reject this PR
router.get("/resource", controller.getResource); // No auth at all
router.get("/resource", authorizeRoles("admin"), controller.getResource); // Missing authenticate
```

**RBAC reference — use this when reviewing PRs:**

| Route group                 | Allowed roles          |
| --------------------------- | ---------------------- |
| GET /members                | admin, pastor, staff   |
| POST/PUT /members           | admin, pastor          |
| DELETE /members             | admin                  |
| POST /finance/\*            | finance_officer, admin |
| GET /finance/summary        | admin                  |
| POST /events                | admin, pastor          |
| POST /events/:id/attendance | staff, admin           |
| POST /welfare/\*            | welfare_officer, admin |
| GET /audit                  | super_admin            |

**If a middleware bug is found:**

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git checkout -b fix/auth-middleware-[description]
git push origin fix/auth-middleware-[description]

# Fix, then:
git add src/middlewares/
git commit -m "fix(auth): [describe the fix]"
git push origin fix/auth-middleware-[description]
# Open PR: fix/auth-middleware-[description] → team-02-auth-rbac
# Tag Auth Lead for review
```

**After Auth Lead approves and merges into the team branch:**

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d fix/auth-middleware-[description]
```

Once Auth Lead merges the fix into `team-02-auth-rbac`, Auth Lead opens a PR to `develop`.

**Phase 2 Exit Criteria:**

- [ ] Every Phase 2 route (Teams 3, 4, 5) has `authenticate` + `authorizeRoles` applied
- [ ] Unauthenticated request to any protected route returns 401
- [ ] Wrong-role request to any protected route returns 403

---

## Phase 3 — Document Management (Days 11–16: May 15–20)

### STEP 1 — Branch Setup

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git checkout -b feature/auth-document-upload
git push origin feature/auth-document-upload
```

---

### T-AU-007 — POST /documents/upload (Auth Dev 1)

Create `src/middlewares/upload.js`:

```js
const multer = require("multer");

// Store in memory — we stream to Cloudinary from buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: JPEG, PNG, PDF."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for images/docs
});

module.exports = upload;
```

Create `src/models/Document.js`:

```js
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    public_id: { type: String, required: true },
    entityType: { type: String, required: true }, // e.g. 'Member', 'Expense'
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    mimeType: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);
```

Create `src/services/document.service.js`:

```js
const cloudinary = require("../config/cloudinary");
const Document = require("../models/Document");
const uploadToCloud = require("../utils/uploadToCloud");

const uploadDocument = async (file, { entityType, entityId }, userId) => {
  const { url, public_id } = await uploadToCloud(file.buffer, "chms-documents");

  const doc = await Document.create({
    fileUrl: url,
    public_id,
    entityType,
    entityId,
    uploadedBy: userId,
    mimeType: file.mimetype,
  });

  return doc;
};

const getDocuments = async ({ entityType, entityId }) => {
  const filter = { isActive: true };
  if (entityType) filter.entityType = entityType;
  if (entityId) filter.entityId = entityId;
  return Document.find(filter).sort({ createdAt: -1 });
};

const getDocumentById = async (id) => {
  const doc = await Document.findById(id);
  if (!doc || !doc.isActive) throw new Error("Document not found.");
  return doc;
};

const deleteDocument = async (id) => {
  const doc = await Document.findById(id);
  if (!doc) throw new Error("Document not found.");

  await cloudinary.uploader.destroy(doc.public_id);
  doc.isActive = false;
  await doc.save();
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
```

---

### T-AU-008 — Document Routes (Auth Dev 2)

Create `src/controllers/document.controller.js`:

```js
const documentService = require("../services/document.service");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded." });
    const { entityType, entityId } = req.body;
    if (!entityType || !entityId) {
      return res.status(400).json({
        success: false,
        error: "entityType and entityId are required.",
      });
    }

    const doc = await documentService.uploadDocument(
      req.file,
      { entityType, entityId },
      req.user._id,
    );
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const docs = await documentService.getDocuments(req.query);
    return res.status(200).json({ success: true, data: docs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    await documentService.deleteDocument(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Document deleted." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};
```

Create `src/routes/document.routes.js`:

```js
const express = require("express");
const router = express.Router();

const documentController = require("../controllers/document.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

router.post(
  "/",
  authenticate,
  authorizeRoles(
    "admin",
    "pastor",
    "finance_officer",
    "welfare_officer",
    "staff",
  ),
  upload.single("file"),
  documentController.uploadDocument,
);

router.get(
  "/",
  authenticate,
  authorizeRoles(
    "admin",
    "pastor",
    "finance_officer",
    "welfare_officer",
    "staff",
  ),
  documentController.getDocuments,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles(
    "admin",
    "pastor",
    "finance_officer",
    "welfare_officer",
    "staff",
  ),
  documentController.getDocumentById,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  documentController.deleteDocument,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const documentRoutes = require("./routes/document.routes");
app.use("/api/v1/documents", documentRoutes);
```

**Git commands after completing Phase 3:**

```bash
git add src/middlewares/upload.js src/models/Document.js \
        src/services/document.service.js src/controllers/document.controller.js \
        src/routes/document.routes.js
git commit -m "feat(documents): add document upload, list, get, delete with Cloudinary integration"
git push origin feature/auth-document-upload
# Open Pull Request: feature/auth-document-upload → team-02-auth-rbac
# Request review from Auth Lead
```

**After PR is merged:**

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d feature/auth-document-upload
```

Auth Lead then opens a PR: `team-02-auth-rbac` → `develop`.

---

**Phase 3 Exit Criteria:**

- [ ] Document upload tested with JPEG, PNG, PDF — all succeed
- [ ] Invalid file type (e.g. .exe) returns 400
- [ ] File > 10MB returns 413
- [ ] Cloudinary `public_id` stored alongside URL in DB
- [ ] DELETE removes file from Cloudinary confirmed in Cloudinary dashboard
- [ ] Auth Lead has opened and merged PR: `team-02-auth-rbac` → `develop`

---

## Phase 4 — Audit Logging & Final Review (Days 17–19: May 21–24)

### STEP 1 — Branch Setup

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git checkout -b feature/auth-audit-logging
git push origin feature/auth-audit-logging
```

---

### T-AU-009 — Audit Log Middleware (Auth Dev 3)

Create `src/middlewares/auditLog.js`:

```js
const AuditLog = require("../models/AuditLog");

// Attach to sensitive POST/PUT/DELETE routes as middleware
const auditLog = (action, entity) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      // Only log if the request succeeded (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          await AuditLog.create({
            userId: req.user._id,
            action,
            entity,
            entityId: body?.data?._id || req.params?.id || null,
            changes: req.body,
            ip: req.ip,
            timestamp: new Date(),
          });
        } catch (err) {
          // Audit log failure must never break the main response
          console.error("AuditLog write failed:", err.message);
        }
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
```

**Usage example (for API teams to apply on sensitive routes):**

```js
const auditLog = require("../middlewares/auditLog");

// Apply on POST/PUT/DELETE routes that touch sensitive data
router.post(
  "/finance/contributions",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  auditLog("CREATE", "ServiceContribution"), // <-- add this
  contributionController.create,
);
```

---

### T-AU-010 — GET /audit Endpoint (Auth Dev 1)

Create `src/services/audit.service.js`:

```js
const AuditLog = require("../models/AuditLog");

const getAuditLogs = async ({
  page = 1,
  limit = 20,
  entity,
  action,
  userId,
}) => {
  const filter = {};
  if (entity) filter.entity = entity;
  if (action) filter.action = action;
  if (userId) filter.userId = userId;

  const skip = (page - 1) * limit;
  const total = await AuditLog.countDocuments(filter);
  const logs = await AuditLog.find(filter)
    .populate("userId", "firstName lastName email role")
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { total, page: Number(page), limit: Number(limit), data: logs };
};

module.exports = { getAuditLogs };
```

Create `src/controllers/audit.controller.js`:

```js
const auditService = require("../services/audit.service");

const getAuditLogs = async (req, res) => {
  try {
    const result = await auditService.getAuditLogs(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAuditLogs };
```

Create `src/routes/audit.routes.js`:

```js
const express = require("express");
const router = express.Router();

const auditController = require("../controllers/audit.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("super_admin"),
  auditController.getAuditLogs,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const auditRoutes = require("./routes/audit.routes");
app.use("/api/v1/audit", auditRoutes);
```

**Git commands after completing Phase 4:**

```bash
git add src/middlewares/auditLog.js \
        src/services/audit.service.js \
        src/controllers/audit.controller.js \
        src/routes/audit.routes.js
git commit -m "feat(audit): add audit log middleware and GET /audit endpoint (super_admin only)"
git push origin feature/auth-audit-logging
# Open Pull Request: feature/auth-audit-logging → team-02-auth-rbac
# Request review from Auth Lead
```

**After PR is merged:**

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git branch -d feature/auth-audit-logging
```

**Final auth review (Auth Dev 2):**

```bash
# End-to-end token flow test in Postman:
# 1. POST /auth/login → get accessToken (expires 15m) + refreshToken (expires 7d)
# 2. Use accessToken on a protected route → 200
# 3. POST /auth/refresh with refreshToken → get new accessToken
# 4. Confirm no token or password appears in any response body
```

Auth Lead then opens the final PR: `team-02-auth-rbac` → `develop`.

---

**Phase 4 Exit Criteria:**

- [ ] Audit logs firing on sensitive POST/PUT/DELETE routes — verified in DB
- [ ] GET /audit returns paginated results — super_admin only
- [ ] Non-super_admin call to GET /audit returns 403
- [ ] Token expiry + refresh flow confirmed end-to-end
- [ ] No password or token hash returned in any response
- [ ] Auth Lead has opened and merged PR: `team-02-auth-rbac` → `develop`

---

## Auth Standards (Your Non-Negotiables)

```js
// Route protection pattern — always in this order
router.get(
  "/resource",
  authenticate, // 1. verify token
  authorizeRoles("admin", "staff"), // 2. check role
  controller.getResource, // 3. handle request
);

// Never do this — will be rejected in PR review
router.get("/resource", (req, res) => {
  // No auth — instant PR rejection
});
```

- Access token: **15 minutes**. Refresh token: **7 days**. Non-negotiable.
- bcrypt salt rounds: **12 minimum**
- Never return `password`, token, or hash in any API response
- Rate limit is mandatory on `/auth/login`

---

## Escalation Path

1. Auth question from API team → Auth Dev answers directly
2. Role configuration dispute → Auth Lead decides; update RBAC matrix in Doc II if needed
3. Security concern found → Auth Lead escalates to general admin immediately — do not wait
4. Any fix to `team-02-auth-rbac` after it has merged to `develop` → Auth Lead escalates to general admin immediately

---

_ChMS Capstone Project | Team 02: Authentication & RBAC | Version 2.1 | May 2026_
