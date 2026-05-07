# ChMS Capstone Project

## Team Implementation Plan — DevOps & QA

### Extracted from Document VI: Master Implementation Plan

---

| Field      | Detail                                         |
| ---------- | ---------------------------------------------- |
| Team       | Team 06 — DevOps & QA                          |
| Members    | DevOps Dev 1, DevOps Dev 2, QA Dev 1, QA Dev 2 |
| Lead       | QA Lead                                        |
| Version    | 2.1                                            |
| Date       | May 5, 2026                                    |
| Submission | May 24, 2026                                   |

> This is your team's primary daily reference. It contains your phase-by-phase tasks, exit criteria, copy-paste implementation code, and exact git commands. For full system context refer to the master control documents (Doc I–VI).

---

## Branch Structure

This project uses a **3-tier branch model**. Understand this before writing a single line of code:

```
main                              ← General admin only. Final submission. Do not touch.
  └── develop                     ← QA Lead PRs here when a phase is complete and verified.
        └── team-06-devops-qa         ← Your team's working branch. All feature branches stem from here.
              └── feature/devops-repo-setup         ← T-DV-002 (DevOps Dev 1)
              └── feature/devops-express-app        ← T-DV-005 (DevOps Dev 2)
              └── feature/qa-auth-tests             ← T-QA-002 (QA Dev 2)
              └── feature/qa-postman-collection     ← T-QA-001 (QA Dev 1)
              └── feature/qa-postman-phase3         ← T-QA-003 (QA Dev 1)
              └── feature/devops-cleanup            ← T-DV-006 (DevOps Dev 1)
              └── feature/devops-readme             ← T-DV-007 (DevOps Dev 2)
```

**The rules:**

- Contributors **never** push directly to `develop` or `main`
- Contributors **never** branch off `develop` — always branch off `team-06-devops-qa`
- QA Lead reviews and merges all PRs into `team-06-devops-qa`
- QA Lead opens the PR from `team-06-devops-qa` → `develop` only when the phase is confirmed done and ready for integration

---

## Your Team's Scope

**You own:** Repository setup, Express app scaffolding, shared configuration, Postman test collection, integration tests, regression testing, README, and the final submission. You are the first team to act and the last team to finish.

---

## Phase 1 — Repo & App Setup (Days 1–3: May 5–7)

---

### T-DV-001 — GitHub Repo Setup (Admin + DevOps Dev 1)

> This is done once by Admin + DevOps Dev 1 before anyone else touches the repo.

**Steps on GitHub:**

```
1. Create new repository: chms-capstone (private)
2. Initialize with a README
3. Clone locally:
   git clone https://github.com/your-org/chms-capstone.git
   cd chms-capstone

4. Create develop branch:
   git checkout -b develop
   git push origin develop

5. Enable branch protection on GitHub (Settings → Branches → Add rule):
   - Branch name pattern: main
     ✓ Require a pull request before merging
     ✓ Require 1 approving review
     ✓ Do not allow bypassing the above settings
   - Branch name pattern: develop
     ✓ Require a pull request before merging
     ✓ Require 1 approving review
     ✓ Do not allow bypassing the above settings
   - Branch name pattern: team-*
     ✓ Require a pull request before merging
     ✓ Require 1 approving review
     ✓ Do not allow bypassing the above settings

6. Add all 20 developers as collaborators (Settings → Collaborators)

7. Share repo URL and confirm every developer has cloned it:
   git clone https://github.com/your-org/chms-capstone.git
```

---

### T-DV-002 — Folder Structure (DevOps Dev 1)

**Branch:** `feature/devops-repo-setup`

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/devops-repo-setup
git push origin feature/devops-repo-setup
```

Run this script to create the full folder structure in one go:

```bash
mkdir -p src/{config,middlewares,models,controllers,services,routes,utils,validators}
mkdir -p tests/{unit,integration}

# Create placeholder .gitkeep files so empty folders are tracked by git
touch src/config/.gitkeep
touch src/middlewares/.gitkeep
touch src/models/.gitkeep
touch src/controllers/.gitkeep
touch src/services/.gitkeep
touch src/routes/.gitkeep
touch src/utils/.gitkeep
touch src/validators/.gitkeep
touch tests/unit/.gitkeep
touch tests/integration/.gitkeep
```

Create `.gitignore`:

```
node_modules/
.env
dist/
coverage/
*.log
.DS_Store
```

Create `.env.example`:

```
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chms

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=10
```

Create `README.md` placeholder:

```md
# ChMS — Church Management System

