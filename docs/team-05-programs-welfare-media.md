# ChMS Capstone Project

## Team Implementation Plan — Programs, Welfare & Media

### Extracted from Document VI: Master Implementation Plan

---

| Field      | Detail                              |
| ---------- | ----------------------------------- |
| Team       | Team 05 — Programs, Welfare & Media |
| Members    | API Dev C1, API Dev C2, API Dev C3  |
| Lead       | API Lead C                          |
| Version    | 2.1                                 |
| Date       | May 5, 2026                         |
| Submission | May 24, 2026                        |

> This is your team's primary daily reference. It contains your phase-by-phase tasks, exit criteria, copy-paste implementation code, and exact git commands. For full system context refer to the master control documents (Doc I–VI).

---

## Branch Structure

This project uses a **3-tier branch model**. Understand this before writing a single line of code:

```
main                                        ← General admin only. Final submission. Do not touch.
  └── develop                               ← API Lead C PRs here when a phase is complete and verified.
        └── team-05-programs-welfare-media      ← Your team's working branch. All feature branches stem from here.
              └── feature/pwm-prep                      ← Phase 1 prep (all devs)
              └── feature/inventory-vendors             ← API Dev C1, C3
              └── feature/welfare-cases                 ← API Dev C2
              └── feature/programs-crud                 ← API Dev C3
              └── feature/programs-enrollment           ← API Dev C1, C2
              └── feature/media-catalog                 ← API Dev C1
              └── feature/media-upload                  ← API Dev C2
```

**The rules:**

- Contributors **never** push directly to `develop` or `main`
- Contributors **never** branch off `develop` — always branch off `team-05-programs-welfare-media`
- API Lead C reviews and merges all PRs into `team-05-programs-welfare-media`
- API Lead C opens the PR from `team-05-programs-welfare-media` → `develop` only when the phase is confirmed done and ready for integration

---

## Your Team's Scope

**You own:** Inventory, Vendors, Welfare Cases, Programs, Program Enrollment, and Media Resources. You are 3 developers covering a wide scope — work in strict priority order and do not start Phase 3 until Phase 2 is fully merged.

---

## Phase 1 — Preparation (Days 1–3: May 5–7)

### STEP 1 — Get Latest Team Branch and Create Your Preparation Branch

```bash
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media
git checkout -b feature/pwm-prep
git push origin feature/pwm-prep
```

### Activities

- Review DB Team's schemas for `WelfareCase`, `InventoryItem`, `Vendor`, `Program`, `ProgramEnrollment`, `MediaResource` in `src/models/` — flag any issues to DB Lead immediately
- Agree within the team on Phase 2 ownership before Day 4 (assignments listed below)
- Review the Cloudinary upload pattern in Doc II Section 5.4 — understand it before Phase 3

> Phase 1 produces no merged code. Use this time so Phase 2 starts at full speed on Day 4.

---

## Phase 2 — Inventory, Vendors & Welfare (Days 4–10: May 8–14)

---

## INVENTORY & VENDORS (Days 4–7) — API Dev C1, C2, C3

### STEP 1 — Branch Setup

```bash
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media

git checkout -b feature/inventory-vendors    # API Dev C1, C3
git push origin feature/inventory-vendors

git checkout -b feature/welfare-cases        # API Dev C2
git push origin feature/welfare-cases
```

---

### T-MC-001 — CRUD /inventory (API Dev C1)

**Branch:** `feature/inventory-vendors`

Create `src/services/inventory.service.js`:

```js
const InventoryItem = require("../models/InventoryItem");
const Expense = require("../models/Expense");

const getAllInventory = async ({ page = 1, limit = 20, category }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const total = await InventoryItem.countDocuments(filter);
  const data = await InventoryItem.find(filter)
    .populate("vendorId", "name contactPerson phone")
    .populate("expenseId", "title amount date")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getInventoryById = async (id) => {
  const item = await InventoryItem.findOne({ _id: id, isActive: true })
    .populate("vendorId", "name contactPerson phone email")
    .populate("expenseId", "title amount date category");
  if (!item) throw new Error("Inventory item not found.");
  return item;
};

const createInventoryItem = async (data) => InventoryItem.create(data);

const updateInventoryItem = async (id, data) => {
  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!item) throw new Error("Inventory item not found.");
  return item;
};

const deleteInventoryItem = async (id) => {
  const item = await InventoryItem.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!item) throw new Error("Inventory item not found.");
};

const linkExpense = async (itemId, expenseId) => {
  // Validate the expense exists
  const expense = await Expense.findById(expenseId);
  if (!expense) throw new Error("Expense not found.");

  const item = await InventoryItem.findOneAndUpdate(
    { _id: itemId, isActive: true },
    { expenseId },
    { new: true },
  ).populate("expenseId", "title amount date");
  if (!item) throw new Error("Inventory item not found.");
  return item;
};

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  linkExpense,
};
```

Create `src/controllers/inventory.controller.js`:

```js
const inventoryService = require("../services/inventory.service");

const getInventory = async (req, res) => {
  try {
    const result = await inventoryService.getAllInventory(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.getInventoryById(req.params.id);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.createInventoryItem(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const item = await inventoryService.updateInventoryItem(
      req.params.id,
      req.body,
    );
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    await inventoryService.deleteInventoryItem(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Inventory item deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const linkExpense = async (req, res) => {
  try {
    const { expenseId } = req.body;
    if (!expenseId)
      return res
        .status(400)
        .json({ success: false, error: "expenseId is required." });
    const item = await inventoryService.linkExpense(req.params.id, expenseId);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  linkExpense,
};
```

---

### T-MC-003 — CRUD /vendors (API Dev C3)

**Branch:** `feature/inventory-vendors`

Create `src/services/vendor.service.js`:

```js
const Vendor = require("../models/Vendor");

const getAllVendors = async ({ page = 1, limit = 20, category }) => {
  const filter = { isActive: true };
  if (category) filter.category = category;
  const skip = (page - 1) * limit;
  const total = await Vendor.countDocuments(filter);
  const data = await Vendor.find(filter)
    .sort({ name: 1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getVendorById = async (id) => {
  const vendor = await Vendor.findOne({ _id: id, isActive: true });
  if (!vendor) throw new Error("Vendor not found.");
  return vendor;
};

const createVendor = async (data) => Vendor.create(data);

const updateVendor = async (id, data) => {
  const vendor = await Vendor.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!vendor) throw new Error("Vendor not found.");
  return vendor;
};

const deleteVendor = async (id) => {
  const vendor = await Vendor.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!vendor) throw new Error("Vendor not found.");
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};
```

Create `src/controllers/vendor.controller.js`:

```js
const vendorService = require("../services/vendor.service");

const getVendors = async (req, res) => {
  try {
    const result = await vendorService.getAllVendors(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getVendor = async (req, res) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    return res.status(200).json({ success: true, data: vendor });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const vendor = await vendorService.createVendor(req.body);
    return res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await vendorService.updateVendor(req.params.id, req.body);
    return res.status(200).json({ success: true, data: vendor });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    await vendorService.deleteVendor(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Vendor deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
};
```

Create `src/routes/inventory.routes.js`:

```js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  inventoryController.getInventory,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  inventoryController.createInventoryItem,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  inventoryController.getInventoryItem,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  inventoryController.updateInventoryItem,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  inventoryController.deleteInventoryItem,
);
router.put(
  "/:id/link-expense",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  inventoryController.linkExpense,
);

module.exports = router;
```

Create `src/routes/vendor.routes.js`:

```js
const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "finance_officer", "staff"),
  vendorController.getVendors,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  vendorController.createVendor,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "finance_officer", "staff"),
  vendorController.getVendor,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "finance_officer"),
  vendorController.updateVendor,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  vendorController.deleteVendor,
);

module.exports = router;
```

Mount both in `src/app.js`:

```js
const inventoryRoutes = require("./routes/inventory.routes");
const vendorRoutes = require("./routes/vendor.routes");
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/vendors", vendorRoutes);
```

