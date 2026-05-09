# ChMS Capstone Project

## Team Implementation Plan — Core API — Membership & Org

### Extracted from Document VI: Master Implementation Plan

---

| Field      | Detail                                         |
| ---------- | ---------------------------------------------- |
| Team       | Team 03 — Core API — Membership & Org          |
| Members    | API Dev A1, API Dev A2, API Dev A3, API Dev A4 |
| Lead       | API Lead A                                     |
| Version    | 2.0                                            |
| Date       | May 5, 2026                                    |
| Submission | May 24, 2026                                   |

> This is your team's primary daily reference. It contains your phase-by-phase tasks, exit criteria, copy-paste implementation code, and exact git commands. For full system context refer to the master control documents (Doc I–VI).

---

## Branch Structure

This project uses a **3-tier branch model**. Understand this before writing a single line of code:

```
main                              ← General admin only. Final submission. Do not touch.
  └── develop                     ← API Lead A PRs here when a phase is complete and verified.
        └── team-03-membership-org    ← Your team's working branch. All feature branches stem from here.
              └── feature/membership-prep             ← Phase 1 prep (all devs)
              └── feature/membership-member-crud      ← API Dev A1, A3, A4
              └── feature/membership-org-units        ← API Dev A2
              └── feature/membership-fellowships      ← API Dev A3
              └── feature/membership-staff            ← API Dev A1
              └── feature/membership-announcements    ← API Dev A2
              └── feature/membership-missions         ← API Dev A3, A4
```

**The rules:**

- Contributors **never** push directly to `develop` or `main`
- Contributors **never** branch off `develop` — always branch off `team-03-membership-org`
- API Lead A reviews and merges all PRs into `team-03-membership-org`
- API Lead A opens the PR from `team-03-membership-org` → `develop` only when the phase is confirmed done and ready for integration

---

## Your Team's Scope

**You own:** Members, Organizational Units, Fellowships, Staff, Announcements, and Missions. You are the largest API team. Your Phase 2 output forms the backbone of the church's people-management capability.

---

## Phase 1 — Preparation (Days 1–3: May 5–7)

### STEP 1 — Get Latest Team Branch and Create Your Preparation Branch

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git checkout -b feature/membership-prep
git push origin feature/membership-prep
```

### Activities

- Review DB Team's schemas for `Member`, `OrgUnit`, `Fellowship`, `Staff`, `Announcement`, `Mission` in `src/models/` — flag any wrong field names or missing enums to DB Lead immediately
- Create your Postman collection shell: add folders for Members, Org Units, Fellowships, Staff, Announcements, Missions
- Re-read Doc II Section 3.2 and 3.5 for your endpoint contracts
- Agree within the team on who owns what for Phase 2 before Day 4 (use the assignments in Phase 2 below)

> Phase 1 produces no merged code. Use this time to prepare so Phase 2 starts at full speed on Day 4.

---

## Phase 2 — Core Membership APIs (Days 4–10: May 8–14)

---

## MEMBER CRUD (Days 4–6) — API Dev A1, A2, A3, A4

### STEP 1 — Branch Setup (all four devs, each on their own branch)

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org

git checkout -b feature/membership-member-crud     # API Dev A1, A3, A4
# OR
git checkout -b feature/membership-org-units       # API Dev A2 (also covers T-MA-005, T-MA-006)

# Push immediately
git push origin feature/membership-member-crud
git push origin feature/membership-org-units
```

---

### T-MA-001 — GET /members (API Dev A1)

**Branch:** `feature/membership-member-crud`

Create `src/validators/member.validator.js`:

```js
const Joi = require("joi");

const createMemberSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().optional(),
  phone: Joi.string().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dateOfBirth: Joi.date().optional(),
  address: Joi.string().optional(),
  memberStatus: Joi.string()
    .valid("active", "inactive", "visitor", "transferred")
    .optional(),
  fellowshipId: Joi.string().optional(),
  joinDate: Joi.date().optional(),
});

const updateMemberSchema = createMemberSchema.fork(
  ["firstName", "lastName"],
  (field) => field.optional(),
);

module.exports = { createMemberSchema, updateMemberSchema };
```

Create `src/services/member.service.js`:

```js
const Member = require("../models/Member");

const getAllMembers = async ({
  page = 1,
  limit = 20,
  status,
  fellowshipId,
}) => {
  const filter = { isActive: true };
  if (status) filter.memberStatus = status;
  if (fellowshipId) filter.fellowshipId = fellowshipId;

  const skip = (page - 1) * limit;
  const total = await Member.countDocuments(filter);
  const data = await Member.find(filter)
    .lean()
    .sort({ lastName: 1, firstName: 1 })
    .skip(skip)
    .limit(Number(limit));

  return { total, page: Number(page), limit: Number(limit), data };
};

const getMemberById = async (id) => {
  const member = await Member.findOne({ _id: id, isActive: true }).populate(
    "fellowshipId",
    "name meetingDay location",
  );
  if (!member) throw new Error("Member not found.");
  return member;
};

const createMember = async (data, profileImageUrl) => {
  if (profileImageUrl) data.profileImage = profileImageUrl;
  return Member.create(data);
};

const updateMember = async (id, data) => {
  const member = await Member.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!member) throw new Error("Member not found.");
  return member;
};

const deleteMember = async (id) => {
  const member = await Member.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!member) throw new Error("Member not found.");
};

const getMemberAttendance = async (id, { page = 1, limit = 20 }) => {
  const Attendance = require("../models/Attendance");
  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments({ memberId: id });
  const data = await Attendance.find({ memberId: id })
    .populate("eventId", "title date type location")
    .sort({ checkedInAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberAttendance,
};
```

Create `src/controllers/member.controller.js`:

```js
const memberService = require("../services/member.service");
const uploadToCloud = require("../utils/uploadToCloud");
const {
  createMemberSchema,
  updateMemberSchema,
} = require("../validators/member.validator");

const getMembers = async (req, res) => {
  try {
    const result = await memberService.getAllMembers(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getMember = async (req, res) => {
  try {
    const member = await memberService.getMemberById(req.params.id);
    return res.status(200).json({ success: true, data: member });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { error } = createMemberSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    let profileImageUrl = null;
    if (req.file) {
      const uploaded = await uploadToCloud(req.file.buffer, "chms-profiles");
      profileImageUrl = uploaded.url;
    }

    const member = await memberService.createMember(req.body, profileImageUrl);
    return res.status(201).json({ success: true, data: member });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { error } = updateMemberSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const member = await memberService.updateMember(req.params.id, req.body);
    return res.status(200).json({ success: true, data: member });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    await memberService.deleteMember(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Member deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const getMemberAttendance = async (req, res) => {
  try {
    const result = await memberService.getMemberAttendance(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getMemberAttendance,
};
```

Create `src/routes/member.routes.js`:

```js
const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/upload");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  memberController.getMembers,
);

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  upload.single("profileImage"),
  memberController.createMember,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  memberController.getMember,
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  memberController.updateMember,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  memberController.deleteMember,
);

router.get(
  "/:id/attendance",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  memberController.getMemberAttendance,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const memberRoutes = require("./routes/member.routes");
app.use("/api/v1/members", memberRoutes);
```

**Git commands after completing Member CRUD:**

```bash
git add src/validators/member.validator.js \
        src/services/member.service.js \
        src/controllers/member.controller.js \
        src/routes/member.routes.js
git commit -m "feat(members): add Member CRUD with pagination, soft-delete, profile image upload"
git push origin feature/membership-member-crud
# Open Pull Request: feature/membership-member-crud → team-03-membership-org
```

**After API Lead A approves and merges into the team branch:**

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d feature/membership-member-crud
```

---

## ORG UNITS (Days 4–6) — API Dev A1, A2

### T-MA-005 & T-MA-006 — CRUD /org-units + Leader Assignment (API Dev A2)

**Branch:** `feature/membership-org-units`

Create `src/services/orgUnit.service.js`:

```js
const OrganizationalUnit = require("../models/OrganizationalUnit");
const User = require("../models/User");