> Capstone Project | Backend API | Node.js + Express + MongoDB

Full README coming in Phase 4 (T-DV-007).
```

Create `package.json` — run this to initialise and install all dependencies:

```bash
npm init -y

npm install express mongoose jsonwebtoken bcryptjs multer cloudinary \
            multer-storage-cloudinary streamifier joi express-rate-limit \
            cors dotenv morgan

npm install --save-dev jest supertest nodemon
```

Update `package.json` scripts section:

```json
"scripts": {
  "start":   "node src/server.js",
  "dev":     "nodemon src/server.js",
  "test":    "jest --runInBand --forceExit",
  "test:watch": "jest --watch"
}
```

**Git commands:**

```bash
git add .
git commit -m "feat(devops): scaffold folder structure, .gitignore, .env.example, package.json"
git push origin feature/devops-repo-setup
# Open Pull Request: feature/devops-repo-setup → team-06-devops-qa
```

---

### T-DV-005 — Express App Shell (DevOps Dev 2)

**Branch:** `feature/devops-express-app`

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/devops-express-app
git push origin feature/devops-express-app
```

Create `src/app.js`:

```js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ─── Core Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "ChMS API is running." });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
// Routes are mounted here as each team delivers their route files.
// Uncomment each line when the corresponding team's PR is merged to develop.

// const authRoutes         = require('./routes/auth.routes');
// const memberRoutes       = require('./routes/member.routes');
// const orgUnitRoutes      = require('./routes/orgUnit.routes');
// const fellowshipRoutes   = require('./routes/fellowship.routes');
// const staffRoutes        = require('./routes/staff.routes');
// const announcementRoutes = require('./routes/announcement.routes');
// const missionRoutes      = require('./routes/mission.routes');
// const financeRoutes      = require('./routes/finance.routes');
// const eventRoutes        = require('./routes/event.routes');
// const reportRoutes       = require('./routes/report.routes');
// const inventoryRoutes    = require('./routes/inventory.routes');
// const vendorRoutes       = require('./routes/vendor.routes');
// const welfareRoutes      = require('./routes/welfare.routes');
// const programRoutes      = require('./routes/program.routes');
// const mediaRoutes        = require('./routes/media.routes');
// const documentRoutes     = require('./routes/document.routes');
// const auditRoutes        = require('./routes/audit.routes');

// app.use('/api/v1/auth',          authRoutes);
// app.use('/api/v1/members',       memberRoutes);
// app.use('/api/v1/org-units',     orgUnitRoutes);
// app.use('/api/v1/fellowships',   fellowshipRoutes);
// app.use('/api/v1/staff',         staffRoutes);
// app.use('/api/v1/announcements', announcementRoutes);
// app.use('/api/v1/missions',      missionRoutes);
// app.use('/api/v1/finance',       financeRoutes);
// app.use('/api/v1/events',        eventRoutes);
// app.use('/api/v1/reports',       reportRoutes);
// app.use('/api/v1/inventory',     inventoryRoutes);
// app.use('/api/v1/vendors',       vendorRoutes);
// app.use('/api/v1/welfare',       welfareRoutes);
// app.use('/api/v1/programs',      programRoutes);
// app.use('/api/v1/media',         mediaRoutes);
// app.use('/api/v1/documents',     documentRoutes);
// app.use('/api/v1/audit',         auditRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, error: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error."
      : err.message;
  res.status(statusCode).json({ success: false, error: message });
});

module.exports = app;
```

Create `src/server.js`:

```js
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
};

startServer();
```

**Verify the app boots:**

```bash
# Copy .env.example to .env and fill in your real values first
cp .env.example .env

# Start the server
npm run dev

# Expected output:
# MongoDB Connected: cluster.mongodb.net
# Server running on port 5000 in development mode

# Test health endpoint
curl http://localhost:5000/health
# Expected: {"success":true,"message":"ChMS API is running."}
```

**Git commands:**

```bash
git add src/app.js src/server.js
git commit -m "feat(devops): add Express app shell with middleware, health check, global error handler"
git push origin feature/devops-express-app
# Open Pull Request: feature/devops-express-app → team-06-devops-qa
```

**After every PR is approved and merged:**

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git branch -d feature/devops-repo-setup    # replace with your branch name
```

---

### T-QA-002 — Auth Integration Tests (QA Dev 2)

**Branch:** `feature/qa-auth-tests`

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/qa-auth-tests
git push origin feature/qa-auth-tests
```