**Git commands after completing Inventory & Vendors:**

```bash
git add src/services/inventory.service.js \
        src/controllers/inventory.controller.js \
        src/routes/inventory.routes.js \
        src/services/vendor.service.js \
        src/controllers/vendor.controller.js \
        src/routes/vendor.routes.js
git commit -m "feat(inventory-vendors): add Inventory CRUD with expense linkage and Vendor CRUD"
git push origin feature/inventory-vendors
# Open Pull Request: feature/inventory-vendors → team-05-programs-welfare-media
```

---

## WELFARE (Days 7–10) — API Dev C2

### T-MC-004 & T-MC-005 — Welfare CRUD + Support Log

**Branch:** `feature/welfare-cases`

Create `src/services/welfare.service.js`:

```js
const WelfareCase = require("../models/WelfareCase");
const Member = require("../models/Member");

const getAllWelfareCases = async ({ page = 1, limit = 20, status }) => {
  const filter = { isActive: true };
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const total = await WelfareCase.countDocuments(filter);
  const data = await WelfareCase.find(filter)
    .populate("memberId", "firstName lastName phone memberStatus")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getWelfareCaseById = async (id) => {
  const wc = await WelfareCase.findOne({ _id: id, isActive: true })
    .populate("memberId", "firstName lastName phone address memberStatus")
    .populate("supportLog.recordedBy", "firstName lastName role");
  if (!wc) throw new Error("Welfare case not found.");
  return wc;
};

const createWelfareCase = async (data) => {
  // Validate member exists
  const member = await Member.findOne({ _id: data.memberId, isActive: true });
  if (!member) throw new Error("Member not found or inactive.");
  return WelfareCase.create(data);
};

const updateWelfareCase = async (id, data) => {
  const wc = await WelfareCase.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!wc) throw new Error("Welfare case not found.");
  return wc;
};

const deleteWelfareCase = async (id) => {
  const wc = await WelfareCase.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!wc) throw new Error("Welfare case not found.");
};

const addSupportLog = async (id, logEntry, userId) => {
  const wc = await WelfareCase.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $push: {
        supportLog: {
          ...logEntry,
          recordedBy: userId,
          date: logEntry.date || new Date(),
        },
      },
    },
    { new: true, runValidators: true },
  ).populate("supportLog.recordedBy", "firstName lastName role");
  if (!wc) throw new Error("Welfare case not found.");
  return wc;
};

const getSupportLog = async (id) => {
  const wc = await WelfareCase.findOne({ _id: id, isActive: true })
    .select("supportLog")
    .populate("supportLog.recordedBy", "firstName lastName role");
  if (!wc) throw new Error("Welfare case not found.");
  return wc.supportLog;
};

module.exports = {
  getAllWelfareCases,
  getWelfareCaseById,
  createWelfareCase,
  updateWelfareCase,
  deleteWelfareCase,
  addSupportLog,
  getSupportLog,
};
```

Create `src/controllers/welfare.controller.js`:

```js
const welfareService = require("../services/welfare.service");

const getWelfareCases = async (req, res) => {
  try {
    const result = await welfareService.getAllWelfareCases(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getWelfareCase = async (req, res) => {
  try {
    const wc = await welfareService.getWelfareCaseById(req.params.id);
    return res.status(200).json({ success: true, data: wc });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createWelfareCase = async (req, res) => {
  try {
    const wc = await welfareService.createWelfareCase(req.body);
    return res.status(201).json({ success: true, data: wc });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateWelfareCase = async (req, res) => {
  try {
    const wc = await welfareService.updateWelfareCase(req.params.id, req.body);
    return res.status(200).json({ success: true, data: wc });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteWelfareCase = async (req, res) => {
  try {
    await welfareService.deleteWelfareCase(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Welfare case closed." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const addSupportLog = async (req, res) => {
  try {
    const wc = await welfareService.addSupportLog(
      req.params.id,
      req.body,
      req.user._id,
    );
    return res.status(200).json({ success: true, data: wc });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getSupportLog = async (req, res) => {
  try {
    const log = await welfareService.getSupportLog(req.params.id);
    return res.status(200).json({ success: true, data: log });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getWelfareCases,
  getWelfareCase,
  createWelfareCase,
  updateWelfareCase,
  deleteWelfareCase,
  addSupportLog,
  getSupportLog,
};
```

