# ChMS Capstone Project
## Document IV — Feature Registry
### Full MoSCoW Feature Breakdown with API Contracts & Business Rules

---

| Field | Detail |
|---|---|
| Version | 1.0 |
| Date | May 5, 2026 |
| Status | ACTIVE |

> Feature IDs are referenced in the Task Register (Doc V) and all Team Implementation Plans.

---

## MUST HAVE — MVP Features

---

### F-001 — Authentication & Authorization

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Authentication & RBAC |
| Owner | Auth Team (3 devs) |
| Phase | Phase 1 (Days 1–3) |

**Endpoints**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/change-password
```

**Business Rules**
- Passwords hashed with bcrypt — minimum 12 salt rounds
- Access token: 15 min; refresh token: 7 days
- Roles: `super_admin | admin | pastor | finance_officer | welfare_officer | staff | volunteer`
- Registration is admin-only — no public signup
- Rate limiting on `/auth/login` — max 10 req/15 min per IP
- Refresh tokens validated server-side

---

### F-002 — Membership Management

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Core API — Membership & Org |
| Owner | API Lead A Team |
| Phase | Phase 2 (Days 4–6) |

**Endpoints**
```
GET    /api/v1/members
POST   /api/v1/members
GET    /api/v1/members/:id
PUT    /api/v1/members/:id
DELETE /api/v1/members/:id
GET    /api/v1/members/:id/attendance
```

**Business Rules**
- Email optional — sparse unique index
- Delete is soft-delete only (`isActive: false`)
- Status flow: `visitor → active → inactive / transferred`
- Profile images via Multer → Cloudinary
- Pagination on GET — default 20 per page
- Members are data subjects, not system users

---

### F-003 — Organizational Structure

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Core API — Membership & Org |
| Owner | API Lead A Team |
| Phase | Phase 2 (Days 4–6) |

**Endpoints**
```
GET    /api/v1/org-units
POST   /api/v1/org-units
GET    /api/v1/org-units/:id
PUT    /api/v1/org-units/:id
DELETE /api/v1/org-units/:id
POST   /api/v1/org-units/:id/assign-leader
```

**Business Rules**
- Hierarchical — `parentId` references another OrgUnit
- Root unit has no parentId (null)
- Leader must be an active User
- Types: `zone | area | district | region`
- Cannot delete a unit with active children

---

### F-004 — Fellowship Management

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Core API — Membership & Org |
| Owner | API Lead A Team |
| Phase | Phase 2 (Days 4–6) |

**Endpoints**
```
GET    /api/v1/fellowships
POST   /api/v1/fellowships
GET    /api/v1/fellowships/:id
PUT    /api/v1/fellowships/:id
DELETE /api/v1/fellowships/:id
GET    /api/v1/fellowships/:id/members
```

**Business Rules**
- Each fellowship belongs to one OrgUnit
- Leader is a Member (not necessarily a User)
- Members linked via `Member.fellowshipId`
- `GET /fellowships/:id/members` returns paginated list

---

### F-005 — Staff & Volunteer Management

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Core API — Membership & Org |
| Owner | API Lead A Team |
| Phase | Phase 2 (Days 4–6) |

**Endpoints**
```
GET    /api/v1/staff
POST   /api/v1/staff
GET    /api/v1/staff/:id
PUT    /api/v1/staff/:id
DELETE /api/v1/staff/:id
```

**Business Rules**
- Staff may be linked to a User via `userId` (optional)
- Only admin can create or delete staff
- `isVolunteer` boolean distinguishes paid staff from volunteers

---

### F-006 — Event Management

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Core API — Finance & Events |
| Owner | API Lead B Team |
| Phase | Phase 2 (Days 7–9) |

**Endpoints**
```
GET    /api/v1/events
GET    /api/v1/events?from=&to=
POST   /api/v1/events
GET    /api/v1/events/:id
PUT    /api/v1/events/:id
DELETE /api/v1/events/:id
```

**Business Rules**
- Events are one-time — use Programs for multi-session
- Types: `service | ceremony | special | fellowship`
- Calendar filter on `event.date` field
- Only admin or pastor can create/modify events

---

### F-007 — Attendance Tracking

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Core API — Finance & Events |
| Owner | API Lead B Team |
| Phase | Phase 2 (Days 7–9) |

**Endpoints**
```
POST   /api/v1/events/:id/attendance
GET    /api/v1/events/:id/attendance
GET    /api/v1/members/:id/attendance
```

**Business Rules**
- Compound unique index `{ eventId, memberId }`
- Duplicate returns `409 Conflict`
- Bulk check-in — accepts array of memberIds
- Only staff, admin, pastor can record attendance

---

### F-008 — Financial Management

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Core API — Finance & Events |
| Owner | API Lead B Team |
| Phase | Phase 2 (Days 4–6) |

**Endpoints**
```
POST   /api/v1/finance/contributions
GET    /api/v1/finance/contributions
POST   /api/v1/finance/expenses
GET    /api/v1/finance/expenses
GET    /api/v1/finance/summary
```

**Business Rules**
- Contributions are service totals — NOT per individual
- Categories: `tithe | offering | donation | special`
- Channels: `cash | transfer | pos | online`
- Summary: total income, total expenses, net balance, category breakdown
- Only finance_officer and admin can write finance records
- Currency defaults to NGN

---

### F-009 — Inventory & Vendor Management

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Programs, Welfare & Media |
| Owner | API Lead C Team |
| Phase | Phase 2 (Days 7–9) |

**Endpoints**
```
GET/POST/PUT/DELETE   /api/v1/inventory
PUT                   /api/v1/inventory/:id/link-expense
GET/POST/PUT/DELETE   /api/v1/vendors
```

**Business Rules**
- Items track quantity, unit cost, vendor reference
- Expense records can be linked to inventory items
- Low-stock threshold is optional metadata

---

### F-010 — Welfare & Care Programs

| Field | Detail |
|---|---|
| Priority | MUST HAVE |
| Layer | Programs, Welfare & Media |
| Owner | API Lead C Team |
| Phase | Phase 2 (Days 7–9) |

**Endpoints**
```
GET    /api/v1/welfare
POST   /api/v1/welfare
GET    /api/v1/welfare/:id
PUT    /api/v1/welfare/:id
POST   /api/v1/welfare/:id/support-log
GET    /api/v1/welfare/:id/support-log
```

**Business Rules**
- Cases linked to Member records
- Support types: `financial | food | medical | counseling`
- Case status: `open | active | closed`
- Only welfare_officer and admin can manage cases

---

## SHOULD HAVE — High-Value Features

---

### F-011 — Programs Module

| Field | Detail |
|---|---|
| Priority | SHOULD HAVE |
| Layer | Programs, Welfare & Media |
| Owner | API Lead C Team |
| Phase | Phase 3 (Days 11–12) |

**Endpoints**
```
GET/POST/PUT/DELETE   /api/v1/programs
POST                  /api/v1/programs/:id/sessions
POST                  /api/v1/programs/:id/enroll
GET                   /api/v1/programs/:id/participants
```

**Business Rules**
- Types: `empowerment | pre_marital | parental | missions | other`
- Life events (pre-marital, parental, child dedication) are Program sub-types
- Enrollment status: `registered | attending | completed | dropped`
- maxParticipants enforced on enrollment if set

---

### F-012 — Communication & Announcements

| Field | Detail |
|---|---|
| Priority | SHOULD HAVE |
| Layer | Core API — Membership & Org |
| Owner | API Lead A Team |
| Phase | Phase 3 (Days 11–12) |

**Endpoints**
```
GET/POST/PUT/DELETE   /api/v1/announcements
```

**Business Rules**
- Audience: `all | zone | fellowship | staff`
- `publishedAt` controls visibility
- Only admin or pastor can create announcements

---

### F-013 — Reporting & Analytics

| Field | Detail |
|---|---|
| Priority | SHOULD HAVE |
| Layer | Core API — Finance & Events |
| Owner | QA Lead + API Lead B |
| Phase | Phase 3 (Days 13–14) |

**Endpoints**
```
GET   /api/v1/reports/attendance?from=&to=
GET   /api/v1/reports/finance?period=monthly|quarterly|yearly
GET   /api/v1/reports/programs
```

**Business Rules**
- Reports use MongoDB aggregation pipeline
- No raw PII in report responses
- Requires admin or finance_officer role

---

### F-014 — Media Resources

| Field | Detail |
|---|---|
| Priority | SHOULD HAVE |
| Layer | Programs, Welfare & Media |
| Owner | API Lead C Team |
| Phase | Phase 3 (Day 15) |

**Endpoints**
```
GET/POST/PUT/DELETE   /api/v1/media
POST                  /api/v1/media/:id/upload
```

**Business Rules**
- Types: `book | audio | digital`
- Files to Cloudinary; store URL and `public_id`
- Physical items have quantity field
- Not e-commerce — no payment processing at MVP

---

### F-015 — Missions & Outreach

| Field | Detail |
|---|---|
| Priority | SHOULD HAVE |
| Layer | Core API — Membership & Org |
| Owner | API Lead A Team |
| Phase | Phase 3 (Days 15–16) |

**Endpoints**
```
GET/POST/PUT/DELETE   /api/v1/missions
POST                  /api/v1/missions/:id/volunteers
GET                   /api/v1/missions/:id/volunteers
```

**Business Rules**
- Status: `planned | active | completed`
- Volunteers reference User or Member IDs
- Budget is a simple number field

---

## COULD HAVE — Bonus Features

---

### F-016 — Audit Logging

| Field | Detail |
|---|---|
| Priority | COULD HAVE |
| Layer | Authentication & RBAC |
| Owner | Auth Team |
| Phase | Phase 4 |

**Endpoints**
```
GET   /api/v1/audit   (super_admin only, paginated)
```

**Business Rules**
- Logs: userId, action, entity, entityId, timestamp, IP
- Auto-written via middleware on sensitive routes
- Read-only — no delete API ever

---

### F-017 — Document Management

| Field | Detail |
|---|---|
| Priority | COULD HAVE |
| Layer | Authentication & RBAC |
| Owner | Auth Team + DevOps |
| Phase | Phase 3 (Day 16) |

**Endpoints**
```
POST   /api/v1/documents/upload
GET    /api/v1/documents
GET    /api/v1/documents/:id
DELETE /api/v1/documents/:id
```

**Business Rules**
- Supported types: PDF, JPEG, PNG
- Linked to entity type + entityId
- Store `public_id` for Cloudinary deletion

---

## Feature Summary

| ID | Name | Priority | Layer | Phase |
|---|---|---|---|---|
| F-001 | Authentication & Authorization | MUST | Auth | 1 |
| F-002 | Membership Management | MUST | Membership & Org | 2 |
| F-003 | Organizational Structure | MUST | Membership & Org | 2 |
| F-004 | Fellowship Management | MUST | Membership & Org | 2 |
| F-005 | Staff & Volunteer Management | MUST | Membership & Org | 2 |
| F-006 | Event Management | MUST | Finance & Events | 2 |
| F-007 | Attendance Tracking | MUST | Finance & Events | 2 |
| F-008 | Financial Management | MUST | Finance & Events | 2 |
| F-009 | Inventory & Vendor Management | MUST | Programs & Welfare | 2 |
| F-010 | Welfare & Care Programs | MUST | Programs & Welfare | 2 |
| F-011 | Programs Module | SHOULD | Programs & Welfare | 3 |
| F-012 | Communication & Announcements | SHOULD | Membership & Org | 3 |
| F-013 | Reporting & Analytics | SHOULD | Finance & Events | 3 |
| F-014 | Media Resources | SHOULD | Programs & Welfare | 3 |
| F-015 | Missions & Outreach | SHOULD | Membership & Org | 3 |
| F-016 | Audit Logging | COULD | Auth | 4 |
| F-017 | Document Management | COULD | Auth | 3 |

---

*ChMS Capstone Project | Document IV: Feature Registry | Version 1.0 | May 2026*
