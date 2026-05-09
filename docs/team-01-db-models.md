# ChMS Capstone Project

## Team Implementation Plan — Database & Models

### Extracted from Document VI: Master Implementation Plan

---

| Field      | Detail                                 |
| ---------- | -------------------------------------- |
| Team       | Team 01 — Database & Models            |
| Members    | DB Dev 1, DB Dev 2, DB Dev 3, DB Dev 4 |
| Lead       | DB Lead                                |
| Version    | 2.1                                    |
| Date       | May 5, 2026                            |
| Submission | May 24, 2026                           |

> This is your team's primary daily reference. It contains your phase-by-phase tasks, exit criteria, copy-paste implementation code, and exact git commands. For full system context refer to the master control documents (Doc I–VI).

---

## Branch Structure

This project uses a **3-tier branch model**. Understand this before writing a single line of code:

```
main                        ← General admin only. Final submission. Do not touch.
  └── develop               ← DB Lead PRs here when a phase is complete and verified.
        └── team-01-db-models  ← Your team's working branch. All feature branches stem from here.
              └── feature/db-config-mongodb      ← DB Dev 1 works here
              └── feature/db-config-cloudinary   ← DB Dev 2 works here
              └── feature/db-schemas-user-member ← DB Dev 3 works here
              └── feature/db-schemas-finance     ← DB Dev 4 works here
```

**The rules:**

- Contributors **never** push directly to `develop` or `main`
- Contributors **never** branch off `develop` — always branch off `team-01-db-models`
- DB Lead reviews and merges all PRs into `team-01-db-models`
- DB Lead opens the PR from `team-01-db-models` → `develop` only when the phase is confirmed done and ready for integration

---

## Your Team's Scope

**You own:** All Mongoose schemas, database connection, Cloudinary config, indexes, and relationships. Every other team depends on your Phase 1 output. Nothing moves until schemas are merged.

---

## Phase 1 — Foundation (Days 1–3: May 5–7)

> **Your most critical phase. All 17 schemas must be merged to `team-01-db-models` by end of Day 2, then DB Lead PRs to `develop`.**

---

### STEP 1 — Get Latest Team Branch and Create Your Feature Branch

Every developer runs this before writing a single line of code:

```bash
git checkout team-01-db-models
git pull origin team-01-db-models
git checkout -b feature/db-config-mongodb       # DB Dev 1
# OR
git checkout -b feature/db-config-cloudinary    # DB Dev 2
# OR
git checkout -b feature/db-schemas-user-member  # DB Dev 3
# OR
git checkout -b feature/db-schemas-finance      # DB Dev 4

# Immediately push your branch to remote so it's visible to the team
git push origin feature/db-config-mongodb       # replace with your branch name
```

---

### T-DV-003 — MongoDB Atlas Connection (DB Dev 1)

**Branch:** `feature/db-config-mongodb`

Create `src/config/db.js`:

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected.");
});

module.exports = connectDB;
```

Call it in `src/server.js` (coordinate with Team 6):

```js
const connectDB = require("./config/db");
connectDB();
```

**Git commands after completing this task:**

```bash
git add src/config/db.js
git commit -m "feat(config): add MongoDB Atlas connection with reconnect logic"
git push origin feature/db-config-mongodb
# Then open a Pull Request: feature/db-config-mongodb → team-01-db-models
# Request review from DB Lead
```

---

### T-DV-004 — Cloudinary Config & Upload Utility (DB Dev 2)

**Branch:** `feature/db-config-cloudinary`

Create `src/config/cloudinary.js`:

```js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

Create `src/utils/uploadToCloud.js`:

```js
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloud = (fileBuffer, folder = "chms", resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = uploadToCloud;
```

**Git commands after completing this task:**

```bash
git add src/config/cloudinary.js src/utils/uploadToCloud.js
git commit -m "feat(config): add Cloudinary config and uploadToCloud utility"
git push origin feature/db-config-cloudinary
# Then open a Pull Request: feature/db-config-cloudinary → team-01-db-models
# Request review from DB Lead
```

---

### T-DB-001 — User Schema (DB Dev 1)

**Branch:** `feature/db-schemas-user-member`

