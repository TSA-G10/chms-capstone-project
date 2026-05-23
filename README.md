# ChMS Capstone — Church Management System

> **TSA Capstone Project** | Team 06 — DevOps / QA | Phase 4
> Node.js · Express · MongoDB · Newman · Cloudinary

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Health Check](#health-check)
- [API Documentation](#api-documentation)
- [API Overview](#api-overview)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Routes](#routes)
- [Cloudinary Setup](#cloudinary-setup)
- [Testing](#testing)
  - [Newman / Postman](#newman--postman)
  - [Postman Setup](#postman-setup)
  - [Seeding the Super Admin](#seeding-the-super-admin)
  - [Execution Order — First Full Run](#execution-order--first-full-run)
  - [Post-Response Scripts](#post-response-scripts)
  - [Setting MEMBER_TOKEN](#setting-member_token)
  - [Environment Variables for Testing](#environment-variables-for-testing)
  - [Running the Test Suite](#running-the-test-suite)
  - [Test Results](#test-results)
  - [Known Failure Patterns](#known-failure-patterns)
  - [Known Postman Issues](#known-postman-issues)
- [Branch Workflow](#branch-workflow)
- [Changelog](#changelog)
- [Reference Documents](#reference-documents)
- [Team](#team)

---

## Project Overview

The **Church Management System (ChMS)** is a RESTful API backend that helps churches manage their operations — including members, staff, events, finances, welfare cases, media, documents, and more.

This repository is maintained by **Team 06 (DevOps / QA)** and covers infrastructure setup, API testing, and quality assurance for the capstone project.

---

## Tech Stack

| Layer         | Technology                    |
| ------------- | ----------------------------- |
| Runtime       | Node.js                       |
| Framework     | Express.js                    |
| Database      | MongoDB Atlas (Mongoose ODM)  |
| Auth          | JWT (Access + Refresh tokens) |
| File Storage  | Cloudinary                    |
| API Testing   | Postman / Newman              |
| API Docs      | Swagger UI                    |
| Rate Limiting | express-rate-limit            |

---

## Project Structure

```
chms-capstone/
├── app.js                  # Express app — all 17 routes mounted
├── server.js               # Entry point
├── .env                    # Environment variables (not committed)
├── routes/                 # Route handlers (one file per resource)
├── controllers/            # Business logic
├── services/               # Service layer
├── models/                 # Mongoose schemas
├── middleware/             # Auth guards, rate limiter, error handler
├── utils/
│   └── uploadToCloud.js    # Shared Cloudinary upload utility
├── postman/
│   ├── ChMS_API_v1.postman_collection.json
│   └── ChMS Local.postman_environment.json
├── newman-results.json     # Latest Newman output (auto-generated)
└── docs/
    ├── chms_postman_request_guide.md
    ├── chms_detailed_route_test_plan_markdown.md
    ├── ChMS_API_Testing_Setup_Guide.md
    ├── ChMS_API_Sample_Test_Data.md
    └── ChMS_Sample_Test_Data.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)
- Newman: `npm install -g newman`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/chms-capstone.git
cd chms-capstone

# Switch to the DevOps/QA branch
git checkout team-06-devops-qa

# Pull the latest changes from develop
git pull origin develop

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root. Use the template below — **replace all placeholder values before running**:

```env
# Server
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?appName=<appName>

# JWT — generate with: openssl rand -hex 64
JWT_ACCESS_SECRET=<your_access_secret>
JWT_REFRESH_SECRET=<your_refresh_secret>
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
RATE_LIMIT_MAX=10

# Seed Admin Account
ADMIN_EMAIL=superadmin@chms.com
ADMIN_PASSWORD=Password123!
```

> **Security:** Never commit your `.env` file. It is listed in `.gitignore`.

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

---

## Health Check

Before running tests or making requests, confirm the server is up:

```
GET http://localhost:5000/health
```

**Expected response:**

```json
{
  "success": true,
  "message": "ChMS API is running."
}
```

Use this endpoint to verify the server is running before executing Newman or any Postman requests.

---

## API Documentation

Interactive API documentation is available via **Swagger UI** when the server is running:

```
http://localhost:5000/api-docs
```

The Swagger UI documents all 17 routes with endpoint schemas, request bodies, and response models. Use it as the primary endpoint reference alongside `docs/chms_postman_request_guide.md`.

---

## API Overview

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

The API uses **JWT Bearer token authentication**.

| Token          | TTL    | How to get it             |
| -------------- | ------ | ------------------------- |
| `accessToken`  | 7 days | `POST /api/v1/auth/login` |
| `refreshToken` | 7 days | Same login response       |

Include the access token in all protected requests:

```
Authorization: Bearer <accessToken>
```

To refresh an expired access token:

```
POST /api/v1/auth/refresh-token
Body: { "refreshToken": "<your_refresh_token>" }
```

> **Important:** Never share your JWT tokens with teammates. Each developer generates their own tokens locally after login. Only the login credentials (`superadmin@chms.com` / `Password123!`) are shared.

### Routes

All 17 resource routes are mounted in `app.js`:

| #   | Resource          | Base Path               |
| --- | ----------------- | ----------------------- |
| 1   | Auth              | `/api/v1/auth`          |
| 2   | Members           | `/api/v1/members`       |
| 3   | Staff             | `/api/v1/staff`         |
| 4   | Org Units         | `/api/v1/org-units`     |
| 5   | Fellowships       | `/api/v1/fellowships`   |
| 6   | Events            | `/api/v1/events`        |
| 7   | Inventory (Items) | `/api/v1/inventory`     |
| 8   | Vendors           | `/api/v1/vendors`       |
| 9   | Welfare Cases     | `/api/v1/welfare`       |
| 10  | Announcements     | `/api/v1/announcements` |
| 11  | Missions          | `/api/v1/missions`      |
| 12  | Programs          | `/api/v1/programs`      |
| 13  | Documents         | `/api/v1/documents`     |
| 14  | Media             | `/api/v1/media`         |
| 15  | Finance           | `/api/v1/finance`       |
| 16  | Reports           | `/api/v1/reports`       |
| 17  | Audit             | `/api/v1/audit`         |

---

## Cloudinary Setup

The API uses Cloudinary for file storage across two routes:

| Route                              | Folder        | Accepted Types       | Cloudinary `resource_type` |
| ---------------------------------- | ------------- | -------------------- | -------------------------- |
| Documents (`/api/v1/documents`)    | `chms/`       | PDF, images, docs    | `auto`                     |
| Media (`/api/v1/media/:id/upload`) | `chms-media/` | Images, video, audio | `image` / `video`\*        |

> **Note on audio files:** Cloudinary uses `resource_type: "video"` for audio files. The API handles this automatically — audio mimetypes are detected and mapped to `"video"` at upload time. Do not change the `resource_type` default in `utils/uploadToCloud.js`; resource type is resolved by the caller.

---

## Testing

### Newman / Postman

API tests are written in **Postman** and executed via **Newman**. The collection covers all 17 routes and 141 endpoints with auth guard assertions (200, 201, 401, 403, 404).

For the complete endpoint-by-endpoint request bodies, post-response scripts, and sample data, refer to:

```
docs/chms_postman_request_guide.md
```

For full route test plans, dependency flows, auth validation scenarios, and QA workflow, refer to:

```
docs/chms_detailed_route_test_plan_markdown.md
```

For the step-by-step onboarding and first-run setup guide, refer to:

```
docs/ChMS_API_Testing_Setup_Guide.md
```

---

### Postman Setup

1. Open Postman and click `...` at the top of the sidebar → **Import**
2. Navigate to the `postman/` folder and import both files:
   ```
   postman/ChMS_API_v1.postman_collection.json
   postman/ChMS Local.postman_environment.json
   ```
3. Hover over **ChMS Local** in the Environments panel and click the circle checkbox to set it as the **active environment**

---

### Seeding the Super Admin

Before running any requests, seed the super admin account:

```bash
npm run seed:admin
```

This creates the default admin user:

```json
{
  "email": "superadmin@chms.com",
  "password": "Password123!"
}
```

---

### Execution Order — First Full Run

Run requests in this order on first setup. Each step sets an environment variable required by later steps:

| Step | Request                                           | Sets                                              |
| ---- | ------------------------------------------------- | ------------------------------------------------- |
| 1    | `POST Login` (super admin)                        | `ACCESS_TOKEN`, `REFRESH_TOKEN`, `STAFF_ID`       |
| 2    | `POST Register` (`staff@chms.com`, role: `staff`) | —                                                 |
| 3    | `POST Login` (`staff@chms.com`)                   | `MEMBER_TOKEN` — restore super admin script after |
| 4    | `POST Create Fellowship`                          | `FELLOWSHIP_ID`                                   |
| 5    | `POST Create Member`                              | `MEMBER_ID`                                       |
| 6    | `POST Create Org Unit`                            | `ORG_UNIT_ID`                                     |
| 7    | `POST Create Staff`                               | `STAFF_ID` (overwrites with Staff Profile `_id`)  |
| 8    | `POST Create Event`                               | `EVENT_ID`                                        |
| 9    | `POST Create Item`                                | `ITEM_ID`                                         |
| 10   | `POST Create Vendor`                              | `VENDOR_ID`                                       |
| 11   | `POST Create Welfare Case`                        | `CASE_ID`                                         |
| 12   | `POST Create Announcement`                        | `ANNOUNCEMENT_ID`                                 |
| 13   | `POST Create Mission`                             | `MISSION_ID`                                      |
| 14   | `POST Create Program`                             | `PROGRAM_ID`                                      |
| 15   | `POST Upload Document`                            | `DOCUMENT_ID`                                     |
| 16   | `POST Create Media Entry`                         | `MEDIA_ID`                                        |
| 17   | All GET, PUT, DELETE, and sub-route requests      | —                                                 |

---

### Post-Response Scripts

The collection uses post-response scripts to automatically populate environment variables after successful requests. These are pre-configured in the collection — do not modify them unless instructed.

**POST Login (Super Admin)** — sets `ACCESS_TOKEN`, `REFRESH_TOKEN`, `STAFF_ID`:

```js
const json = pm.response.json();

if (json && json.success) {
  pm.environment.set("ACCESS_TOKEN", json.accessToken);
  pm.environment.set("REFRESH_TOKEN", json.refreshToken);

  if (json.user && json.user.id) {
    pm.environment.set("STAFF_ID", json.user.id);
  }
}
```

All other ID variables (`MEMBER_ID`, `FELLOWSHIP_ID`, `ORG_UNIT_ID`, etc.) are set automatically by their respective POST requests via similar scripts already embedded in the collection.

---

### Setting MEMBER_TOKEN

`MEMBER_TOKEN` must be set **once manually** per environment setup. It is used for auth guard tests that verify lower-privileged access is correctly restricted.

**Step 1 — Register a staff-role user:**

```http
POST /api/v1/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "staff@chms.com",
  "password": "Password123!",
  "role": "staff"
}
```

**Step 2 — Temporarily replace the POST Login post-response script with:**

```js
const json = pm.response.json();

if (json && json.success) {
  pm.environment.set("MEMBER_TOKEN", json.accessToken);
  if (json.user && json.user.id) {
    pm.environment.set("MEMBER_USER_ID", json.user.id);
  }
}
```

**Step 3 — Login as `staff@chms.com` and run the request.** This sets `MEMBER_TOKEN` and `MEMBER_USER_ID`.

**Step 4 — Restore the super admin post-response script** (see above) and log back in as super admin to restore `ACCESS_TOKEN`.

---

### Environment Variables for Testing

All variables are auto-populated by post-response scripts except where noted:

| Variable          | Set By                                            | Notes                                 |
| ----------------- | ------------------------------------------------- | ------------------------------------- |
| `BASE_URL`        | Manual (static)                                   | `http://localhost:5000/api/v1`        |
| `ACCESS_TOKEN`    | `POST Login` (super admin)                        | Auto                                  |
| `REFRESH_TOKEN`   | `POST Login` (super admin)                        | Auto                                  |
| `MEMBER_TOKEN`    | `POST Login` (staff@chms.com)                     | **One-time manual setup** — see above |
| `MEMBER_USER_ID`  | `POST Login` (staff@chms.com)                     | Auto via MEMBER_TOKEN setup step      |
| `MEMBER_ID`       | `POST Create Member`                              | Auto                                  |
| `FELLOWSHIP_ID`   | `POST Create Fellowship`                          | Auto                                  |
| `ORG_UNIT_ID`     | `POST Create Org Unit`                            | Auto                                  |
| `STAFF_ID`        | `POST Login` → overwritten by `POST Create Staff` | Auto                                  |
| `EVENT_ID`        | `POST Create Event`                               | Auto                                  |
| `VENDOR_ID`       | `POST Create Vendor`                              | Auto                                  |
| `ITEM_ID`         | `POST Create Item`                                | Auto                                  |
| `CASE_ID`         | `POST Create Welfare Case`                        | Auto                                  |
| `ANNOUNCEMENT_ID` | `POST Create Announcement`                        | Auto                                  |
| `MISSION_ID`      | `POST Create Mission`                             | Auto                                  |
| `PROGRAM_ID`      | `POST Create Program`                             | Auto                                  |
| `DOCUMENT_ID`     | `POST Upload Document`                            | Auto                                  |
| `MEDIA_ID`        | `POST Create Media Entry`                         | Auto                                  |

> **User ID vs Member ID:** Use `{{MEMBER_USER_ID}}` for endpoints that validate against the `users` authentication collection (e.g. `POST /missions/:id/volunteers`). Use `{{MEMBER_ID}}` for endpoints that operate on member profile records or giving histories.

---

### Running the Test Suite

```bash
newman run "postman/ChMS_API_v1.postman_collection.json" \
  -e "postman/ChMS Local.postman_environment.json" \
  --reporters cli,json \
  --reporter-json-export newman-results.json
```

---

### Test Results

| Metric         | Value           |
| -------------- | --------------- |
| Total Requests | 141             |
| Assertions     | 51              |
| Target         | 51 / 51 passing |

---

### Known Failure Patterns

| Pattern | Symptom                        | Cause                             | Fix                                             |
| ------- | ------------------------------ | --------------------------------- | ----------------------------------------------- |
| A       | `got 401` instead of `403`     | `MEMBER_TOKEN` missing or expired | Re-run MEMBER_TOKEN setup steps                 |
| B       | `got 404` instead of `401/403` | Empty `:id` variable in URL       | Run requests in execution order to seed all IDs |

---

### Known Postman Issues

**form-data fields unchecked after import**

When a collection is imported, form-data fields may be imported in an **unchecked/disabled state**. Unchecked fields are silently excluded from the request body, causing the server to return `"No file uploaded."` or missing field errors even when values appear to be filled in.

Affected requests: `POST Upload Document`, `POST Upload Media File`

Fix: Open the request → Body tab → manually **check all rows** in the form-data table before sending.

**File attachment not persisted across imports**

Postman does not save file attachments in collection exports. After every import, the `file` field on `POST Upload Document` and `POST Upload Media File` must be **manually re-attached** by selecting a file from your machine.

---

## Branch Workflow

```
feature/* → team-06-devops-qa → develop
```

| Branch                    | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `team-06-devops-qa`       | Main working branch for Team 06            |
| `feature/qa-e2e-complete` | E2E testing feature branch (merged)        |
| `develop`                 | Shared integration branch across all teams |

**Branch cleanup after a PR is merged:**

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git branch -d feature/<branch-name>
git push origin --delete feature/<branch-name>
git branch -a
```

---

## Changelog

Key fixes made during Phase 4 QA:

| File                                          | Fix                                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `services/orgUnitService.js`                  | `assignLeader` — swapped `User.findOne` for `Member.findOne`; added `Member` import |
| `models/Member.js`                            | `memberStatus` default changed to `"active"`                                        |
| `models/User.js`                              | `"member"` added to role enum                                                       |
| `validations/authValidation.js`               | `"member"` added to role enum                                                       |
| `services/media.service.js`                   | Cloudinary `resource_type` resolved by mimetype — audio mapped to `"video"`         |
| `postman/ChMS Local.postman_environment.json` | All ID values cleared for clean teammate setup                                      |

---

## Reference Documents

| Document                | Location                                         | Purpose                                                                 |
| ----------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| Postman Request Guide   | `docs/chms_postman_request_guide.md`             | Complete request bodies and post-response scripts for all 141 endpoints |
| Route Test Plan         | `docs/chms_detailed_route_test_plan_markdown.md` | Full test plan, dependency flow, auth scenarios, Newman guide           |
| API Testing Setup Guide | `docs/ChMS_API_Testing_Setup_Guide.md`           | Step-by-step onboarding and first-run instructions                      |
| Sample Test Data        | `docs/ChMS_Sample_Test_Data.md`                  | Seed instructions (Steps 0–16) and sample request bodies                |

---

## Team

**TSA Capstone — Group 10**
**Team 06 — DevOps / QA**
Branch: `team-06-devops-qa`

| Role        | Responsibility                                               |
| ----------- | ------------------------------------------------------------ |
| DevOps / QA | Infrastructure, API testing, Newman automation, QA reporting |
