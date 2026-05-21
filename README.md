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
- [API Overview](#api-overview)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Routes](#routes)
- [Testing](#testing)
  - [Newman / Postman](#newman--postman)
  - [Running the Test Suite](#running-the-test-suite)
  - [Environment Variables for Testing](#environment-variables-for-testing)
  - [Test Results](#test-results)
- [Team](#team)

---

## Project Overview

The **Church Management System (ChMS)** is a RESTful API backend that helps churches manage their operations — including members, staff, events, finances, welfare cases, media, documents, and more.

This repository is maintained by **Team 06 (DevOps / QA)** and covers infrastructure setup, API testing, and quality assurance for the capstone project.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (Access + Refresh tokens) |
| File Storage | Cloudinary |
| API Testing | Postman / Newman |
| Rate Limiting | express-rate-limit |

---

## Project Structure

```
chms-capstone/
├── app.js                  # Express app — all 17 routes mounted
├── server.js               # Entry point
├── .env                    # Environment variables (not committed)
├── routes/                 # Route handlers (one file per resource)
├── controllers/            # Business logic
├── models/                 # Mongoose schemas
├── middleware/             # Auth guards, rate limiter, error handler
├── postman/
│   ├── ChMS_API_v1.postman_collection.json
│   └── ChMS Local.postman_environment.json
├── newman-results.json     # Latest Newman output (auto-generated)
└── docs/
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
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
RATE_LIMIT_MAX=10

# Seed Admin Account
ADMIN_EMAIL=admin@chms.com
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

## API Overview

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

The API uses **JWT Bearer token authentication**.

| Token | TTL | How to get it |
|---|---|---|
| `accessToken` | 15 minutes | `POST /api/v1/auth/login` |
| `refreshToken` | 7 days | Same login response |

Include the access token in all protected requests:

```
Authorization: Bearer <accessToken>
```

To refresh an expired access token:

```
POST /api/v1/auth/refresh-token
Body: { "refreshToken": "<your_refresh_token>" }
```

### Routes

All 17 resource routes are mounted in `app.js`:

| # | Resource | Base Path |
|---|---|---|
| 1 | Auth | `/api/v1/auth` |
| 2 | Members | `/api/v1/members` |
| 3 | Staff | `/api/v1/staff` |
| 4 | Org Units | `/api/v1/org-units` |
| 5 | Fellowships | `/api/v1/fellowships` |
| 6 | Events | `/api/v1/events` |
| 7 | Inventory (Items) | `/api/v1/inventory` |
| 8 | Vendors | `/api/v1/vendors` |
| 9 | Welfare Cases | `/api/v1/welfare` |
| 10 | Announcements | `/api/v1/announcements` |
| 11 | Missions | `/api/v1/missions` |
| 12 | Programs | `/api/v1/programs` |
| 13 | Documents | `/api/v1/documents` |
| 14 | Media | `/api/v1/media` |
| 15 | Finance | `/api/v1/finance` |
| 16 | Reports | `/api/v1/reports` |
| 17 | Settings | `/api/v1/settings` |

---

## Testing

### Newman / Postman

API tests are written in **Postman** and executed via **Newman** (the Postman CLI runner). The collection covers all 17 routes with auth guard assertions (200, 201, 401, 403, 404).

### Running the Test Suite

```bash
newman run "postman/ChMS_API_v1.postman_collection.json" \
  -e "postman/ChMS Local.postman_environment.json" \
  --reporters cli,json \
  --reporter-json-export newman-results.json
```

### Environment Variables for Testing

The Postman environment file (`ChMS Local.postman_environment.json`) must have these variables populated before running:

| Variable | How to Set | Notes |
|---|---|---|
| `ACCESS_TOKEN` | Auto-set by collection | Set on admin login |
| `REFRESH_TOKEN` | Auto-set by collection | Set on admin login |
| `MEMBER_TOKEN` | **Manual** | Login as a `member`-role user; paste JWT |
| `MEMBER_ID` | Auto-set | Set by POST Create Member |
| `ORG_UNIT_ID` | Auto-set | Set by POST Create Org Unit |
| `FELLOWSHIP_ID` | Auto-set | Set by POST Create Fellowship |
| `STAFF_ID` | Auto-set | Set by POST Create Staff |
| `EVENT_ID` | Auto-set | Set by POST Create Event |
| `ITEM_ID` | Auto-set | Set by POST Create Item |
| `VENDOR_ID` | Auto-set | Set by POST Create Vendor |
| `CASE_ID` | Auto-set | Set by POST Create Welfare Case |
| `ANNOUNCEMENT_ID` | Auto-set | Set by POST Create Announcement |
| `MISSION_ID` | **Manual** | POST `/api/v1/missions`; copy `_id` |
| `PROGRAM_ID` | **Manual** | POST `/api/v1/programs`; copy `_id` |
| `DOCUMENT_ID` | **Manual** | POST `/api/v1/documents`; copy `_id` |
| `MEDIA_ID` | **Manual** | POST `/api/v1/media`; copy `_id` |

> Refer to `docs/ChMS_Sample_Test_Data.md` for step-by-step seed instructions (Steps 0–16) and sample request bodies for all routes.

#### Setting `MEMBER_TOKEN` (required for auth guard tests)

```bash
# 1. Register a member-role user
POST /api/v1/auth/register
{
  "name": "Test Member",
  "email": "member@test.com",
  "password": "Password123!",
  "role": "member"
}

# 2. Login and copy the accessToken
POST /api/v1/auth/login
{
  "email": "member@test.com",
  "password": "Password123!"
}

# 3. Paste the accessToken into the Postman environment as MEMBER_TOKEN
```

### Test Results

| Metric | Value |
|---|---|
| Total Requests | 141 |
| Assertions | 51 |
| Status (Phase 4) | In progress — targeting 51/51 |

**Known failure patterns being resolved:**

| Pattern | Cause | Fix |
|---|---|---|
| A — `got 401` instead of `403` | `MEMBER_TOKEN` missing/invalid | Set `MEMBER_TOKEN` (see above) |
| B — `got 404` instead of `401/403` | Empty `:id` variables in URLs | Seed records; paste `_id` values into env |

---

## Team

**TSA Capstone — Group 10**
**Team 06 — DevOps / QA**
Branch: `team-06-devops-qa`

| Role | Responsibility |
|---|---|
| DevOps / QA | Infrastructure, API testing, Newman automation, QA reporting |