Create `src/models/User.js`:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: [
        "super_admin",
        "admin",
        "pastor",
        "finance_officer",
        "welfare_officer",
        "staff",
        "volunteer",
      ],
      required: [true, "Role is required"],
    },
    phone: { type: String, trim: true },
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
```

---

### T-DB-002 — Member Schema (DB Dev 2)

Create `src/models/Member.js`:

```js
const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true, // allows multiple null values but enforces unique on non-null
      unique: true,
    },
    phone: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true },
    memberStatus: {
      type: String,
      enum: ["active", "inactive", "visitor", "transferred"],
      default: "visitor",
    },
    fellowshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fellowship",
      index: true,
    },
    joinDate: { type: Date, default: Date.now },
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Member", memberSchema);
```

---

### T-DB-003 — OrganizationalUnit Schema (DB Dev 3)

**Branch:** `feature/db-schemas-org-events`

Create `src/models/OrganizationalUnit.js`:

```js
const mongoose = require("mongoose");

const orgUnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Unit name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["zone", "area", "district", "region"],
      required: [true, "Unit type is required"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationalUnit",
      default: null,
      index: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OrganizationalUnit", orgUnitSchema);
```

---

### T-DB-004 — Fellowship Schema (DB Dev 4)

**Branch:** `feature/db-schemas-finance`

Create `src/models/Fellowship.js`:

```js
const mongoose = require("mongoose");

const fellowshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Fellowship name is required"],
      trim: true,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationalUnit",
      index: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      index: true,
    },
    meetingDay: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    meetingTime: { type: String, trim: true },
    location: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Fellowship", fellowshipSchema);
```

---

### T-DB-005 — Staff Schema (DB Dev 1)

Create `src/models/Staff.js`:

```js
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    department: { type: String, trim: true },
    isVolunteer: { type: Boolean, default: false },
    hireDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Staff", staffSchema);
```

---

### T-DB-006 — Event Schema (DB Dev 2)

Create `src/models/Event.js`:

```js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["service", "ceremony", "special", "fellowship"],
      required: [true, "Event type is required"],
    },
    description: { type: String, trim: true },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
```

---

### T-DB-007 — Attendance Schema (DB Dev 3)

Create `src/models/Attendance.js`:

```js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
      index: true,
    },
    checkedInAt: { type: Date, default: Date.now },
    method: {
      type: String,
      enum: ["manual", "qr"],
      default: "manual",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

// Compound unique index — prevents duplicate check-in
attendanceSchema.index({ eventId: 1, memberId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
```

---

### T-DB-008 — ServiceContribution Schema (DB Dev 4)

Create `src/models/ServiceContribution.js`:

```js
// IMPORTANT: This schema tracks SERVICE TOTALS only — no memberId field
const mongoose = require("mongoose");

const serviceContributionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      enum: ["tithe", "offering", "donation", "special"],
      required: [true, "Category is required"],
    },
    channel: {
      type: String,
      enum: ["cash", "transfer", "pos", "online"],
      required: [true, "Channel is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: { type: String, default: "NGN" },
    notes: { type: String, trim: true },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "ServiceContribution",
  serviceContributionSchema,
);
```

---

### T-DB-009 — Expense Schema (DB Dev 1)

Create `src/models/Expense.js`:

```js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "operations",
        "welfare",
        "missions",
        "programs",
        "maintenance",
        "other",
      ],
      required: [true, "Category is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: { type: String, default: "NGN" },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      index: true,
    },
    receiptUrl: { type: String },
    public_id: { type: String },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
```

---

### T-DB-010 — InventoryItem & Vendor Schemas (DB Dev 2)

Create `src/models/Vendor.js`:

```js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
    },
    contactPerson: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    category: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Vendor", vendorSchema);
```

Create `src/models/InventoryItem.js`:

```js
const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: { type: String, trim: true },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unitCost: {
      type: Number,
      min: [0, "Unit cost cannot be negative"],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      index: true,
    },
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
```

---

### T-DB-011 — WelfareCase Schema (DB Dev 3)

Create `src/models/WelfareCase.js`:

```js
const mongoose = require("mongoose");

const supportLogSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    amount: { type: Number, min: 0 },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { _id: true },
);

const welfareCaseSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Case type is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    supportLog: [supportLogSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WelfareCase", welfareCaseSchema);
```

---

### T-DB-012 — Program Schema (DB Dev 4)

Create `src/models/Program.js`:

```js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionNumber: { type: Number, required: true },
    title: { type: String, trim: true },
    date: { type: Date },
    facilitator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { _id: true },
);

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Program title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["empowerment", "pre_marital", "parental", "missions", "other"],
      required: [true, "Program type is required"],
    },
    description: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    sessions: [sessionSchema],
    coordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    maxParticipants: { type: Number, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Program", programSchema);
```

---

### T-DB-013 — ProgramEnrollment Schema (DB Dev 1)

Create `src/models/ProgramEnrollment.js`:

```js
const mongoose = require("mongoose");

const programEnrollmentSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: [true, "Program ID is required"],
      index: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member ID is required"],
      index: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["enrolled", "completed", "dropped"],
      default: "enrolled",
    },
    outcomes: { type: String, trim: true },
  },
  { timestamps: true },
);

// Prevent duplicate enrollment
programEnrollmentSchema.index({ programId: 1, memberId: 1 }, { unique: true });

module.exports = mongoose.model("ProgramEnrollment", programEnrollmentSchema);
```

---

### T-DB-014 — Announcement Schema (DB Dev 2)

Create `src/models/Announcement.js`:

```js
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      trim: true,
    },
    audience: {
      type: String,
      enum: ["all", "zone", "fellowship", "staff"],
      default: "all",
    },
    publishedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Announcement", announcementSchema);
```

---

### T-DB-015 — MediaResource Schema (DB Dev 3)

Create `src/models/MediaResource.js`:

```js
const mongoose = require("mongoose");

const mediaResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["book", "audio", "digital", "video"],
      required: [true, "Type is required"],
    },
    fileUrl: { type: String },
    public_id: { type: String },
    price: { type: Number, min: 0 },
    quantity: { type: Number, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MediaResource", mediaResourceSchema);
```

---

### T-DB-016 — Mission Schema (DB Dev 4)

Create `src/models/Mission.js`:

```js
const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    location: { type: String, trim: true },
    budget: { type: Number, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["planned", "active", "completed", "cancelled"],
      default: "planned",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Mission", missionSchema);
```

---

### T-DB-017 — AuditLog Schema (DB Dev 1)

Create `src/models/AuditLog.js`:

```js
const mongoose = require("mongoose");

// Note: No timestamps: true plugin — uses manual timestamp field
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  action: {
    type: String,
    required: [true, "Action is required"],
    enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"],
  },
  entity: {
    type: String,
    required: [true, "Entity name is required"],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  changes: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
```

---

### STEP 2 — Commit Your Work and Open a PR to the Team Branch

After completing your assigned schemas:

```bash
# Add your files
git add src/models/
git add src/config/   # if you worked on config files

# Commit with a clear message
git commit -m "feat(models): add [describe your schemas] schemas with indexes and enums"

# Push to your feature branch
git push origin feature/db-schemas-user-member   # replace with your branch name

# Then go to GitHub and open a Pull Request:
# feature/your-branch → team-01-db-models        ← NOT develop
# Title: "feat(models): [describe schemas in this PR]"
# Request review from DB Lead
```

> **Important:** Your PR target is `team-01-db-models`, not `develop`. DB Lead will handle the PR to `develop` once all schemas are verified.

---

### STEP 3 — After Your PR is Approved and Merged

```bash
# Switch back to the team branch and pull the merged changes
git checkout team-01-db-models
git pull origin team-01-db-models

# Delete your local feature branch (clean up)
git branch -d feature/db-schemas-user-member   # replace with your branch name

# Your remote branch was deleted by DB Lead on merge — no action needed there
```

---

### STEP 4 — DB Lead: PR Team Branch to Develop

> **This step is for DB Lead only.** Run this only when all Phase 1 tasks are confirmed complete and tested locally.

```bash
git checkout team-01-db-models
git pull origin team-01-db-models

# Go to GitHub and open a Pull Request:
# team-01-db-models → develop
# Title: "feat(db): merge all Phase 1 schemas and config — Team 01"
# Describe what is included and confirm exit criteria are met
```

The general admin or a peer lead will review and approve this PR before it merges into `develop`.

---

**Phase 1 Exit Criteria:**

- [ ] MongoDB Atlas connection tested and working locally for all devs
- [ ] Cloudinary uploadToCloud utility tested with a sample file
- [ ] All 17 schemas committed to feature branches and merged to `team-01-db-models` via PRs
- [ ] Every schema has `timestamps: true` (except AuditLog which uses manual timestamp)
- [ ] Compound unique index on Attendance confirmed in DB
- [ ] DB Lead has opened and merged PR: `team-01-db-models` → `develop`

---

## Phase 2 — Support (Days 4–10: May 8–14)

> No new schemas expected. Your role is DB support for API teams.

**If a schema fix is needed:**

```bash
git checkout team-01-db-models
git pull origin team-01-db-models
git checkout -b fix/db-schema-[modelname]
git push origin fix/db-schema-[modelname]

# Make your fix, then:
git add src/models/[ModelName].js
git commit -m "fix(models): correct [field/index] on [ModelName] schema"
git push origin fix/db-schema-[modelname]
# Open PR: fix/db-schema-[modelname] → team-01-db-models
# Tag DB Lead for review
```

Once DB Lead merges the fix into `team-01-db-models`, DB Lead opens a PR to `develop`.

**Phase 2 Exit Criteria:**

- [ ] No schema-related blockers reported by API teams
- [ ] Any schema fixes are PRd, reviewed by DB Lead, and merged to `team-01-db-models` then to `develop` promptly

---

## Phase 3 — Optimization (Days 11–16: May 15–20)

**Adding reporting indexes:**

```bash
git checkout team-01-db-models
git pull origin team-01-db-models
git checkout -b feature/db-reporting-indexes
git push origin feature/db-reporting-indexes
```

Add to the relevant schemas:

```js
// In Attendance schema — for date-range attendance reports
attendanceSchema.index({ checkedInAt: 1 });
attendanceSchema.index({ eventId: 1, checkedInAt: 1 });

// In ServiceContribution schema — for category/period finance reports
serviceContributionSchema.index({ date: 1, category: 1 });
serviceContributionSchema.index({ date: 1 });
```

```bash
git add src/models/
git commit -m "perf(models): add compound indexes for reporting aggregations"
git push origin feature/db-reporting-indexes
# Open PR: feature/db-reporting-indexes → team-01-db-models
# DB Lead reviews, merges, then PRs team-01-db-models → develop
```

**Phase 3 Exit Criteria:**

- [ ] Reporting queries return results in acceptable time on test data
- [ ] No outstanding schema issues in `team-01-db-models` or `develop`

---

## Phase 4 — Final Review (Days 17–19: May 21–24)

Run a final schema audit — confirm all 17 models exist in `src/models/`:

```bash
ls src/models/
# Expected output:
# AuditLog.js         Expense.js          Mission.js          ServiceContribution.js
# Announcement.js     Fellowship.js       OrganizationalUnit.js  Staff.js
# Attendance.js       InventoryItem.js    Program.js          Vendor.js
# Event.js            MediaResource.js    ProgramEnrollment.js   WelfareCase.js
# Member.js           User.js
```

If any fixes are made in Phase 4:

```bash
git checkout team-01-db-models
git pull origin team-01-db-models
git checkout -b fix/db-final-[description]
git push origin fix/db-final-[description]
# Fix → commit → push → PR to team-01-db-models
# DB Lead reviews, merges, then PRs team-01-db-models → develop
```

---

## Schema Standards (Your Non-Negotiables)

```js
// Every schema must follow this pattern
const exampleSchema = new mongoose.Schema(
  {
    fieldName: {
      type: String,
      required: [true, "fieldName is required"],
      trim: true,
    },
    refField: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModelName",
      index: true,
    },
  },
  { timestamps: true },
);
```

- No schema without `timestamps: true`
- No ObjectId ref without `index: true`
- No field without at least one validation rule
- All enums must list every valid value explicitly
- Use `sparse: true` on optional unique fields (e.g. Member email)

---

## Escalation Path

1. Schema question from API team → DB Dev answers directly
2. Schema change needed → DB Dev drafts fix on feature branch → PR to `team-01-db-models` → DB Lead reviews and merges → DB Lead PRs to `develop`
3. Breaking schema issue found in `develop` → DB Lead escalates to general admin immediately

---

_ChMS Capstone Project | Team 01: Database & Models | Version 2.1 | May 2026_