Create `src/routes/welfare.routes.js`:

```js
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
```

Mount in `src/app.js`:

```js
const welfareRoutes = require("./routes/welfare.routes");
app.use("/api/v1/welfare", welfareRoutes);
```

**Git commands after completing Welfare:**

```bash
git add src/services/welfare.service.js \
        src/controllers/welfare.controller.js \
        src/routes/welfare.routes.js
git commit -m "feat(welfare): add Welfare Case CRUD with support log append and full log retrieval"
git push origin feature/welfare-cases
# Open Pull Request: feature/welfare-cases → team-05-programs-welfare-media
```

**After every Phase 2 PR is approved and merged:**

```bash
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media
git branch -d feature/inventory-vendors   # replace with your branch name
```

---

**Phase 2 Exit Criteria:**

- [ ] Inventory CRUD tested — category filter works, expense linkage validated
- [ ] Attempt to link non-existent expense returns 400
- [ ] Vendor CRUD fully tested
- [ ] Welfare case creation with invalid `memberId` returns 400
- [ ] Support log `$push` appends correctly and returns full history
- [ ] Only `welfare_officer` and `admin` can write welfare records — verified with Team 2

---

### STEP 3 — Team Lead Only: PR team branch → develop

Once all Phase 2 feature PRs are approved and merged into `team-05-programs-welfare-media`, the Team Lead opens one PR:

**PR:** `team-05-programs-welfare-media → develop`

This PR is opened only when the Phase 2 exit criteria above are fully met.

---

## Phase 3 — Programs & Media (Days 11–16: May 15–20)

> Do not start Phase 3 until all Phase 2 PRs are merged to `team-05-programs-welfare-media` and the Team Lead has PR'd that branch to `develop`.

---

### STEP 1 — Branch Setup

```bash
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media

git checkout -b feature/programs-crud          # API Dev C3
git push origin feature/programs-crud

git checkout -b feature/programs-enrollment    # API Dev C1, C2
git push origin feature/programs-enrollment

git checkout -b feature/media-catalog          # API Dev C1
git push origin feature/media-catalog

git checkout -b feature/media-upload           # API Dev C2
git push origin feature/media-upload
```

---

### T-MC-006 — CRUD /programs (API Dev C3)

**Branch:** `feature/programs-crud`

Create `src/services/program.service.js`:

```js
const Program = require("../models/Program");

const getAllPrograms = async ({ page = 1, limit = 20, type }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const total = await Program.countDocuments(filter);
  const data = await Program.find(filter)
    .populate("coordinatorId", "firstName lastName role")
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getProgramById = async (id) => {
  const program = await Program.findOne({ _id: id, isActive: true })
    .populate("coordinatorId", "firstName lastName role")
    .populate("sessions.facilitator", "firstName lastName");
  if (!program) throw new Error("Program not found.");
  return program;
};

const createProgram = async (data) => Program.create(data);

const updateProgram = async (id, data) => {
  const program = await Program.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!program) throw new Error("Program not found.");
  return program;
};

const deleteProgram = async (id) => {
  const program = await Program.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!program) throw new Error("Program not found.");
};

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};
```

Create `src/controllers/program.controller.js`:

```js
const programService = require("../services/program.service");

const getPrograms = async (req, res) => {
  try {
    const result = await programService.getAllPrograms(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getProgram = async (req, res) => {
  try {
    const program = await programService.getProgramById(req.params.id);
    return res.status(200).json({ success: true, data: program });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createProgram = async (req, res) => {
  try {
    const program = await programService.createProgram(req.body);
    return res.status(201).json({ success: true, data: program });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateProgram = async (req, res) => {
  try {
    const program = await programService.updateProgram(req.params.id, req.body);
    return res.status(200).json({ success: true, data: program });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteProgram = async (req, res) => {
  try {
    await programService.deleteProgram(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Program deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
};
```

