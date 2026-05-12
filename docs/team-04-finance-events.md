# ChMS Capstone Project

## Team Implementation Plan — Core API — Finance & Events

### Extracted from Document VI: Master Implementation Plan

---

| Field      | Detail                                         |
| ---------- | ---------------------------------------------- |
| Team       | Team 04 — Core API — Finance & Events          |
| Members    | API Dev B1, API Dev B2, API Dev B3, API Dev B4 |
| Lead       | API Lead B                                     |
| Version    | 2.0                                            |
| Date       | May 5, 2026                                    |
| Submission | May 24, 2026                                   |

> This is your team's primary daily reference. It contains your phase-by-phase tasks, exit criteria, copy-paste implementation code, and exact git commands. For full system context refer to the master control documents (Doc I–VI).

---

## Branch Structure

This project uses a **3-tier branch model**. Understand this before writing a single line of code:

```
main                               ← General admin only. Final submission. Do not touch.
  └── develop                      ← API Lead B PRs here when a phase is complete and verified.
        └── team-04-finance-events     ← Your team's working branch. All feature branches stem from here.
              └── feature/finance-prep              ← Phase 1 prep (all devs)
              └── feature/finance-contributions     ← API Dev B1, B2
              └── feature/finance-expenses          ← API Dev B3, B4
              └── feature/events-crud               ← API Dev B2, B3
              └── feature/events-attendance         ← API Dev B4
              └── feature/reports-attendance        ← API Dev B2
              └── feature/reports-finance           ← API Dev B3
              └── feature/reports-programs          ← API Dev B4
```

**The rules:**

- Contributors **never** push directly to `develop` or `main`
- Contributors **never** branch off `develop` — always branch off `team-04-finance-events`
- API Lead B reviews and merges all PRs into `team-04-finance-events`
- API Lead B opens the PR from `team-04-finance-events` → `develop` only when the phase is confirmed done and ready for integration

---

## Your Team's Scope

**You own:** Financial contributions, expenses, finance summary, events, attendance, and all reporting endpoints. Finance data is privacy-sensitive — read and apply the finance business rules in Doc II Section 5.1 before writing a single line of code.

> **Critical rule:** Contributions track service totals only. There is NEVER a `memberId` on a `ServiceContribution` record. Any PR that adds `memberId` to a contribution will be rejected immediately.

---

## Phase 1 — Preparation (Days 1–3: May 5–7)

### STEP 1 — Get Latest Team Branch and Create Your Preparation Branch

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events
git checkout -b feature/finance-prep
git push origin feature/finance-prep
```

### Activities

- Review DB Team's schemas for `ServiceContribution`, `Expense`, `Event`, `Attendance` in `src/models/` — flag any issues to DB Lead
- Study Doc II Section 5.1 (Finance rules) and Section 5.3 (Attendance rules)
- Document your endpoint request/response shapes and share with the team before Day 4
- Agree on task ownership for Phase 2 before Day 4 (assignments listed below)

> Phase 1 produces no merged code. Use this time so Phase 2 starts at full speed on Day 4.

---

## Phase 2 — Finance & Events APIs (Days 4–10: May 8–14)

---

## FINANCE (Days 4–6) — API Dev B1, B2, B3, B4

### STEP 1 — Branch Setup

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events

git checkout -b feature/finance-contributions   # API Dev B1, B2
git push origin feature/finance-contributions

git checkout -b feature/finance-expenses        # API Dev B3, B4
git push origin feature/finance-expenses
```

---

### T-MB-001 & T-MB-002 — Contributions POST + GET (API Dev B1, B2)

**Branch:** `feature/finance-contributions`

Create `src/validators/finance.validator.js`:

```js
const Joi = require("joi");

const contributionSchema = Joi.object({
  eventId: Joi.string().required(),
  date: Joi.date().required(),
  category: Joi.string()
    .valid("tithe", "offering", "donation", "special")
    .required(),
  channel: Joi.string().valid("cash", "transfer", "pos", "online").required(),
  totalAmount: Joi.number().min(0).required(),
  currency: Joi.string().default("NGN"),
  notes: Joi.string().optional().allow(""),
  // memberId is intentionally absent — never accepted on this endpoint
});

const expenseSchema = Joi.object({
  title: Joi.string().trim().required(),
  category: Joi.string()
    .valid(
      "operations",
      "welfare",
      "missions",
      "programs",
      "maintenance",
      "other",
    )
    .required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default("NGN"),
  date: Joi.date().required(),
  vendorId: Joi.string().optional(),
  notes: Joi.string().optional().allow(""),
});

module.exports = { contributionSchema, expenseSchema };
```

