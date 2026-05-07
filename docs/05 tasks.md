# ChMS Capstone Project
## Document V — Task Register
### Granular Tasks Mapped to Features, Layers, and Phases

---

| Field | Detail |
|---|---|
| Version | 1.0 |
| Date | May 5, 2026 |

> Task IDs: `T-{LAYER}-{NUMBER}`. Layers: DV (DevOps), DB (Database), AU (Auth), MA (Membership API), MB (Finance/Events API), MC (Programs/Welfare/Media API), QA, AD (Admin). **Assigned To** filled by Admin at kick-off.

---

## Phase 1 — Foundation & Setup (Days 1–3: May 5–7)

| Task ID | Feature | Description | Layer | Assigned To | Est. Hrs |
|---|---|---|---|---|---|
| T-DV-001 | — | Initialize GitHub repo; create main and develop branches; enable branch protection rules | DevOps/Admin | Admin | 2 |
| T-DV-002 | — | Commit mandatory folder structure, .gitignore, .env.example, README.md to develop | DevOps | DevOps Dev 1 | 3 |
| T-DV-003 | — | Configure MongoDB Atlas connection (config/db.js) with error handling and reconnect | DB Team | DB Dev 1 | 2 |
| T-DV-004 | — | Configure Cloudinary (config/cloudinary.js); build and test uploadToCloud utility | DB Team | DB Dev 2 | 2 |
| T-DV-005 | — | Set up Express app (app.js, server.js): CORS, body-parser, global error handler, health check | DevOps | DevOps Dev 2 | 3 |
| T-DB-001 | F-001 | Create User schema: role enum, hashed password, isActive, lastLogin, timestamps | DB Team | DB Dev 1 | 2 |
| T-DB-002 | F-002 | Create Member schema: status enum, fellowshipId ref, sparse email index, timestamps | DB Team | DB Dev 2 | 2 |
| T-DB-003 | F-003 | Create OrganizationalUnit schema: type enum, self-referential parentId, leaderId ref | DB Team | DB Dev 3 | 2 |
| T-DB-004 | F-004 | Create Fellowship schema: unitId ref, leaderId (Member), meetingDay enum | DB Team | DB Dev 4 | 2 |
| T-DB-005 | F-005 | Create Staff schema: userId ref (optional), position, department, isVolunteer, hireDate | DB Team | DB Dev 1 | 1 |
| T-DB-006 | F-006 | Create Event schema: type enum, date, location, createdBy ref, isActive | DB Team | DB Dev 2 | 2 |
| T-DB-007 | F-007 | Create Attendance schema: eventId + memberId refs, compound unique index, method enum | DB Team | DB Dev 3 | 2 |
| T-DB-008 | F-008 | Create ServiceContribution schema: category enum, channel enum, totalAmount — NO memberId | DB Team | DB Dev 4 | 2 |
| T-DB-009 | F-008 | Create Expense schema: category enum, amount, vendorId ref, receiptUrl, approvedBy | DB Team | DB Dev 1 | 2 |
| T-DB-010 | F-009 | Create InventoryItem schema: quantity, unitCost, vendorId ref; create Vendor schema | DB Team | DB Dev 2 | 2 |
| T-DB-011 | F-010 | Create WelfareCase schema: memberId ref, type enum, status enum, supportLog[] subdocument | DB Team | DB Dev 3 | 2 |
| T-DB-012 | F-011 | Create Program schema: type enum, sessions array (sessionNumber, date, facilitator) | DB Team | DB Dev 4 | 2 |
| T-DB-013 | F-011 | Create ProgramEnrollment schema: programId ref, memberId ref, status enum, outcomes | DB Team | DB Dev 1 | 2 |
| T-DB-014 | F-012 | Create Announcement schema: audience enum, publishedAt, channels array | DB Team | DB Dev 2 | 1 |
| T-DB-015 | F-014 | Create MediaResource schema: type enum, fileUrl, public_id, price, quantity | DB Team | DB Dev 3 | 1 |
| T-DB-016 | F-015 | Create Mission schema: budget, location, startDate, endDate, volunteers[], status enum | DB Team | DB Dev 4 | 1 |
| T-DB-017 | F-016 | Create AuditLog schema: userId, action, entity, entityId, changes, ip, timestamp | DB Team | DB Dev 1 | 2 |
| T-AU-001 | F-001 | Build JWT utility: generateAccessToken(), generateRefreshToken(), verifyToken() | Auth Team | Auth Dev 1 | 3 |
| T-AU-002 | F-001 | Build authenticate middleware: extract/verify Bearer token; attach user to req.user | Auth Team | Auth Dev 2 | 3 |
| T-AU-003 | F-001 | Build authorizeRoles(...roles) middleware: check req.user.role against allowed roles | Auth Team | Auth Dev 3 | 3 |
| T-AU-004 | F-001 | POST /auth/register: admin-only; validate body; hash password (bcrypt 12 rounds) | Auth Team | Auth Dev 1 | 3 |
| T-AU-005 | F-001 | POST /auth/login: credential check; issue tokens; rate limiting (10 req/15 min) | Auth Team | Auth Dev 2 | 4 |
| T-AU-006 | F-001 | POST /auth/refresh, /auth/logout, /auth/change-password | Auth Team | Auth Dev 3 | 4 |