---

### T-MC-007 — POST /programs/:id/sessions (API Dev C1)

**Branch:** `feature/programs-enrollment`

Add to `src/services/program.service.js`:

```js
const addSession = async (programId, sessionData) => {
  const program = await Program.findOne({ _id: programId, isActive: true });
  if (!program) throw new Error("Program not found.");

  // Validate sessionNumber is unique within this program
  const duplicate = program.sessions.find(
    (s) => s.sessionNumber === sessionData.sessionNumber,
  );
  if (duplicate) {
    throw new Error(
      `Session number ${sessionData.sessionNumber} already exists in this program.`,
    );
  }

  program.sessions.push(sessionData);
  await program.save();
  return program;
};

// Add to exports
module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  addSession,
};
```

Add to `src/controllers/program.controller.js`:

```js
const addSession = async (req, res) => {
  try {
    const program = await programService.addSession(req.params.id, req.body);
    return res.status(200).json({ success: true, data: program });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

// Add to exports
module.exports = {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  addSession,
};
```

---

### T-MC-008 & T-MC-009 — Enrollment POST + Participants GET (API Dev C2)

**Branch:** `feature/programs-enrollment`

Create `src/services/enrollment.service.js`:

```js
const ProgramEnrollment = require("../models/ProgramEnrollment");
const Program = require("../models/Program");
const Member = require("../models/Member");

const enrollMember = async (programId, memberId) => {
  // Validate program exists and is active
  const program = await Program.findOne({ _id: programId, isActive: true });
  if (!program) throw new Error("Program not found.");

  // Validate member exists
  const member = await Member.findOne({ _id: memberId, isActive: true });
  if (!member) throw new Error("Member not found or inactive.");

  // Check maxParticipants limit
  if (program.maxParticipants) {
    const currentCount = await ProgramEnrollment.countDocuments({ programId });
    if (currentCount >= program.maxParticipants) {
      throw new Error(
        `Program is full. Maximum participants: ${program.maxParticipants}.`,
      );
    }
  }

  // Prevent duplicate enrollment — compound unique index will also catch this
  try {
    const enrollment = await ProgramEnrollment.create({ programId, memberId });
    return enrollment;
  } catch (err) {
    if (err.code === 11000)
      throw new Error("Member is already enrolled in this program.");
    throw err;
  }
};

const getParticipants = async (programId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const total = await ProgramEnrollment.countDocuments({ programId });
  const data = await ProgramEnrollment.find({ programId })
    .populate("memberId", "firstName lastName phone memberStatus")
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { enrollMember, getParticipants };
```

Create `src/controllers/enrollment.controller.js`:

```js
const enrollmentService = require("../services/enrollment.service");

const enrollMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId)
      return res
        .status(400)
        .json({ success: false, error: "memberId is required." });

    const enrollment = await enrollmentService.enrollMember(
      req.params.id,
      memberId,
    );
    return res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    const status =
      err.message.includes("full") || err.message.includes("already enrolled")
        ? 400
        : 500;
    return res.status(status).json({ success: false, error: err.message });
  }
};

const getParticipants = async (req, res) => {
  try {
    const result = await enrollmentService.getParticipants(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { enrollMember, getParticipants };
```

Create `src/routes/program.routes.js`:

```js
const express = require("express");
const router = express.Router();
const programController = require("../controllers/program.controller");
const enrollmentController = require("../controllers/enrollment.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

// Programs CRUD
router.get("/", authenticate, programController.getPrograms);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  programController.createProgram,
);
router.get("/:id", authenticate, programController.getProgram);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  programController.updateProgram,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  programController.deleteProgram,
);

// Sessions
router.post(
  "/:id/sessions",
  authenticate,
  authorizeRoles("admin", "pastor"),
  programController.addSession,
);

// Enrollment
router.post(
  "/:id/enroll",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  enrollmentController.enrollMember,
);
router.get(
  "/:id/participants",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  enrollmentController.getParticipants,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const programRoutes = require("./routes/program.routes");
app.use("/api/v1/programs", programRoutes);
```