Create `jest.config.js` in the root:

```js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js"],
};
```

Create `tests/integration/auth.test.js`:

```js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");
const bcrypt = require("bcryptjs");

// Use a separate test DB — set TEST_MONGO_URI in .env
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI || process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

// ── Helper: create a super_admin user directly in DB ──────────────────────
const createAdminUser = async () => {
  const hashed = await bcrypt.hash("Admin@1234", 12);
  return User.create({
    firstName: "Super",
    lastName: "Admin",
    email: "admin@chms.test",
    password: hashed,
    role: "super_admin",
  });
};

// ── Helper: login and get token ────────────────────────────────────────────
const loginAs = async (email, password) => {
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });
  return res.body.data?.accessToken;
};

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /api/v1/auth/register", () => {
  it("should return 403 for a non-admin token", async () => {
    // Create a staff user
    const hashed = await bcrypt.hash("Staff@1234", 12);
    await User.create({
      firstName: "Staff",
      lastName: "User",
      email: "staff@chms.test",
      password: hashed,
      role: "staff",
    });
    const token = await loginAs("staff@chms.test", "Staff@1234");

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "New",
        lastName: "Pastor",
        email: "pastor@chms.test",
        password: "Pastor@1234",
        role: "pastor",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 when no token is provided", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      firstName: "New",
      lastName: "User",
      email: "new@chms.test",
      password: "Pass@1234",
      role: "staff",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should create a user when called by admin", async () => {
    await createAdminUser();
    const token = await loginAs("admin@chms.test", "Admin@1234");

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Finance",
        lastName: "Officer",
        email: "finance@chms.test",
        password: "Finance@1234",
        role: "finance_officer",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("finance@chms.test");
    expect(res.body.data.password).toBeUndefined(); // password never returned
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /api/v1/auth/login", () => {
  it("should return access and refresh tokens on valid credentials", async () => {
    await createAdminUser();

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@chms.test", password: "Admin@1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("should return 401 on invalid password", async () => {
    await createAdminUser();

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@chms.test", password: "WrongPassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 on unknown email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@chms.test", password: "Any@1234" });

    expect(res.statusCode).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Protected route — authenticate middleware", () => {
  it("should return 401 with no token", async () => {
    const res = await request(app).get("/api/v1/members");
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 with a malformed token", async () => {
    const res = await request(app)
      .get("/api/v1/members")
      .set("Authorization", "Bearer this.is.not.a.real.token");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 with a valid token", async () => {
    await createAdminUser();
    const token = await loginAs("admin@chms.test", "Admin@1234");

    const res = await request(app)
      .get("/api/v1/members")
      .set("Authorization", `Bearer ${token}`);

    // 200 means auth passed (members list returns empty array for new DB — that is fine)
    expect(res.statusCode).toBe(200);
  });
});
```

Add `TEST_MONGO_URI` to `.env.example`:

```
# Test Database (separate from dev — recommended)
TEST_MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chms_test
```

**Run the tests to confirm they pass:**

```bash
npm test
# Expected: all tests pass (PASS tests/integration/auth.test.js)
```

**Git commands:**

```bash
git add jest.config.js tests/integration/auth.test.js
git commit -m "test(auth): add integration tests for register, login, and protected route middleware"
git push origin feature/qa-auth-tests
# Open Pull Request: feature/qa-auth-tests → team-06-devops-qa
```

**After PR is merged:**

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git branch -d feature/qa-auth-tests
```

---

**Phase 1 Exit Criteria:**

- [ ] GitHub repo live — all 20 developers have cloned it and confirmed access
- [ ] Branch protection on `main` and `develop` — no direct push allowed
- [ ] Folder structure merged to `team-06-devops-qa` — every developer pulls it on Day 1
- [ ] `npm run dev` → server boots with no errors
- [ ] `GET /health` returns `200 OK` — confirmed in browser and Postman
- [ ] `npm test` → all auth integration tests pass

---

## Phase 2 — Integration Testing (Days 4–10: May 8–14)

### STEP 1 — Branch Setup

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/qa-postman-collection
git push origin feature/qa-postman-collection
```

---

### T-QA-001 — Shared Postman Collection (QA Dev 1)

**Branch:** `feature/qa-postman-collection`