Create `src/services/contribution.service.js`:

```js
const ServiceContribution = require("../models/ServiceContribution");

const createContribution = async (data, userId) => {
  // Explicitly strip any memberId if somehow present — defence in depth
  const { memberId, ...safeData } = data;
  return ServiceContribution.create({ ...safeData, recordedBy: userId });
};

const getAllContributions = async ({
  page = 1,
  limit = 20,
  date,
  category,
  channel,
  from,
  to,
}) => {
  const filter = {};
  if (category) filter.category = category;
  if (channel) filter.channel = channel;
  if (date) filter.date = new Date(date);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const total = await ServiceContribution.countDocuments(filter);
  const data = await ServiceContribution.find(filter)
    .populate("eventId", "title date type")
    .populate("recordedBy", "firstName lastName")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { createContribution, getAllContributions };
```

Create `src/controllers/contribution.controller.js`:

```js
const contributionService = require("../services/contribution.service");
const { contributionSchema } = require("../validators/finance.validator");

const createContribution = async (req, res) => {
  try {
    const { error } = contributionSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const contribution = await contributionService.createContribution(
      req.body,
      req.user._id,
    );
    return res.status(201).json({ success: true, data: contribution });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getContributions = async (req, res) => {
  try {
    const result = await contributionService.getAllContributions(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createContribution, getContributions };
```

---

### T-MB-003 & T-MB-004 — Expenses POST + GET (API Dev B3, B4)

**Branch:** `feature/finance-expenses`

Create `src/services/expense.service.js`:

```js
const Expense = require("../models/Expense");

const createExpense = async (data, userId, fileInfo) => {
  const expenseData = { ...data, recordedBy: userId };
  if (fileInfo) {
    expenseData.receiptUrl = fileInfo.url;
    expenseData.public_id = fileInfo.public_id;
  }
  return Expense.create(expenseData);
};

const getAllExpenses = async ({ page = 1, limit = 20, category, from, to }) => {
  const filter = {};
  if (category) filter.category = category;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const total = await Expense.countDocuments(filter);
  const data = await Expense.find(filter)
    .populate("vendorId", "name contactPerson")
    .populate("approvedBy", "firstName lastName")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { createExpense, getAllExpenses };
```

Create `src/controllers/expense.controller.js`:

```js
const expenseService = require("../services/expense.service");
const uploadToCloud = require("../utils/uploadToCloud");
const { expenseSchema } = require("../validators/finance.validator");

const createExpense = async (req, res) => {
  try {
    const { error } = expenseSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    let fileInfo = null;
    if (req.file) {
      fileInfo = await uploadToCloud(req.file.buffer, "chms-receipts");
    }

    const expense = await expenseService.createExpense(
      req.body,
      req.user._id,
      fileInfo,
    );
    return res.status(201).json({ success: true, data: expense });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const result = await expenseService.getAllExpenses(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createExpense, getExpenses };
```

---

### T-MB-005 — GET /finance/summary (API Dev B1)

Add to `src/services/contribution.service.js`:

```js
const getFinanceSummary = async ({ from, to } = {}) => {
  const dateFilter = {};
  if (from || to) {
    dateFilter.date = {};
    if (from) dateFilter.date.$gte = new Date(from);
    if (to) dateFilter.date.$lte = new Date(to);
  }

  // Total income — aggregate all contributions
  const incomeAgg = await ServiceContribution.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Income breakdown by category
  const incomeByCategory = await ServiceContribution.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Total expenses — aggregate all expenses
  const Expense = require("../models/Expense");
  const expenseAgg = await Expense.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$amount" },
      },
    },
  ]);

  // Expenses breakdown by category
  const expensesByCategory = await Expense.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
      },
    },
  ]);

  const totalIncome = incomeAgg[0]?.totalIncome || 0;
  const totalExpenses = expenseAgg[0]?.totalExpenses || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    currency: "NGN",
    incomeByCategory: incomeByCategory.map((i) => ({
      category: i._id,
      amount: i.amount,
    })),
    expensesByCategory: expensesByCategory.map((i) => ({
      category: i._id,
      amount: i.amount,
    })),
  };
};

// Add to exports
module.exports = { createContribution, getAllContributions, getFinanceSummary };
```

