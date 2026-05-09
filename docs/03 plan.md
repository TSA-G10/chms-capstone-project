# ChMS Capstone Project
## Document III — Project Plan
### Phases, Milestones, Timeline & Risk Register

---

| Field | Detail |
|---|---|
| Version | 1.0 |
| Date | May 5, 2026 |
| Submission | May 24, 2026 |
| Duration | 19 Days |

---

## 1. Timeline Overview

```
May 05 ──── May 07     Phase 1: Foundation & Setup         (3 days)
May 08 ──── May 14     Phase 2: Core MVP APIs              (7 days)
May 15 ──── May 20     Phase 3: SHOULD HAVE Features       (6 days)
May 21 ──── May 24     Phase 4: QA, Polish & Submission    (4 days)
```

---

## 2. Phase Breakdown

### Phase 1 — Foundation & Setup (Days 1–3: May 5–7)

> **Goal:** Repo configured, all schemas defined, auth working — before any feature API is written.

| Day | Focus | Deliverable | Owner |
|---|---|---|---|
| Day 1 | Repo + environment | GitHub repo, branch protection, .env.example, folder structure, README | Admin + DB Team |
| Day 2 | All Mongoose schemas | 17 schema files committed to develop | DB Team (4 devs) |
| Day 3 | Auth system | JWT login/register/refresh/logout, RBAC middleware | Auth Team (3 devs) |

**Exit Criteria:**
- [ ] Repo live with main/develop branch protection
- [ ] All schemas merged to develop
- [ ] Auth endpoints functional and tested
- [ ] Every developer has a working local setup

---

### Phase 2 — Core MVP APIs (Days 4–10: May 8–14)

> **Goal:** All MUST HAVE features implemented and tested across 4 parallel tracks.

| Days | Track | Deliverables | Owner |
|---|---|---|---|
| 4–6 | Membership & Org | Member CRUD, Org Units, Fellowship, Staff | API Lead A (4 devs) |
| 4–6 | Finance | Contributions, expenses, finance summary | API Lead B (2 devs) |
| 7–9 | Events & Attendance | Event CRUD, calendar filter, attendance with duplicate guard | API Lead B (2 devs) |
| 7–9 | Welfare & Inventory | Welfare cases, inventory, vendors, expense linkage | API Lead C (3 devs) |
| 10 | Integration checkpoint | All Phase 2 PRs merged to develop; regression tested | Admin + QA |

**Exit Criteria:**
- [ ] All MUST HAVE endpoints reachable with correct responses
- [ ] Auth middleware wired to all protected routes
- [ ] Attendance 409 on duplicate confirmed
- [ ] Finance records contain no individual member IDs
- [ ] All branches merged to develop via approved PRs

---

### Phase 3 — SHOULD HAVE Features (Days 11–16: May 15–20)

> **Goal:** High-value enhancements built on top of stable MVP core.

| Days | Feature | Deliverables | Owner |
|---|---|---|---|
| 11–12 | Programs Module | Program CRUD, sessions, enrollment | API Lead C |
| 11–12 | Announcements | CRUD, audience targeting | API Lead A |
| 13–14 | Life Events & Family | Pre-marital, parental, child dedication (Program sub-types) | API Lead C |
| 13–14 | Reporting | Attendance trends, finance summary, program stats | QA + API Lead B |
| 15 | Media Resources | Catalog CRUD, Cloudinary upload | API Lead C |
| 15–16 | Missions & Outreach | Mission CRUD, volunteer assignment | API Lead A |
| 16 | Document Management | Generic file upload linked to entities | Auth Team |

**Exit Criteria:**
- [ ] Programs and enrollment working
- [ ] Reporting endpoints return accurate aggregated data
- [ ] Cloudinary upload tested for media and document routes
- [ ] All Phase 3 branches merged via approved PRs

---

### Phase 4 — QA, Polish & Submission (Days 17–19: May 21–24)

> **Goal:** No new features. Stabilize, test, document, submit.

| Day | Focus | Activities | Owner |
|---|---|---|---|
| Day 17 | Final integration | All pending PRs merged; full regression | Admin + QA |
| Day 18 | Bug fixes & polish | Fix failures; remove console.logs; validate .env.example | All teams |
| Day 19 | Submission | develop → main PR; README finalized; repo submitted | Admin |

**Exit Criteria:**
- [ ] Zero failing tests in develop
- [ ] No console.log in production code paths
- [ ] README complete with setup, env vars, run instructions, API reference
- [ ] develop merged to main, tagged v1.0
- [ ] Repo submitted to supervisor

---

## 3. Daily Rhythm

| Time | Activity |
|---|---|
| Start of day | 15-min standup: Done / Doing / Blocked |
| During day | Code on assigned feature; commit regularly to feature branch |
| End of day | Push to feature branch; open/update PR; update task status |
| Admin (ongoing) | Review PRs; merge to develop; flag blockers |

---

## 4. Milestones

| Date | Milestone | Success Criteria |
|---|---|---|
| May 7 | M1 — Foundation | Repo live, schemas merged, auth working |
| May 10 | M2 — MVP Core Start | Membership + Finance APIs tested |
| May 14 | M3 — MVP Complete | ALL MUST HAVE features in develop |
| May 20 | M4 — Enhancements | SHOULD HAVE features integrated |
| May 23 | M5 — Code Freeze | No new features; bug fixes only |
| May 24 | M6 — SUBMISSION | Repo submitted |

---

## 5. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Developer unavailable | HIGH | Admin reassigns within 24h |
| develop branch broken | HIGH | Admin reverts immediately; no unreviewed merges |
| Schema changes after Day 2 | MEDIUM | All schema changes need DB Lead approval via PR |
| Feature creep | MEDIUM | Strictly follow MoSCoW; COULD HAVE only if ahead |
| Cloudinary / MongoDB config issues | MEDIUM | DevOps delivers working config on Day 1 |
| Coordination lag | LOW | Async-friendly: PRs + standup notes in shared channel |

---

*ChMS Capstone Project | Document III: Project Plan | Version 1.0 | May 2026*