Build the Postman collection with the structure below. Export as JSON and commit to the repo.

**Collection structure:**

```
ChMS API v1
├── 🔐 Auth
│   ├── POST Login                    → /api/v1/auth/login
│   ├── POST Register (admin only)    → /api/v1/auth/register
│   ├── POST Refresh Token            → /api/v1/auth/refresh
│   ├── POST Logout                   → /api/v1/auth/logout
│   └── POST Change Password          → /api/v1/auth/change-password
├── 👥 Members
│   ├── GET  All Members              → /api/v1/members?page=1&limit=20
│   ├── POST Create Member            → /api/v1/members
│   ├── GET  Member by ID             → /api/v1/members/:id
│   ├── PUT  Update Member            → /api/v1/members/:id
│   ├── DEL  Delete Member            → /api/v1/members/:id
│   └── GET  Member Attendance        → /api/v1/members/:id/attendance
├── 🏢 Org Units
│   ├── GET  All Org Units            → /api/v1/org-units
│   ├── POST Create Org Unit          → /api/v1/org-units
│   ├── GET  Org Unit by ID           → /api/v1/org-units/:id
│   ├── PUT  Update Org Unit          → /api/v1/org-units/:id
│   ├── DEL  Delete Org Unit          → /api/v1/org-units/:id
│   └── POST Assign Leader            → /api/v1/org-units/:id/assign-leader
├── ⛪ Fellowships
│   ├── GET  All Fellowships          → /api/v1/fellowships
│   ├── POST Create Fellowship        → /api/v1/fellowships
│   ├── GET  Fellowship by ID         → /api/v1/fellowships/:id
│   ├── PUT  Update Fellowship        → /api/v1/fellowships/:id
│   ├── DEL  Delete Fellowship        → /api/v1/fellowships/:id
│   └── GET  Fellowship Members       → /api/v1/fellowships/:id/members
├── 👔 Staff
│   ├── GET  All Staff                → /api/v1/staff
│   ├── POST Create Staff             → /api/v1/staff
│   ├── GET  Staff by ID              → /api/v1/staff/:id
│   ├── PUT  Update Staff             → /api/v1/staff/:id
│   └── DEL  Delete Staff             → /api/v1/staff/:id
├── 💰 Finance
│   ├── POST Record Contribution      → /api/v1/finance/contributions
│   ├── GET  List Contributions       → /api/v1/finance/contributions
│   ├── POST Log Expense              → /api/v1/finance/expenses
│   ├── GET  List Expenses            → /api/v1/finance/expenses
│   └── GET  Finance Summary          → /api/v1/finance/summary
├── 📅 Events
│   ├── GET  All Events               → /api/v1/events?from=&to=
│   ├── POST Create Event             → /api/v1/events
│   ├── GET  Event by ID              → /api/v1/events/:id
│   ├── PUT  Update Event             → /api/v1/events/:id
│   ├── DEL  Delete Event             → /api/v1/events/:id
│   ├── POST Record Attendance        → /api/v1/events/:id/attendance
│   └── GET  Event Attendance         → /api/v1/events/:id/attendance
├── 📦 Inventory
│   ├── GET  All Inventory            → /api/v1/inventory
│   ├── POST Create Item              → /api/v1/inventory
│   ├── GET  Item by ID               → /api/v1/inventory/:id
│   ├── PUT  Update Item              → /api/v1/inventory/:id
│   ├── DEL  Delete Item              → /api/v1/inventory/:id
│   └── PUT  Link Expense             → /api/v1/inventory/:id/link-expense
├── 🏪 Vendors
│   ├── GET  All Vendors              → /api/v1/vendors
│   ├── POST Create Vendor            → /api/v1/vendors
│   ├── GET  Vendor by ID             → /api/v1/vendors/:id
│   ├── PUT  Update Vendor            → /api/v1/vendors/:id
│   └── DEL  Delete Vendor            → /api/v1/vendors/:id
└── ❤️ Welfare
    ├── GET  All Cases                → /api/v1/welfare
    ├── POST Create Case              → /api/v1/welfare
    ├── GET  Case by ID               → /api/v1/welfare/:id
    ├── PUT  Update Case              → /api/v1/welfare/:id
    ├── POST Add Support Log          → /api/v1/welfare/:id/support-log
    └── GET  Support Log              → /api/v1/welfare/:id/support-log
```

**Postman environment variables to set up:**