Add summary controller method to `src/controllers/contribution.controller.js`:

```js
const getFinanceSummary = async (req, res) => {
  try {
    const result = await contributionService.getFinanceSummary(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Add to exports
module.exports = { createContribution, getContributions, getFinanceSummary };
```

Create `src/routes/finance.routes.js`:

```js
const express = require("express");
const router = express.Router();
const contributionController = require("../controllers/contribution.controller");
const expenseController = require("../controllers/expense.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

// Contributions
router.post(
  "/contributions",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  contributionController.createContribution,
);
router.get(
  "/contributions",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  contributionController.getContributions,
);

// Expenses
router.post(
  "/expenses",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  upload.single("receipt"),
  expenseController.createExpense,
);
router.get(
  "/expenses",
  authenticate,
  authorizeRoles("finance_officer", "admin"),
  expenseController.getExpenses,
);

// Summary — admin only
router.get(
  "/summary",
  authenticate,
  authorizeRoles("admin"),
  contributionController.getFinanceSummary,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const financeRoutes = require("./routes/finance.routes");
app.use("/api/v1/finance", financeRoutes);
```

**Git commands after completing Finance:**

```bash
# API Dev B1, B2 — contributions branch
git add src/validators/finance.validator.js \
        src/services/contribution.service.js \
        src/controllers/contribution.controller.js \
        src/routes/finance.routes.js
git commit -m "feat(finance): add contributions POST/GET and finance summary aggregation"
git push origin feature/finance-contributions
# Open Pull Request: feature/finance-contributions → team-04-finance-events

# API Dev B3, B4 — expenses branch
git add src/services/expense.service.js \
        src/controllers/expense.controller.js \
        src/app.js
git commit -m "feat(finance): add expenses POST/GET with optional Cloudinary receipt upload; mount in app.js"
git push origin feature/finance-expenses
# Open Pull Request: feature/finance-expenses → team-04-finance-events
```

**After API Lead B approves and merges into the team branch:**

```bash
# API Dev B1, B2
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d feature/finance-contributions

# API Dev B3, B4
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d feature/finance-expenses
```

---

## EVENTS (Days 7–9) — API Dev B2, B3

### STEP 1 — Branch Setup

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events
git checkout -b feature/events-crud
git push origin feature/events-crud
```

### T-MB-006 & T-MB-007 — Events CRUD + Date Filter (API Dev B2, B3)

**Branch:** `feature/events-crud`

Create `src/validators/event.validator.js`:

```js
const Joi = require("joi");

const createEventSchema = Joi.object({
  title: Joi.string().trim().required(),
  type: Joi.string()
    .valid("service", "ceremony", "special", "fellowship")
    .required(),
  description: Joi.string().optional().allow(""),
  date: Joi.date().required(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  location: Joi.string().optional(),
});

const updateEventSchema = createEventSchema.fork(
  ["title", "type", "date"],
  (field) => field.optional(),
);

module.exports = { createEventSchema, updateEventSchema };
```

Create `src/services/event.service.js`:

```js
const Event = require("../models/Event");

const getAllEvents = async ({ page = 1, limit = 20, type, from, to }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const total = await Event.countDocuments(filter);
  const data = await Event.find(filter)
    .populate("createdBy", "firstName lastName")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getEventById = async (id) => {
  const event = await Event.findOne({ _id: id, isActive: true }).populate(
    "createdBy",
    "firstName lastName role",
  );
  if (!event) throw new Error("Event not found.");
  return event;
};

const createEvent = async (data, userId) => {
  return Event.create({ ...data, createdBy: userId });
};

const updateEvent = async (id, data) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!event) throw new Error("Event not found.");
  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!event) throw new Error("Event not found.");
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
```

Create `src/controllers/event.controller.js`:

```js
const eventService = require("../services/event.service");
const {
  createEventSchema,
  updateEventSchema,
} = require("../validators/event.validator");