**Git commands after completing Programs & Enrollment:**

```bash
# API Dev C3 — programs CRUD
git add src/services/program.service.js \
        src/controllers/program.controller.js \
        src/routes/program.routes.js
git commit -m "feat(programs): add Program CRUD with type filter and soft-delete"
git push origin feature/programs-crud
# Open Pull Request: feature/programs-crud → team-05-programs-welfare-media

# API Dev C1 & C2 — sessions + enrollment
git add src/services/program.service.js \
        src/controllers/program.controller.js \
        src/services/enrollment.service.js \
        src/controllers/enrollment.controller.js
git commit -m "feat(programs): add session management and enrollment with maxParticipants enforcement"
git push origin feature/programs-enrollment
# Open Pull Request: feature/programs-enrollment → team-05-programs-welfare-media
```

---

### T-MC-010 — CRUD /media (API Dev C1)

**Branch:** `feature/media-catalog`

Create `src/services/media.service.js`:

```js
const MediaResource = require("../models/MediaResource");
const cloudinary = require("../config/cloudinary");

const getAllMedia = async ({ page = 1, limit = 20, type }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const total = await MediaResource.countDocuments(filter);
  const data = await MediaResource.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getMediaById = async (id) => {
  const media = await MediaResource.findOne({ _id: id, isActive: true });
  if (!media) throw new Error("Media resource not found.");
  return media;
};

const createMedia = async (data) => MediaResource.create(data);

const updateMedia = async (id, data) => {
  const media = await MediaResource.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!media) throw new Error("Media resource not found.");
  return media;
};

const deleteMedia = async (id) => {
  const media = await MediaResource.findOne({ _id: id, isActive: true });
  if (!media) throw new Error("Media resource not found.");

  // If a file is attached to this resource, remove it from Cloudinary
  if (media.public_id) {
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: "auto",
    });
  }

  media.isActive = false;
  await media.save();
};

const uploadMediaFile = async (id, file) => {
  const media = await MediaResource.findOne({ _id: id, isActive: true });
  if (!media) throw new Error("Media resource not found.");

  // Determine Cloudinary resource type by mimetype
  const resourceType = file.mimetype.startsWith("audio") ? "video" : "auto";
  // Note: Cloudinary uses 'video' resource_type for audio files

  const uploadToCloud = require("../utils/uploadToCloud");
  const { url, public_id } = await uploadToCloud(
    file.buffer,
    "chms-media",
    resourceType,
  );

  // If there was a previous file, delete it from Cloudinary
  if (media.public_id) {
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: resourceType,
    });
  }

  media.fileUrl = url;
  media.public_id = public_id;
  await media.save();
  return media;
};

module.exports = {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
  uploadMediaFile,
};
```

---

### T-MC-011 — POST /media/:id/upload (API Dev C2)

**Branch:** `feature/media-upload`

Create `src/middlewares/mediaUpload.js`:

```js
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "audio/mpeg",
    "audio/mp3",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: JPEG, PNG, PDF, MP3."), false);
  }
};

const mediaUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for audio/documents
});

module.exports = mediaUpload;
```

Create `src/controllers/media.controller.js`:

```js
const mediaService = require("../services/media.service");

const getAllMedia = async (req, res) => {
  try {
    const result = await mediaService.getAllMedia(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getMedia = async (req, res) => {
  try {
    const media = await mediaService.getMediaById(req.params.id);
    return res.status(200).json({ success: true, data: media });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createMedia = async (req, res) => {
  try {
    const media = await mediaService.createMedia(req.body);
    return res.status(201).json({ success: true, data: media });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateMedia = async (req, res) => {
  try {
    const media = await mediaService.updateMedia(req.params.id, req.body);
    return res.status(200).json({ success: true, data: media });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    await mediaService.deleteMedia(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Media resource deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const uploadMediaFile = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded." });
    const media = await mediaService.uploadMediaFile(req.params.id, req.file);
    return res.status(200).json({ success: true, data: media });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllMedia,
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
  uploadMediaFile,
};
```