```
BASE_URL     = http://localhost:5000/api/v1
ACCESS_TOKEN = (set after login — use "Tests" tab on Login to auto-set)
MEMBER_ID    = (set after creating a member)
EVENT_ID     = (set after creating an event)
```

**Auto-capture token — add this to the Login request "Tests" tab:**

```js
if (pm.response.code === 200) {
  const json = pm.response.json();
  pm.environment.set("ACCESS_TOKEN", json.data.accessToken);
  pm.environment.set("REFRESH_TOKEN", json.data.refreshToken);
}
```

**Add this pre-request script to the collection root (auto-injects auth header):**

```js
pm.request.headers.add({
  key: "Authorization",
  value: "Bearer " + pm.environment.get("ACCESS_TOKEN"),
});
```

**Export and commit the collection:**

```bash
# Export from Postman as: postman/ChMS_API_v1.postman_collection.json
mkdir -p postman
# Copy the exported file into postman/
git add postman/
git commit -m "test(qa): add Postman collection with all Phase 2 endpoints and env setup"
git push origin feature/qa-postman-collection
# Open Pull Request: feature/qa-postman-collection → team-06-devops-qa
```

---

### T-AD-001 — Phase 2 Integration Checkpoint (Day 10)

> Admin + QA Dev 1 run this together on Day 10.

```bash
# 1. Review all open PRs from Teams 3, 4, 5 — approve and merge to develop
# 2. Pull latest develop
git checkout develop
git pull origin develop

# 3. Start the server
npm run dev

# 4. Run the full Postman collection in Newman (CLI runner)
npm install -g newman
newman run postman/ChMS_API_v1.postman_collection.json \
  --environment postman/dev.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export postman/phase2-checkpoint-report.json

# 5. Commit the report
git add postman/phase2-checkpoint-report.json
git commit -m "test(qa): Phase 2 integration checkpoint report"
git push origin develop   # Admin can push directly if develop has no protection on admin
```

---

**Phase 2 Exit Criteria:**

- [ ] Postman collection covers all Phase 2 endpoints — shared with all teams via repo
- [ ] Auto-token capture works — login once, all subsequent requests authenticated
- [ ] Integration checkpoint completed — all approved Phase 2 PRs in develop
- [ ] Test failures documented and assigned back to relevant teams

---

## Phase 3 — Phase 3 Testing (Days 15–16: May 19–20)

### STEP 1 — Branch Setup

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/qa-postman-phase3
git push origin feature/qa-postman-phase3
```

### T-QA-003 — Extend Postman Collection (QA Dev 1)

Add these folders to the existing Postman collection:

```
ChMS API v1
├── 📢 Announcements
│   ├── GET  All Announcements        → /api/v1/announcements
│   ├── POST Create Announcement      → /api/v1/announcements
│   ├── GET  Announcement by ID       → /api/v1/announcements/:id
│   ├── PUT  Update Announcement      → /api/v1/announcements/:id
│   └── DEL  Delete Announcement      → /api/v1/announcements/:id
├── 🌍 Missions
│   ├── GET  All Missions             → /api/v1/missions
│   ├── POST Create Mission           → /api/v1/missions
│   ├── GET  Mission by ID            → /api/v1/missions/:id
│   ├── PUT  Update Mission           → /api/v1/missions/:id
│   ├── POST Add Volunteer            → /api/v1/missions/:id/volunteers
│   └── GET  Mission Volunteers       → /api/v1/missions/:id/volunteers
├── 📊 Reports
│   ├── GET  Attendance Report        → /api/v1/reports/attendance?from=&to=
│   ├── GET  Finance Report           → /api/v1/reports/finance?period=monthly
│   └── GET  Programs Report          → /api/v1/reports/programs
├── 🎓 Programs
│   ├── GET  All Programs             → /api/v1/programs
│   ├── POST Create Program           → /api/v1/programs
│   ├── GET  Program by ID            → /api/v1/programs/:id
│   ├── PUT  Update Program           → /api/v1/programs/:id
│   ├── DEL  Delete Program           → /api/v1/programs/:id
│   ├── POST Add Session              → /api/v1/programs/:id/sessions
│   ├── POST Enroll Member            → /api/v1/programs/:id/enroll
│   └── GET  Participants             → /api/v1/programs/:id/participants
├── 📁 Documents
│   ├── POST Upload Document          → /api/v1/documents
│   ├── GET  All Documents            → /api/v1/documents?entityType=&entityId=
│   ├── GET  Document by ID           → /api/v1/documents/:id
│   └── DEL  Delete Document          → /api/v1/documents/:id
├── 🎵 Media
│   ├── GET  All Media                → /api/v1/media
│   ├── POST Create Media Entry       → /api/v1/media
│   ├── GET  Media by ID              → /api/v1/media/:id
│   ├── PUT  Update Media             → /api/v1/media/:id
│   ├── DEL  Delete Media             → /api/v1/media/:id
│   └── POST Upload Media File        → /api/v1/media/:id/upload
└── 🔍 Audit
    └── GET  Audit Logs               → /api/v1/audit?page=1&limit=20
