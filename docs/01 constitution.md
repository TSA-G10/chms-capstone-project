# ChMS Capstone Project
## Document I — Project Constitution
### Governing Standards, Principles & Non-Negotiables

---

| Field | Detail |
|---|---|
| Version | 1.0 |
| Date | May 5, 2026 |
| Status | ACTIVE — Binding on All Team Members |
| Submission | May 24, 2026 |
| Stack | Node.js · MongoDB · Multer · Cloudinary |
| Team Size | 20 Backend Developers |

> This document governs all technical decisions, collaboration protocols, coding standards, and team conduct for the duration of this project.

---

## 1. Project Identity

| Field | Detail |
|---|---|
| Project Name | Church Management System (ChMS) |
| Type | Capstone / Academic Project |
| Submission Deadline | May 24, 2026 (19 days from project start) |
| Team Size | 20 Backend Developers |
| Team Structure | By Layer — DB, API, Auth, Modules |
| Primary Stack | Node.js, Express.js, MongoDB, Mongoose |
| File Handling | Multer (upload) + Cloudinary (storage) |
| Version Control | GitHub — Feature → develop → main |

---

## 2. Mission Statement

> The ChMS is a people-centered, privacy-conscious church operations platform that enables management of members, services, finances, programs, and community initiatives. It reflects real church structure, handles sensitive data responsibly, and is built by a disciplined engineering team following spec-driven development.

---

## 3. Architectural Principles

### 3.1 Non-Negotiables

- RESTful API design — every endpoint must follow REST conventions
- Layered architecture: Routes → Controllers → Services → Models
- MongoDB / Mongoose for all data persistence
- JWT authentication with role-based access control on every protected route
- Multer + Cloudinary for all file/media uploads — no local disk storage in production
- Environment variables via `.env` — no secrets in code or git
- All responses use a consistent JSON envelope: `{ success, data, message, error }`

### 3.2 Mandatory Folder Structure

```
src/
  config/          # DB connection, env config, cloudinary setup
  middlewares/     # auth, error handler, upload, validation
  models/          # All Mongoose schemas
  controllers/     # Request handlers — thin layer only
  services/        # All business logic lives here
  routes/          # Route definitions only — import controllers
  utils/           # Helpers, constants, response formatter
  validators/      # Joi/express-validator schemas
tests/             # Unit and integration tests
.env.example       # Template — never commit actual .env
app.js             # Express app setup
server.js          # Entry point
```

---

## 4. Coding Standards

### 4.1 Language & Style

- **Language:** JavaScript (Node.js)
- **Style:** camelCase for variables and functions; PascalCase for classes and models
- **Files:** kebab-case naming — `member.routes.js`, `auth.controller.js`
- **Quotes:** single quotes throughout
- **Semicolons:** required at end of statements
- **Max line length:** 100 characters
- **Indentation:** 2 spaces — no tabs

### 4.2 Mongoose Schema Rules

- All schemas must define `timestamps: true`
- All fields must include validation (`required`, `minlength`, `enum`, etc.)
- No raw `.save()` in controllers — all DB logic goes in services
- Use `.lean()` for read-only queries for performance
- All ObjectId references must include `ref` and be indexed

### 4.3 Error Handling

- All async route handlers must be wrapped in `try/catch` or use `asyncHandler` middleware
- Never expose stack traces in production responses
- HTTP status codes must be semantically correct (200, 201, 400, 401, 403, 404, 500)
- Validation errors → 400; Auth errors → 401/403; Not found → 404

### 4.4 API Response Format

```json
// Success
{ "success": true, "data": { ... }, "message": "Resource created" }

// Error
{ "success": false, "error": "Validation failed", "details": [ ... ] }
```

---

## 5. GitHub Workflow — The Law

### 5.1 Branch Structure

| Branch | Purpose | Who Can Push |
|---|---|---|
| `main` | Production-ready code — final submission | Admin only via PR from develop |
| `develop` | Integration branch — all features merge here | Admin only — via approved PR |
| `feature/*` | Individual feature development | Assigned developer only |
| `fix/*` | Bug fixes on feature branches | Assigned developer only |

### 5.2 Branch Naming Convention

```
feature/auth-login
feature/membership-crud
feature/finance-service-record
fix/auth-token-expiry
```

### 5.3 Commit Message Format

```
type(scope): short description

Types: feat | fix | refactor | docs | test | chore

Examples:
  feat(auth): implement JWT login and token refresh
  fix(membership): correct attendance aggregation query
  refactor(finance): move contribution logic to service layer
  docs(readme): add environment setup instructions
```

### 5.4 Pull Request Protocol

1. Developer completes feature and tests locally
2. Developer pushes to their feature branch
3. Developer opens a Pull Request targeting `develop`
4. PR description must include: what was built, how to test it, any known issues
5. Admin reviews: code quality, standards compliance, tests passing
6. Admin approves and merges — or requests changes
7. **Developer must NOT merge their own PR**

### 5.5 Absolute Git Prohibitions

- NO direct push to `main` — ever
- NO direct push to `develop` — PRs only
- NO force push (`git push --force`) on shared branches
- NO `.env` files committed to the repository
- NO `node_modules` committed — use `.gitignore`
- NO merge of a branch with failing tests

---

## 6. Team Layer Structure

| Layer | Team Size | Lead | Core Responsibility |
|---|---|---|---|
| Database & Models | 4 devs | DB Lead | All Mongoose schemas, indexes, relationships |
| Authentication & RBAC | 3 devs | Auth Lead | JWT, sessions, role guards, middleware |
| Core API — Membership & Org | 4 devs | API Lead A | Members, org units, fellowships, staff |
| Core API — Finance & Events | 4 devs | API Lead B | Contributions, expenses, events, attendance |
| Programs, Welfare & Media | 3 devs | API Lead C | Programs, welfare, inventory, file uploads |
| DevOps & QA | 2 devs | QA Lead | Testing, environment, CI, deployment |

---

## 7. Definition of Done

A feature is **DONE** only when ALL of the following are true:

- [ ] Code follows all standards in Section 4
- [ ] All routes tested via Postman or automated test
- [ ] Error cases handled with correct HTTP codes
- [ ] No `console.log` statements left in production code
- [ ] `.env.example` updated if new variables were added
- [ ] Feature branch is up to date with `develop` before PR
- [ ] PR description is complete and approved by admin
- [ ] No merge conflicts outstanding

---

## 8. Communication Protocol

### 8.1 Daily Standup Format

- What did I complete yesterday?
- What will I work on today?
- Any blockers?

### 8.2 Escalation Path

1. Developer → Team Lead (same layer)
2. Team Lead → Admin / Project Manager
3. Admin → Full team (if it affects architecture)

### 8.3 Prohibited Behaviors

- Pushing untested code to any shared branch
- Working on features not assigned to you without notice
- Going silent for more than 24 hours without informing the team
- Breaking the `develop` branch and not immediately flagging it

---

## 9. Security Principles

- All passwords hashed with bcrypt — minimum 12 salt rounds
- JWT tokens must expire — access: 15m, refresh: 7d
- All inputs sanitized and validated before processing
- Role checks enforced at middleware level, not in controllers
- No sensitive data (passwords, tokens) in API responses
- Rate limiting applied to auth endpoints

---

## 10. Acceptance

> By working on this project, every team member agrees to this Constitution. Violations may result in PR rejection, branch revocation, or escalation to the academic supervisor. The Admin holds final authority on all technical disputes.

---

*ChMS Capstone Project | Document I: Project Constitution | Version 1.0 | May 2026*