const getAllOrgUnits = async ({ page = 1, limit = 20, type }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const total = await OrganizationalUnit.countDocuments(filter);
  const data = await OrganizationalUnit.find(filter)
    .populate("leaderId", "firstName lastName role")
    .populate("parentId", "name type")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getOrgUnitById = async (id) => {
  const unit = await OrganizationalUnit.findOne({ _id: id, isActive: true })
    .populate("leaderId", "firstName lastName role")
    .populate("parentId", "name type");
  if (!unit) throw new Error("Organizational unit not found.");
  return unit;
};

const createOrgUnit = async (data) => {
  return OrganizationalUnit.create(data);
};

const updateOrgUnit = async (id, data) => {
  const unit = await OrganizationalUnit.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!unit) throw new Error("Organizational unit not found.");
  return unit;
};

const deleteOrgUnit = async (id) => {
  // Block delete if active children exist
  const children = await OrganizationalUnit.countDocuments({
    parentId: id,
    isActive: true,
  });
  if (children > 0)
    throw new Error(
      "Cannot delete unit with active sub-units. Deactivate children first.",
    );

  const unit = await OrganizationalUnit.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!unit) throw new Error("Organizational unit not found.");
};

const assignLeader = async (id, leaderId) => {
  const leader = await User.findOne({ _id: leaderId, isActive: true });
  if (!leader) throw new Error("Leader not found or inactive.");

  const unit = await OrganizationalUnit.findOneAndUpdate(
    { _id: id, isActive: true },
    { leaderId },
    { new: true },
  ).populate("leaderId", "firstName lastName role");
  if (!unit) throw new Error("Organizational unit not found.");
  return unit;
};

module.exports = {
  getAllOrgUnits,
  getOrgUnitById,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit,
  assignLeader,
};
```

Create `src/controllers/orgUnit.controller.js`:

```js
const orgUnitService = require("../services/orgUnit.service");