```

**Auth guard test cases to add for EVERY new endpoint:**

For each new route, add a second request with `Authorization` header removed:

- Expected: `401 Unauthorized`

For role-restricted routes, add a request with a lower-privilege token:

- Expected: `403 Forbidden`

**Export updated collection and commit:**

```bash
# Re-export from Postman and replace the existing file
git add postman/ChMS_API_v1.postman_collection.json
git commit -m "test(qa): extend Postman collection to cover all Phase 3 endpoints"
git push origin feature/qa-postman-phase3
# Open Pull Request: feature/qa-postman-phase3 → team-06-devops-qa
```

**After PR is merged:**

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git branch -d feature/qa-postman-phase3
```

---

**Phase 3 Exit Criteria:**

- [ ] All Phase 3 endpoints tested — pass/fail noted per endpoint
- [ ] Auth guards verified on all new routes — 401 and 403 cases confirmed
- [ ] Phase 3 test report shared with all team leads listing any failures

**Phase 3 test report format:**

```
ChMS QA Report — Phase 3 — [Date]
Tester: [Name]
Branch: develop

PASSED: XX endpoints
FAILED: XX endpoints

FAILURES:
- [Method] [Endpoint] — Expected: [status] | Got: [status] | Assigned to: [Team/Dev]

NOTES:
- [Any general observations]
```

---

## Phase 4 — Final QA & Submission (Days 17–19: May 21–24)

---

### T-QA-004 — Full Regression Test (QA Dev 1 + QA Dev 2)

```bash
git checkout develop
git pull origin develop

# Run full Postman collection via Newman
newman run postman/ChMS_API_v1.postman_collection.json \
  --environment postman/dev.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export postman/regression-report-final.json

# Review output — every endpoint must pass
# Assign any failures to the relevant team lead for same-day fix
```

---

### T-DV-006 — Remove console.log (DevOps Dev 1)

**Branch:** `feature/devops-cleanup`

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/devops-cleanup
git push origin feature/devops-cleanup
```

Find all `console.log` in production paths:

```bash
# Search entire src/ for console.log
grep -rn "console.log" src/

# For each hit that is NOT inside a catch block or startup message:
# Remove or replace with a proper logger
# Example — replace:
console.log('User created:', user);
# With: nothing — controllers/services should not log to console
```

Verify the global error handler does not leak stack traces in production:

```js
// In src/app.js — confirm this pattern is in place:
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error." // stack trace hidden in production
      : err.message; // full message shown in development
  res.status(statusCode).json({ success: false, error: message });
});
```

```bash
git add src/
git commit -m "chore(cleanup): remove console.log from production paths"
git push origin feature/devops-cleanup
# Open Pull Request: feature/devops-cleanup → team-06-devops-qa
```

---

### T-DV-007 — Final README (DevOps Dev 2)

**Branch:** `feature/devops-readme`

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/devops-readme
git push origin feature/devops-readme
```

Create the final `README.md`:

````md
# ChMS — Church Management System API

> Capstone Project | Backend REST API | Node.js · Express · MongoDB Atlas · Cloudinary

---

## Overview

ChMS is a backend REST API for managing church operations including membership,
attendance, finance, welfare, programs, media, and organisational structure.

---

## Prerequisites

| Requirement   | Version                   |
| ------------- | ------------------------- |
| Node.js       | v20 LTS                   |
| npm           | v10+                      |
| MongoDB Atlas | Account + cluster         |
| Cloudinary    | Account + API credentials |

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/chms-capstone.git
cd chms-capstone

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your real values
```
````

---

## Environment Setup

Copy `.env.example` to `.env` and fill in the following:

| Variable                | Description                       |
| ----------------------- | --------------------------------- |
| `PORT`                  | Server port (default: 5000)       |
| `MONGO_URI`             | MongoDB Atlas connection string   |
| `JWT_ACCESS_SECRET`     | Secret for signing access tokens  |
| `JWT_REFRESH_SECRET`    | Secret for signing refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name             |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret             |

---

## Running the Server

```bash
# Development (auto-restart on file change)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`
Health check: `GET http://localhost:5000/health`