---

## Phase 2 — Core MVP APIs (Days 4–10: May 8–14)

| Task ID | Feature | Description | Layer | Assigned To | Est. Hrs |
|---|---|---|---|---|---|
| T-MA-001 | F-002 | GET /members: paginated list; filters by status and fellowshipId; lean query | API Lead A | API Dev A1 | 4 |
| T-MA-002 | F-002 | POST /members: create member; validate body; optional profile image via Cloudinary | API Lead A | API Dev A2 | 4 |
| T-MA-003 | F-002 | GET/PUT/DELETE /members/:id — CRUD with soft-delete | API Lead A | API Dev A3 | 4 |
| T-MA-004 | F-002 | GET /members/:id/attendance: paginated attendance history for a member | API Lead A | API Dev A4 | 3 |
| T-MA-005 | F-003 | CRUD /org-units (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead A | API Dev A1 | 4 |
| T-MA-006 | F-003 | POST /org-units/:id/assign-leader: validate leaderId as active User; update | API Lead A | API Dev A2 | 2 |
| T-MA-007 | F-004 | CRUD /fellowships (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead A | API Dev A3 | 4 |
| T-MA-008 | F-004 | GET /fellowships/:id/members: paginated member list for a fellowship | API Lead A | API Dev A4 | 3 |
| T-MA-009 | F-005 | CRUD /staff (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead A | API Dev A1 | 4 |
| T-MB-001 | F-008 | POST /finance/contributions: validate body; record service total with category/channel | API Lead B | API Dev B1 | 4 |
| T-MB-002 | F-008 | GET /finance/contributions: list with date, category, channel filters; paginated | API Lead B | API Dev B2 | 3 |
| T-MB-003 | F-008 | POST /finance/expenses: log expense; optional receipt upload via Cloudinary | API Lead B | API Dev B3 | 4 |
| T-MB-004 | F-008 | GET /finance/expenses: list with date and category filters; paginated | API Lead B | API Dev B4 | 3 |
| T-MB-005 | F-008 | GET /finance/summary: aggregate income, expenses, net balance, category breakdown | API Lead B | API Dev B1 | 5 |
| T-MB-006 | F-006 | CRUD /events (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead B | API Dev B2 | 4 |
| T-MB-007 | F-006 | GET /events?from=&to=: date range calendar filter on event.date | API Lead B | API Dev B3 | 3 |
| T-MB-008 | F-007 | POST /events/:id/attendance: single and bulk memberIds; enforce compound unique index | API Lead B | API Dev B4 | 5 |
| T-MB-009 | F-007 | GET /events/:id/attendance: paginated attendance list for an event | API Lead B | API Dev B1 | 3 |
| T-MC-001 | F-009 | CRUD /inventory (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead C | API Dev C1 | 4 |
| T-MC-002 | F-009 | PUT /inventory/:id/link-expense: link item to existing expense record | API Lead C | API Dev C2 | 3 |
| T-MC-003 | F-009 | CRUD /vendors (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead C | API Dev C3 | 4 |
| T-MC-004 | F-010 | CRUD /welfare: case creation and status management | API Lead C | API Dev C1 | 4 |
| T-MC-005 | F-010 | POST /welfare/:id/support-log + GET /welfare/:id/support-log | API Lead C | API Dev C2 | 4 |
| T-QA-001 | — | Build and share Postman collection for all Phase 2 endpoints | QA Team | QA Dev 1 | 6 |
| T-QA-002 | F-001 | Integration tests: register (admin-only), login (valid/invalid), protected route access | QA Team | QA Dev 2 | 5 |
| T-AD-001 | — | Phase 2 integration checkpoint: review all PRs; merge approved; run regression | Admin | Admin | 4 |

---

## Phase 3 — SHOULD HAVE Features (Days 11–16: May 15–20)

| Task ID | Feature | Description | Layer | Assigned To | Est. Hrs |
|---|---|---|---|---|---|
| T-MC-006 | F-011 | CRUD /programs (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead C | API Dev C3 | 5 |
| T-MC-007 | F-011 | POST /programs/:id/sessions: add session to existing program | API Lead C | API Dev C1 | 3 |
| T-MC-008 | F-011 | POST /programs/:id/enroll: enroll member; enforce maxParticipants | API Lead C | API Dev C2 | 4 |
| T-MC-009 | F-011 | GET /programs/:id/participants: paginated list with enrollment status | API Lead C | API Dev C3 | 3 |
| T-MA-010 | F-012 | CRUD /announcements with audience targeting and publishedAt control | API Lead A | API Dev A2 | 4 |
| T-MB-010 | F-013 | GET /reports/attendance?from=&to=: aggregate counts per event in range | API Lead B | API Dev B2 | 5 |
| T-MB-011 | F-013 | GET /reports/finance?period=: monthly/quarterly/yearly income vs expense | API Lead B | API Dev B3 | 5 |
| T-MB-012 | F-013 | GET /reports/programs: participation counts and completion rates | API Lead B | API Dev B4 | 4 |
| T-MC-010 | F-014 | CRUD /media (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead C | API Dev C1 | 4 |
| T-MC-011 | F-014 | POST /media/:id/upload: Multer → Cloudinary; store URL and public_id; validate file type | API Lead C | API Dev C2 | 5 |
| T-MA-011 | F-015 | CRUD /missions (GET, POST, GET/:id, PUT/:id, DELETE/:id) | API Lead A | API Dev A3 | 4 |
| T-MA-012 | F-015 | POST /missions/:id/volunteers + GET /missions/:id/volunteers | API Lead A | API Dev A4 | 3 |
| T-AU-007 | F-017 | POST /documents/upload: Multer → Cloudinary linked to entity type + entityId | Auth Team | Auth Dev 1 | 4 |
| T-AU-008 | F-017 | GET /documents, GET /documents/:id, DELETE /documents/:id | Auth Team | Auth Dev 2 | 3 |
| T-QA-003 | — | Test all Phase 3 endpoints; verify auth guards on all new routes | QA Team | QA Dev 1 | 6 |

---

## Phase 4 — QA, Polish & Submission (Days 17–19: May 21–24)

| Task ID | Feature | Description | Layer | Assigned To | Est. Hrs |
|---|---|---|---|---|---|
| T-QA-004 | — | Full regression test of all endpoints in develop using Postman collection | QA Team | QA Dev 1+2 | 8 |
| T-AU-009 | F-016 | Wire audit log middleware to finance writes, user management, welfare case changes | Auth Team | Auth Dev 3 | 4 |
| T-AU-010 | F-016 | GET /audit endpoint: paginated, super_admin only | Auth Team | Auth Dev 1 | 3 |
| T-DV-006 | — | Remove all console.log from production paths; verify error handler suppresses stack traces | DevOps | DevOps Dev 1 | 3 |
| T-DV-007 | — | Finalize README: setup, env vars, how to run, API quick reference | DevOps | DevOps Dev 2 | 4 |
| T-AD-002 | — | Final admin review: merge all approved PRs to develop; confirm zero conflicts | Admin | Admin | 3 |
| T-AD-003 | — | PR develop → main; final approval; tag release v1.0 | Admin | Admin | 2 |
| T-AD-004 | — | Submit repository link to supervisor / capstone platform | Admin | Admin | 1 |

---

## Summary

| Phase | Tasks | Est. Hours |
|---|---|---|
| Phase 1 — Foundation | 28 | ~60 hrs |
| Phase 2 — Core MVP | 26 | ~96 hrs |
| Phase 3 — Enhancements | 15 | ~62 hrs |
| Phase 4 — QA & Submission | 8 | ~28 hrs |
| **Total** | **77** | **~246 hrs** |

---

*ChMS Capstone Project | Document V: Task Register | Version 1.0 | May 2026*