const getOrgUnits = async (req, res) => {
  try {
    const result = await orgUnitService.getAllOrgUnits(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getOrgUnit = async (req, res) => {
  try {
    const unit = await orgUnitService.getOrgUnitById(req.params.id);
    return res.status(200).json({ success: true, data: unit });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createOrgUnit = async (req, res) => {
  try {
    const unit = await orgUnitService.createOrgUnit(req.body);
    return res.status(201).json({ success: true, data: unit });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateOrgUnit = async (req, res) => {
  try {
    const unit = await orgUnitService.updateOrgUnit(req.params.id, req.body);
    return res.status(200).json({ success: true, data: unit });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteOrgUnit = async (req, res) => {
  try {
    await orgUnitService.deleteOrgUnit(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Unit deactivated." });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const assignLeader = async (req, res) => {
  try {
    const { leaderId } = req.body;
    if (!leaderId)
      return res
        .status(400)
        .json({ success: false, error: "leaderId is required." });
    const unit = await orgUnitService.assignLeader(req.params.id, leaderId);
    return res.status(200).json({ success: true, data: unit });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getOrgUnits,
  getOrgUnit,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit,
  assignLeader,
};
```

Create `src/routes/orgUnit.routes.js`:

```js
const express = require("express");
const router = express.Router();
const orgUnitController = require("../controllers/orgUnit.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  orgUnitController.getOrgUnits,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.createOrgUnit,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  orgUnitController.getOrgUnit,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.updateOrgUnit,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.deleteOrgUnit,
);
router.post(
  "/:id/assign-leader",
  authenticate,
  authorizeRoles("admin"),
  orgUnitController.assignLeader,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const orgUnitRoutes = require("./routes/orgUnit.routes");
app.use("/api/v1/org-units", orgUnitRoutes);
```

**Git commands:**

```bash
git add src/services/orgUnit.service.js \
        src/controllers/orgUnit.controller.js \
        src/routes/orgUnit.routes.js
git commit -m "feat(org-units): add Org Unit CRUD with leader assignment and child-block on delete"
git push origin feature/membership-org-units
# Open Pull Request: feature/membership-org-units → team-03-membership-org
```

**After API Lead A approves and merges into the team branch:**

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d feature/membership-org-units
```

---

## FELLOWSHIPS (Days 4–6) — API Dev A3

### T-MA-007 & T-MA-008 — CRUD /fellowships + Member List

**Branch:** `feature/membership-fellowships`

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git checkout -b feature/membership-fellowships
git push origin feature/membership-fellowships
```

Create `src/services/fellowship.service.js`:

```js
const Fellowship = require("../models/Fellowship");
const Member = require("../models/Member");

const getAllFellowships = async ({ page = 1, limit = 20, unitId }) => {
  const filter = { isActive: true };
  if (unitId) filter.unitId = unitId;
  const skip = (page - 1) * limit;
  const total = await Fellowship.countDocuments(filter);
  const data = await Fellowship.find(filter)
    .populate("unitId", "name type")
    .populate("leaderId", "firstName lastName")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getFellowshipById = async (id) => {
  const f = await Fellowship.findOne({ _id: id, isActive: true })
    .populate("unitId", "name type")
    .populate("leaderId", "firstName lastName phone");
  if (!f) throw new Error("Fellowship not found.");
  return f;
};

const createFellowship = async (data) => Fellowship.create(data);

const updateFellowship = async (id, data) => {
  const f = await Fellowship.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!f) throw new Error("Fellowship not found.");
  return f;
};

const deleteFellowship = async (id) => {
  const f = await Fellowship.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!f) throw new Error("Fellowship not found.");
};

const getFellowshipMembers = async (id, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const filter = { fellowshipId: id, isActive: true };
  const total = await Member.countDocuments(filter);
  const data = await Member.find(filter)
    .select("firstName lastName phone memberStatus")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = {
  getAllFellowships,
  getFellowshipById,
  createFellowship,
  updateFellowship,
  deleteFellowship,
  getFellowshipMembers,
};
```

Create `src/controllers/fellowship.controller.js`:

```js
const fellowshipService = require("../services/fellowship.service");

const getFellowships = async (req, res) => {
  try {
    const result = await fellowshipService.getAllFellowships(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getFellowship = async (req, res) => {
  try {
    const f = await fellowshipService.getFellowshipById(req.params.id);
    return res.status(200).json({ success: true, data: f });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createFellowship = async (req, res) => {
  try {
    const f = await fellowshipService.createFellowship(req.body);
    return res.status(201).json({ success: true, data: f });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateFellowship = async (req, res) => {
  try {
    const f = await fellowshipService.updateFellowship(req.params.id, req.body);
    return res.status(200).json({ success: true, data: f });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteFellowship = async (req, res) => {
  try {
    await fellowshipService.deleteFellowship(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Fellowship deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const getFellowshipMembers = async (req, res) => {
  try {
    const result = await fellowshipService.getFellowshipMembers(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getFellowships,
  getFellowship,
  createFellowship,
  updateFellowship,
  deleteFellowship,
  getFellowshipMembers,
};
```

Create `src/routes/fellowship.routes.js`:

```js
const express = require("express");
const router = express.Router();
const fellowshipController = require("../controllers/fellowship.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  fellowshipController.getFellowships,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  fellowshipController.createFellowship,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  fellowshipController.getFellowship,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  fellowshipController.updateFellowship,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  fellowshipController.deleteFellowship,
);
router.get(
  "/:id/members",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  fellowshipController.getFellowshipMembers,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const fellowshipRoutes = require("./routes/fellowship.routes");
app.use("/api/v1/fellowships", fellowshipRoutes);
```

**Git commands:**

```bash
git add src/services/fellowship.service.js \
        src/controllers/fellowship.controller.js \
        src/routes/fellowship.routes.js
git commit -m "feat(fellowships): add Fellowship CRUD and paginated member list"
git push origin feature/membership-fellowships
# Open Pull Request: feature/membership-fellowships → team-03-membership-org
```

**After API Lead A approves and merges into the team branch:**

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d feature/membership-fellowships
```

---

## STAFF (Days 7–9) — API Dev A1

### T-MA-009 — CRUD /staff

**Branch:** `feature/membership-staff`

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git checkout -b feature/membership-staff
git push origin feature/membership-staff
```

Create `src/services/staff.service.js`:

```js
const Staff = require("../models/Staff");

const getAllStaff = async ({
  page = 1,
  limit = 20,
  department,
  isVolunteer,
}) => {
  const filter = { isActive: true };
  if (department) filter.department = department;
  if (isVolunteer !== undefined) filter.isVolunteer = isVolunteer === "true";
  const skip = (page - 1) * limit;
  const total = await Staff.countDocuments(filter);
  const data = await Staff.find(filter)
    .populate("userId", "firstName lastName email role")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getStaffById = async (id) => {
  const s = await Staff.findOne({ _id: id, isActive: true }).populate(
    "userId",
    "firstName lastName email role phone",
  );
  if (!s) throw new Error("Staff record not found.");
  return s;
};

const createStaff = async (data) => Staff.create(data);

const updateStaff = async (id, data) => {
  const s = await Staff.findOneAndUpdate({ _id: id, isActive: true }, data, {
    new: true,
    runValidators: true,
  });
  if (!s) throw new Error("Staff record not found.");
  return s;
};

const deleteStaff = async (id) => {
  const s = await Staff.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!s) throw new Error("Staff record not found.");
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
```

Create `src/controllers/staff.controller.js`:

```js
const staffService = require("../services/staff.service");

const getStaff = async (req, res) => {
  try {
    const result = await staffService.getAllStaff(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const s = await staffService.getStaffById(req.params.id);
    return res.status(200).json({ success: true, data: s });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const s = await staffService.createStaff(req.body);
    return res.status(201).json({ success: true, data: s });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const s = await staffService.updateStaff(req.params.id, req.body);
    return res.status(200).json({ success: true, data: s });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    await staffService.deleteStaff(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Staff record deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
```

Create `src/routes/staff.routes.js`:

```js
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  staffController.getStaff,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  staffController.createStaff,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  staffController.getStaffById,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  staffController.updateStaff,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  staffController.deleteStaff,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const staffRoutes = require("./routes/staff.routes");
app.use("/api/v1/staff", staffRoutes);
```

**Git commands:**

```bash
git add src/services/staff.service.js \
        src/controllers/staff.controller.js \
        src/routes/staff.routes.js
git commit -m "feat(staff): add Staff CRUD with optional User linkage and pagination"
git push origin feature/membership-staff
# Open Pull Request: feature/membership-staff → team-03-membership-org
```

**After API Lead A approves and merges into the team branch:**

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d feature/membership-staff
```

> Each developer runs the cleanup block for their own branch once their PR is merged. Reference:
>
> - API Dev A1, A3, A4 → `git branch -d feature/membership-member-crud`
> - API Dev A2 → `git branch -d feature/membership-org-units`
> - API Dev A3 → `git branch -d feature/membership-fellowships`
> - API Dev A1 → `git branch -d feature/membership-staff`

---

**Phase 2 Exit Criteria:**

- [ ] All member endpoints tested — CRUD, soft-delete, profile image upload, attendance history
- [ ] Org unit hierarchy works — parent/child and leader assignment tested
- [ ] Delete org unit with active children returns 400
- [ ] Fellowship member list returns correct paginated results
- [ ] Staff CRUD with optional User linkage confirmed
- [ ] All routes protected by `authenticate` + `authorizeRoles` — verify with Team 2

---

## Phase 3 — Announcements & Missions (Days 11–16: May 15–20)

### STEP 1 — Branch Setup

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org

git checkout -b feature/membership-announcements   # API Dev A2
git push origin feature/membership-announcements

git checkout -b feature/membership-missions        # API Dev A3, A4
git push origin feature/membership-missions
```

---

### T-MA-010 — CRUD /announcements (API Dev A2)

**Branch:** `feature/membership-announcements`

Create `src/services/announcement.service.js`:

```js
const Announcement = require("../models/Announcement");

const getAllAnnouncements = async ({ page = 1, limit = 20, audience }) => {
  const now = new Date();
  // Only return published announcements (publishedAt <= now) in public list
  const filter = { isActive: true, publishedAt: { $lte: now } };
  if (audience && audience !== "all")
    filter.audience = { $in: [audience, "all"] };

  const skip = (page - 1) * limit;
  const total = await Announcement.countDocuments(filter);
  const data = await Announcement.find(filter)
    .populate("createdBy", "firstName lastName role")
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getAnnouncementById = async (id) => {
  const a = await Announcement.findOne({ _id: id, isActive: true }).populate(
    "createdBy",
    "firstName lastName role",
  );
  if (!a) throw new Error("Announcement not found.");
  return a;
};

const createAnnouncement = async (data, userId) => {
  return Announcement.create({ ...data, createdBy: userId });
};

const updateAnnouncement = async (id, data) => {
  const a = await Announcement.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!a) throw new Error("Announcement not found.");
  return a;
};

const deleteAnnouncement = async (id) => {
  const a = await Announcement.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!a) throw new Error("Announcement not found.");
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
```

Create `src/controllers/announcement.controller.js`:

```js
const announcementService = require("../services/announcement.service");

const getAnnouncements = async (req, res) => {
  try {
    const result = await announcementService.getAllAnnouncements(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getAnnouncement = async (req, res) => {
  try {
    const a = await announcementService.getAnnouncementById(req.params.id);
    return res.status(200).json({ success: true, data: a });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const a = await announcementService.createAnnouncement(
      req.body,
      req.user._id,
    );
    return res.status(201).json({ success: true, data: a });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const a = await announcementService.updateAnnouncement(
      req.params.id,
      req.body,
    );
    return res.status(200).json({ success: true, data: a });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Announcement deleted." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
```

Create `src/routes/announcement.routes.js`:

```js
const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcement.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get("/", authenticate, announcementController.getAnnouncements);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  announcementController.createAnnouncement,
);
router.get("/:id", authenticate, announcementController.getAnnouncement);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  announcementController.updateAnnouncement,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  announcementController.deleteAnnouncement,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const announcementRoutes = require("./routes/announcement.routes");
app.use("/api/v1/announcements", announcementRoutes);
```

**Git commands:**

```bash
git add src/services/announcement.service.js \
        src/controllers/announcement.controller.js \
        src/routes/announcement.routes.js
git commit -m "feat(announcements): add Announcement CRUD with publishedAt filter and audience targeting"
git push origin feature/membership-announcements
# Open Pull Request: feature/membership-announcements → team-03-membership-org
```

**After API Lead A approves and merges into the team branch:**

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d feature/membership-announcements
```

---

### T-MA-011 & T-MA-012 — CRUD /missions + Volunteers (API Dev A3, A4)

**Branch:** `feature/membership-missions`

Create `src/services/mission.service.js`:

```js
const Mission = require("../models/Mission");
const User = require("../models/User");

const getAllMissions = async ({ page = 1, limit = 20, status }) => {
  const filter = { isActive: true };
  if (status) filter.status = status;
  const skip = (page - 1) * limit;
  const total = await Mission.countDocuments(filter);
  const data = await Mission.find(filter)
    .populate("volunteers", "firstName lastName role")
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getMissionById = async (id) => {
  const m = await Mission.findOne({ _id: id, isActive: true }).populate(
    "volunteers",
    "firstName lastName email role",
  );
  if (!m) throw new Error("Mission not found.");
  return m;
};

const createMission = async (data) => Mission.create(data);

const updateMission = async (id, data) => {
  const m = await Mission.findOneAndUpdate({ _id: id, isActive: true }, data, {
    new: true,
    runValidators: true,
  });
  if (!m) throw new Error("Mission not found.");
  return m;
};

const deleteMission = async (id) => {
  const m = await Mission.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!m) throw new Error("Mission not found.");
};

const addVolunteer = async (missionId, volunteerId) => {
  const volunteer = await User.findOne({ _id: volunteerId, isActive: true });
  if (!volunteer) throw new Error("Volunteer (User) not found or inactive.");

  const m = await Mission.findOneAndUpdate(
    { _id: missionId, isActive: true },
    { $addToSet: { volunteers: volunteerId } }, // $addToSet prevents duplicates
    { new: true },
  ).populate("volunteers", "firstName lastName role");
  if (!m) throw new Error("Mission not found.");
  return m;
};

const getVolunteers = async (missionId) => {
  const m = await Mission.findOne({ _id: missionId, isActive: true }).populate(
    "volunteers",
    "firstName lastName email role phone",
  );
  if (!m) throw new Error("Mission not found.");
  return m.volunteers;
};

module.exports = {
  getAllMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
  addVolunteer,
  getVolunteers,
};
```

Create `src/controllers/mission.controller.js`:

```js
const missionService = require("../services/mission.service");

const getMissions = async (req, res) => {
  try {
    const result = await missionService.getAllMissions(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getMission = async (req, res) => {
  try {
    const m = await missionService.getMissionById(req.params.id);
    return res.status(200).json({ success: true, data: m });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createMission = async (req, res) => {
  try {
    const m = await missionService.createMission(req.body);
    return res.status(201).json({ success: true, data: m });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateMission = async (req, res) => {
  try {
    const m = await missionService.updateMission(req.params.id, req.body);
    return res.status(200).json({ success: true, data: m });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteMission = async (req, res) => {
  try {
    await missionService.deleteMission(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Mission deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const addVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    if (!volunteerId)
      return res
        .status(400)
        .json({ success: false, error: "volunteerId is required." });
    const m = await missionService.addVolunteer(req.params.id, volunteerId);
    return res.status(200).json({ success: true, data: m });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await missionService.getVolunteers(req.params.id);
    return res.status(200).json({ success: true, data: volunteers });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

module.exports = {
  getMissions,
  getMission,
  createMission,
  updateMission,
  deleteMission,
  addVolunteer,
  getVolunteers,
};
```

Create `src/routes/mission.routes.js`:

```js
const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const authenticate = require("../middlewares/authenticate");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  missionController.getMissions,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "pastor"),
  missionController.createMission,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  missionController.getMission,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "pastor"),
  missionController.updateMission,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  missionController.deleteMission,
);
router.post(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("admin", "pastor"),
  missionController.addVolunteer,
);
router.get(
  "/:id/volunteers",
  authenticate,
  authorizeRoles("admin", "pastor", "staff"),
  missionController.getVolunteers,
);

module.exports = router;
```

Mount in `src/app.js`:

```js
const missionRoutes = require("./routes/mission.routes");
app.use("/api/v1/missions", missionRoutes);
```

**Git commands:**

```bash
git add src/services/mission.service.js \
        src/controllers/mission.controller.js \
        src/routes/mission.routes.js
git commit -m "feat(missions): add Mission CRUD, volunteer add/list with duplicate prevention"
git push origin feature/membership-missions
# Open Pull Request: feature/membership-missions → team-03-membership-org
```

**After API Lead A approves and merges into the team branch:**

```bash
# API Dev A2
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d feature/membership-announcements

# API Dev A3, A4
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d feature/membership-missions
```

---

**Phase 3 Exit Criteria:**

- [ ] Announcements: future-dated `publishedAt` not returned in GET list — confirmed
- [ ] Audience filter works for `all`, `zone`, `fellowship`, `staff`
- [ ] Mission status transitions tested: `planned → active → completed`
- [ ] Volunteer `$addToSet` prevents duplicate volunteer on same mission

---

## Phase 4 — Bug Fixes & PR Cleanup (Days 17–19: May 21–24)

Fix all issues raised by QA regression (T-QA-004). No new features — fixes only.

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git checkout -b fix/membership-[description]
git push origin fix/membership-[description]

# Fix → commit → push → PR
git add .
git commit -m "fix(membership): [describe the fix]"
git push origin fix/membership-[description]
# Open Pull Request: fix/membership-[description] → team-03-membership-org
```

**After API Lead A approves and merges into the team branch:**

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
git branch -d fix/membership-[description]
```

**After all fix PRs are merged, API Lead A opens the final PR: `team-03-membership-org` → `develop`.**

---

## Coding Standards Reminders

```js
// Controller — thin. Delegate everything.
const getMembers = async (req, res) => {
  try {
    const result = await memberService.getAllMembers(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Service — all logic lives here
const getAllMembers = async ({
  page = 1,
  limit = 20,
  status,
  fellowshipId,
}) => {
  const filter = { isActive: true };
  if (status) filter.memberStatus = status;
  if (fellowshipId) filter.fellowshipId = fellowshipId;
  const skip = (page - 1) * limit;
  return Member.find(filter).lean().skip(skip).limit(Number(limit));
};
```

---

## Escalation Path

1. Schema issue → contact DB Lead (Team 1) directly
2. Auth middleware issue → contact Auth Lead (Team 2) directly
3. Scope/requirement question → API Lead A → Admin

---

_ChMS Capstone Project | Team 03: Membership & Org | Version 2.0 | May 2026_