Create `src/routes/media.routes.js`:

```js
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
  authorizeRoles("admin", "pastor"),
  mediaController.createMedia,
);
router.get("/:id", authenticate, mediaController.getMedia);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  mediaController.updateMedia,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  mediaController.deleteMedia,
);

router.post(
  "/:id/upload",
  authenticate,
  authorizeRoles("admin", "pastor"),
  mediaUpload.single("file"),
  mediaController.uploadMediaFile,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const mediaRoutes = require("./routes/media.routes");
app.use("/api/v1/media", mediaRoutes);
```

**Git commands after completing Media:**

```bash
# API Dev C1 — media catalog
git add src/services/media.service.js \
        src/controllers/media.controller.js \
        src/routes/media.routes.js
git commit -m "feat(media): add Media Resource CRUD with Cloudinary cleanup on delete"
git push origin feature/media-catalog
# Open Pull Request: feature/media-catalog → team-05-programs-welfare-media

# API Dev C2 — media upload
git add src/middlewares/mediaUpload.js
git commit -m "feat(media): add media file upload middleware (JPEG, PNG, PDF, MP3, 50MB limit)"
git push origin feature/media-upload
# Open Pull Request: feature/media-upload → team-05-programs-welfare-media
```

**After every Phase 3 PR is approved and merged:**

```bash
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media
git branch -d feature/programs-crud   # replace with your branch name
```

---

**Phase 3 Exit Criteria:**

- [ ] Program CRUD tested with all five `type` enum values
- [ ] Session addition tested — duplicate `sessionNumber` within same program returns 400
- [ ] Enrollment enforces `maxParticipants` — 400 when full
- [ ] Duplicate enrollment returns 400
- [ ] Media upload tested for each allowed type: JPEG, PNG, PDF, MP3
- [ ] Cloudinary `public_id` stored alongside `fileUrl` — confirmed in DB
- [ ] File > 50MB returns 413
- [ ] Deleting a media resource with an attached file removes file from Cloudinary

---

### STEP 3 — Team Lead Only: PR team branch → develop

Once all Phase 3 feature PRs are approved and merged into `team-05-programs-welfare-media`, the Team Lead opens one PR:

**PR:** `team-05-programs-welfare-media → develop`

This PR is opened only when the Phase 3 exit criteria above are fully met.

---

## Phase 4 — Bug Fixes & Verification (Days 17–19: May 21–24)

Fix all issues from QA regression. No new features — fixes only.

```bash
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media
git checkout -b fix/pwm-[description]
git push origin fix/pwm-[description]

# Fix → commit → push → PR
git add .
git commit -m "fix(pwm): [describe the fix]"
git push origin fix/pwm-[description]
# Open Pull Request → team-05-programs-welfare-media
```

**End-to-end Cloudinary verification checklist:**

```
1. POST /media/:id/upload with a real MP3 file
   → Response contains fileUrl (https://res.cloudinary.com/...)
   → Response contains public_id (chms-media/abc123...)
2. Open fileUrl in browser → file plays/downloads correctly
3. DELETE /media/:id
   → Check Cloudinary dashboard → file no longer exists
```

---

## Cloudinary Upload Pattern (Your Standard)

```js
// In your service — always store BOTH url and public_id
const { url, public_id } = await uploadToCloud(
  file.buffer,
  "chms-media",
  resourceType,
);
mediaResource.fileUrl = url; // Cloudinary HTTPS URL
mediaResource.public_id = public_id; // Required for future deletion
await mediaResource.save();

// To delete from Cloudinary later
await cloudinary.uploader.destroy(media.public_id, { resource_type: "auto" });
```

---

## Escalation Path

1. Schema issue → DB Lead (Team 1)
2. Auth/RBAC issue → Auth Lead (Team 2)
3. Cloudinary config issue → DevOps (Team 6)
4. Scope question → API Lead C → Admin

---

_ChMS Capstone Project | Team 05: Programs, Welfare & Media | Version 2.1 | May 2026_