const getEvents = async (req, res) => {
  try {
    const result = await eventService.getAllEvents(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { error } = createEventSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const event = await eventService.createEvent(req.body, req.user._id);
    return res.status(201).json({ success: true, data: event });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { error } = updateEventSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const event = await eventService.updateEvent(req.params.id, req.body);
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Event deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
```

---

## ATTENDANCE (Days 7–9) — API Dev B4

### STEP 1 — Branch Setup

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events
git checkout -b feature/events-attendance
git push origin feature/events-attendance
```

### T-MB-008 & T-MB-009 — Attendance POST + GET (API Dev B4)

**Branch:** `feature/events-attendance`

Create `src/services/attendance.service.js`:

```js
const Attendance = require("../models/Attendance");

// Accepts a single memberId string OR an array of memberIds
const recordAttendance = async (
  eventId,
  memberIds,
  userId,
  method = "manual",
) => {
  const ids = Array.isArray(memberIds) ? memberIds : [memberIds];

  const results = { inserted: [], duplicates: [], errors: [] };

  for (const memberId of ids) {
    try {
      const record = await Attendance.create({
        eventId,
        memberId,
        method,
        recordedBy: userId,
      });
      results.inserted.push(record);
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key — compound index {eventId, memberId} violated
        results.duplicates.push(memberId);
      } else {
        results.errors.push({ memberId, error: err.message });
      }
    }
  }

  return results;
};

const getEventAttendance = async (eventId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments({ eventId });
  const data = await Attendance.find({ eventId })
    .populate("memberId", "firstName lastName phone memberStatus")
    .sort({ checkedInAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { recordAttendance, getEventAttendance };
```

Create `src/controllers/attendance.controller.js`:

```js
const attendanceService = require("../services/attendance.service");

const recordAttendance = async (req, res) => {
  try {
    const { memberId, memberIds, method } = req.body;

    // Accept either memberId (single) or memberIds (array)
    const ids = memberIds || memberId;
    if (!ids) {
      return res
        .status(400)
        .json({ success: false, error: "memberId or memberIds is required." });
    }

    const results = await attendanceService.recordAttendance(
      req.params.id,
      ids,
      req.user._id,
      method,
    );

    // If ALL were duplicates, return 409
    const allDuplicates =
      results.inserted.length === 0 &&
      results.duplicates.length > 0 &&
      results.errors.length === 0;

    if (allDuplicates) {
      return res.status(409).json({
        success: false,
        error: "All members already checked in for this event.",
        data: results,
      });
    }

    // Partial or full success
    return res.status(201).json({
      success: true,
      message: `${results.inserted.length} checked in. ${results.duplicates.length} duplicate(s) skipped.`,
      data: results,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getEventAttendance = async (req, res) => {
  try {
    const result = await attendanceService.getEventAttendance(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { recordAttendance, getEventAttendance };
```

Create `src/routes/event.routes.js`:

```js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const attendanceController = require("../controllers/attendance.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

// Events CRUD
router.get(
  "/",
  authenticate,
  eventController.getEvents, // all authenticated users
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  eventController.createEvent,
);
router.get(
  "/:id",
  authenticate,
  eventController.getEvent, // all authenticated users
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  eventController.updateEvent,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  eventController.deleteEvent,
);

// Attendance
router.post(
  "/:id/attendance",
  authenticate,
  authorizeRoles("staff", "admin", "pastor"),
  attendanceController.recordAttendance,
);
router.get(
  "/:id/attendance",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  attendanceController.getEventAttendance,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const eventRoutes = require("./routes/event.routes");
app.use("/api/v1/events", eventRoutes);
```

**Git commands after completing Events & Attendance:**

```bash
# Events branch (API Dev B2, B3)
git add src/validators/event.validator.js \
        src/services/event.service.js \
        src/controllers/event.controller.js \
        src/routes/event.routes.js
git commit -m "feat(events): add Events CRUD with date-range filter and soft-delete"
git push origin feature/events-crud
# Open Pull Request: feature/events-crud → team-04-finance-events

# Attendance branch (API Dev B4)
git add src/services/attendance.service.js \
        src/controllers/attendance.controller.js
git commit -m "feat(attendance): add bulk attendance check-in with 409 on duplicate detection"
git push origin feature/events-attendance
# Open Pull Request: feature/events-attendance → team-04-finance-events
```

**After API Lead B approves and merges into the team branch:**

```bash
# API Dev B2, B3
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d feature/events-crud

# API Dev B4
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d feature/events-attendance
```

---

**Phase 2 Exit Criteria:**

- [ ] Finance contribution POST tested — confirm no `memberId` in any stored record (check DB directly)
- [ ] Finance summary returns correct `totalIncome`, `totalExpenses`, `netBalance`, and category breakdowns
- [ ] Receipt upload stores both `receiptUrl` and `public_id` — confirmed in DB
- [ ] Event date-range filter tested: `?from=2026-05-01&to=2026-05-31` returns correct results
- [ ] Single attendance check-in returns 201
- [ ] Duplicate attendance returns 409
- [ ] Bulk attendance tested with array of 5+ `memberIds`
- [ ] All routes protected — coordinate with Team 2

---

## Phase 3 — Reporting (Days 13–14: May 17–18)

### STEP 1 — Branch Setup

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events
git checkout -b feature/reports-attendance    # API Dev B2
git push origin feature/reports-attendance

git checkout -b feature/reports-finance       # API Dev B3
git push origin feature/reports-finance

git checkout -b feature/reports-programs      # API Dev B4
git push origin feature/reports-programs
```

---

### T-MB-010 — GET /reports/attendance (API Dev B2)

**Branch:** `feature/reports-attendance`

Create `src/services/report.service.js`:

```js
const Attendance = require("../models/Attendance");
const ServiceContribution = require("../models/ServiceContribution");
const Expense = require("../models/Expense");
const ProgramEnrollment = require("../models/ProgramEnrollment");
const Program = require("../models/Program");

const getAttendanceReport = async ({ from, to }) => {
  const matchStage = {};
  if (from || to) {
    matchStage.checkedInAt = {};
    if (from) matchStage.checkedInAt.$gte = new Date(from);
    if (to) matchStage.checkedInAt.$lte = new Date(to);
  }

  const results = await Attendance.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$eventId",
        totalAttendees: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $project: {
        _id: 0,
        eventId: "$_id",
        eventTitle: "$event.title",
        eventDate: "$event.date",
        eventType: "$event.type",
        totalAttendees: 1,
      },
    },
    { $sort: { eventDate: -1 } },
  ]);

  return results;
};
```

---

### T-MB-011 — GET /reports/finance (API Dev B3)

Add to `src/services/report.service.js`:

```js
const getFinanceReport = async ({ period = "monthly" }) => {
  // Build date grouping based on period
  const groupId =
    period === "yearly"
      ? { year: { $year: "$date" } }
      : period === "quarterly"
        ? {
            year: { $year: "$date" },
            quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
          }
        : { year: { $year: "$date" }, month: { $month: "$date" } }; // default: monthly

  const incomeByPeriod = await ServiceContribution.aggregate([
    { $group: { _id: groupId, totalIncome: { $sum: "$totalAmount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const expensesByPeriod = await Expense.aggregate([
    { $group: { _id: groupId, totalExpenses: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Merge income and expenses by period key
  const periodMap = {};

  for (const row of incomeByPeriod) {
    const key = JSON.stringify(row._id);
    if (!periodMap[key])
      periodMap[key] = { period: row._id, totalIncome: 0, totalExpenses: 0 };
    periodMap[key].totalIncome = row.totalIncome;
  }

  for (const row of expensesByPeriod) {
    const key = JSON.stringify(row._id);
    if (!periodMap[key])
      periodMap[key] = { period: row._id, totalIncome: 0, totalExpenses: 0 };
    periodMap[key].totalExpenses = row.totalExpenses;
  }

  return Object.values(periodMap).map((row) => ({
    ...row,
    net: row.totalIncome - row.totalExpenses,
  }));
};
```

---

### T-MB-012 — GET /reports/programs (API Dev B4)

Add to `src/services/report.service.js`:

```js
const getProgramsReport = async () => {
  const programs = await Program.find({ isActive: true }).select(
    "title type maxParticipants",
  );

  const results = await Promise.all(
    programs.map(async (program) => {
      const total = await ProgramEnrollment.countDocuments({
        programId: program._id,
      });
      const completed = await ProgramEnrollment.countDocuments({
        programId: program._id,
        status: "completed",
      });
      const completionRate =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        programId: program._id,
        title: program.title,
        type: program.type,
        maxParticipants: program.maxParticipants || null,
        totalEnrolled: total,
        totalCompleted: completed,
        completionRate: `${completionRate}%`,
      };
    }),
  );

  return results;
};

module.exports = {
  getAttendanceReport,
  getFinanceReport,
  getProgramsReport,
};
```

Create `src/controllers/report.controller.js`:

```js
const reportService = require("../services/report.service");

const getAttendanceReport = async (req, res) => {
  try {
    const data = await reportService.getAttendanceReport(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getFinanceReport = async (req, res) => {
  try {
    const data = await reportService.getFinanceReport(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getProgramsReport = async (req, res) => {
  try {
    const data = await reportService.getProgramsReport();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAttendanceReport, getFinanceReport, getProgramsReport };
```

Create `src/routes/report.routes.js`:

```js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/attendance",
  authenticate,
  authorizeRoles("admin", "finance_officer", "pastor"),
  reportController.getAttendanceReport,
);

router.get(
  "/finance",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  reportController.getFinanceReport,
);

router.get(
  "/programs",
  authenticate,
  authorizeRoles("admin", "pastor"),
  reportController.getProgramsReport,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const reportRoutes = require("./routes/report.routes");
app.use("/api/v1/reports", reportRoutes);
```

**Git commands after completing each report:**

```bash
# API Dev B2 — attendance report
git add src/services/report.service.js \
        src/controllers/report.controller.js \
        src/routes/report.routes.js
git commit -m "feat(reports): add attendance report aggregation by event with date range filter"
git push origin feature/reports-attendance
# Open Pull Request: feature/reports-attendance → team-04-finance-events

# API Dev B3 — finance report (add to report.service.js, controller, routes already exist)
git add src/services/report.service.js
git commit -m "feat(reports): add finance report with monthly/quarterly/yearly period grouping"
git push origin feature/reports-finance
# Open Pull Request: feature/reports-finance → team-04-finance-events

# API Dev B4 — programs report
git add src/services/report.service.js
git commit -m "feat(reports): add programs report with enrollment count and completion rate"
git push origin feature/reports-programs
# Open Pull Request: feature/reports-programs → team-04-finance-events
```

**After API Lead B approves and merges into the team branch:**

```bash
# API Dev B2
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d feature/reports-attendance

# API Dev B3
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d feature/reports-finance

# API Dev B4
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d feature/reports-programs
```

---

**Phase 3 Exit Criteria:**

- [ ] Attendance report returns `{ eventId, eventTitle, eventDate, totalAttendees }` per event — verified against test records
- [ ] Finance report returns correct period groupings for `monthly`, `quarterly`, `yearly`
- [ ] Programs report shows correct `totalEnrolled`, `totalCompleted`, and `completionRate`
- [ ] No PII (member names, IDs) in finance or attendance report responses
- [ ] All report endpoints return 403 for unauthorized roles

---

## Phase 4 — Bug Fixes & Optimization (Days 17–19: May 21–24)

Fix all issues from QA regression. No new features — fixes only.

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events
git checkout -b fix/finance-[description]
git push origin fix/finance-[description]

# Fix → commit → push → PR
git add .
git commit -m "fix(finance): [describe the fix]"
git push origin fix/finance-[description]
# Open Pull Request: fix/finance-[description] → team-04-finance-events
```

**After API Lead B approves and merges into the team branch:**

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events
git branch -d fix/finance-[description]
```

**Finance summary optimization check — run this if summary is slow:**

```js
// In MongoDB Atlas or Compass, verify these indexes exist on ServiceContribution:
// { date: 1, category: 1 }
// { date: 1 }
// If missing, flag to DB Lead (Team 1) to add via PR
```

**After all fix PRs are merged, API Lead B opens the final PR: `team-04-finance-events` → `develop`.**

---

## Finance Privacy Rule — Critical

```js
// CORRECT — tracks service total only
const contribution = new ServiceContribution({
  eventId,
  date,
  category,    // 'tithe', 'offering', etc.
  channel,     // 'cash', 'transfer', etc.
  totalAmount, // e.g. 450000
  recordedBy: req.user._id,
});

// WRONG — never do this — instant PR rejection
const contribution = new ServiceContribution({
  memberId: req.body.memberId, // FORBIDDEN
  ...
});
```

---

## Escalation Path

1. Schema issue → DB Lead (Team 1)
2. Auth/RBAC issue → Auth Lead (Team 2)
3. Finance rule ambiguity → API Lead B → Admin

---

_ChMS Capstone Project | Team 04: Finance & Events | Version 2.0 | May 2026_