---

## Running Tests

```bash
npm test
```

---

## API Quick Reference

| Method | Endpoint                        | Description                             |
| ------ | ------------------------------- | --------------------------------------- |
| POST   | `/api/v1/auth/login`            | Login — returns access + refresh tokens |
| POST   | `/api/v1/auth/register`         | Create user (admin only)                |
| GET    | `/api/v1/members`               | List members (paginated)                |
| POST   | `/api/v1/members`               | Create member                           |
| GET    | `/api/v1/events`                | List events                             |
| POST   | `/api/v1/events/:id/attendance` | Record attendance                       |
| POST   | `/api/v1/finance/contributions` | Record contribution                     |
| GET    | `/api/v1/finance/summary`       | Income vs expense summary               |
| GET    | `/api/v1/reports/attendance`    | Attendance report                       |
| GET    | `/api/v1/reports/finance`       | Finance report                          |
| POST   | `/api/v1/welfare`               | Create welfare case                     |
| POST   | `/api/v1/programs/:id/enroll`   | Enroll member in program                |
| POST   | `/api/v1/media/:id/upload`      | Upload media file                       |
| GET    | `/api/v1/audit`                 | Audit logs (super_admin only)           |

> Full endpoint list and request/response shapes are in the Postman collection:
> `postman/ChMS_API_v1.postman_collection.json`

---

## Architecture

```
Client
  └── Express Router
        └── Middleware (Auth, RBAC, Validation, Upload)
              └── Controller (HTTP in/out — thin)
                    └── Service (all business logic)
                          └── Model (Mongoose schema + DB)
                                └── MongoDB Atlas
```

---

## Team

Built by 20 backend developers as a capstone project — May 2026.

````

```bash
git add README.md
git commit -m "docs: add final README with setup, env, run, test, and API reference"
git push origin feature/devops-readme
# Open Pull Request: feature/devops-readme → team-06-devops-qa
````

---

### T-AD-002 — Final Admin Review

```bash
# Admin reviews all remaining open PRs
# Merges all approved PRs to develop
# Resolves any merge conflicts

git checkout develop
git pull origin develop

# Confirm develop is clean — server boots, no errors
npm run dev

# Run full regression one final time
newman run postman/ChMS_API_v1.postman_collection.json \
  --environment postman/dev.postman_environment.json
```

---

### T-AD-003 — Merge develop → main and Tag Release

```bash
# Create PR: develop → main on GitHub
# Title: "release: v1.0 — ChMS Capstone Submission"
# Admin reviews and approves

# After merge, tag the release:
git checkout main
git pull origin main
git tag -a v1.0 -m "ChMS Capstone Project v1.0 — May 2026"
git push origin v1.0

# Confirm tag on GitHub: Releases → Tags → v1.0 visible
```

---

### T-AD-004 — Submit

```bash
# Copy the repo URL from GitHub:
# https://github.com/your-org/chms-capstone

# Submit this URL to the supervisor / capstone platform
# Confirm submission received — screenshot the confirmation
```

---

**Phase 4 Exit Criteria:**

- [ ] Zero failing tests in final regression run
- [ ] No `console.log` in codebase — confirmed by `grep -rn "console.log" src/`
- [ ] README fully complete — a new developer can clone, set up, and run from it alone
- [ ] `develop` merged to `main`, tagged `v1.0`
- [ ] Submission confirmed and receipt saved

---

## Regression Test Report Template

Use this format after T-QA-003 and T-QA-004:

```
ChMS QA Report — [Date]
Tester: [Name]
Branch: develop

PASSED: XX endpoints
FAILED: XX endpoints

FAILURES:
- [Method] [Endpoint] — Expected: [status] | Got: [status] | Assigned to: [Team/Dev]

NOTES:
- [Any general observations]
```

---

## Escalation Path

1. Test failure → assign to relevant team lead with written report
2. Repo/branch issue → QA Lead → Admin immediately
3. Submission platform issue → Admin → Academic supervisor

---

_ChMS Capstone Project | Team 06: DevOps & QA | Version 2.1 | May 2026_
