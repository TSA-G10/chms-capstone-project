# ChMS API v1 — Production QA Route Test Plan & Newman Execution Guide

## Project Information

<<<<<<< Updated upstream
| Item | Value |
|---|---|
| Project | ChMS Capstone — Church Management System |
| Team | Team 06 — DevOps / QA |
| Stack | Node.js, Express, MongoDB |
| API Prefix | `/api/v1` |
| Base URL | `http://localhost:5000/api/v1` |
| Testing Tools | Postman, Newman |
| Environment File | `ChMS Local.postman_environment.json` |
=======
| Item             | Value                                    |
| ---------------- | ---------------------------------------- |
| Project          | ChMS Capstone — Church Management System |
| Team             | Team 06 — DevOps / QA                    |
| Stack            | Node.js, Express, MongoDB                |
| API Prefix       | `/api/v1`                                |
| Base URL         | `http://localhost:5000/api/v1`           |
| Testing Tools    | Postman, Newman                          |
| Environment File | `ChMS Local.postman_environment.json`    |
>>>>>>> Stashed changes

---

# 1. API Route Groups

The application currently exposes 17 mounted route groups:

<<<<<<< Updated upstream
| Route Group | Base Endpoint |
|---|---|
| Auth | `/auth` |
| Members | `/members` |
| Org Units | `/org-units` |
| Fellowships | `/fellowships` |
| Staff | `/staff` |
| Announcements | `/announcements` |
| Missions | `/missions` |
| Finance | `/finance` |
| Events | `/events` |
| Reports | `/reports` |
| Inventory | `/inventory` |
| Vendors | `/vendors` |
| Welfare | `/welfare` |
| Programs | `/programs` |
| Media | `/media` |
| Documents | `/documents` |
| Audit | `/audit` |

---

# 2. Postman Environment Variables

## Environment File
=======
| Route Group   | Base Endpoint    |
| ------------- | ---------------- |
| Auth          | `/auth`          |
| Members       | `/members`       |
| Org Units     | `/org-units`     |
| Fellowships   | `/fellowships`   |
| Staff         | `/staff`         |
| Announcements | `/announcements` |
| Missions      | `/missions`      |
| Finance       | `/finance`       |
| Events        | `/events`        |
| Reports       | `/reports`       |
| Inventory     | `/inventory`     |
| Vendors       | `/vendors`       |
| Welfare       | `/welfare`       |
| Programs      | `/programs`      |
| Media         | `/media`         |
| Documents     | `/documents`     |
| Audit         | `/audit`         |

---

# 2. Postman Scripts Tab — Important Note

## Where to Put Test Scripts in Postman

> **Note:** Postman has renamed the **Tests** tab to **Scripts** in recent versions.

When this document refers to a **Postman Test Script**, paste it in:

**Scripts → Post-response**

This runs automatically after every response and writes variables into your environment.

### Steps (do this BEFORE sending the request):

1. Open the request in Postman (e.g. `POST Login`)
2. Click the **Scripts** tab in the request tab bar
3. Click **Post-response** (the right sub-tab)
4. Paste the script
5. Click **Save**
6. Then click **Send**

> **If you already sent the request without the script:**
> Copy the token values directly from the response body and paste them manually into your environment variables under **ChMS Local**. You do not need to send the request again — but add the script before the next run so it auto-sets on future logins.

---

# 3. Postman Environment Variables

## Environment File

>>>>>>> Stashed changes
`ChMS Local.postman_environment.json`

---

<<<<<<< Updated upstream
## 2.1 Environment Variable Registry

| Variable | Purpose | Auto Set | Required |
|---|---|---|---|
| `BASE_URL` | API base URL | No | Yes |
| `ACCESS_TOKEN` | Admin JWT token | Yes | Yes |
| `REFRESH_TOKEN` | Refresh token | Yes | Yes |
| `MEMBER_TOKEN` | Member role JWT | No | Yes |
| `MEMBER_ID` | Member resource ID | Yes | Yes |
| `ORG_UNIT_ID` | Org Unit ID | Yes | Yes |
| `FELLOWSHIP_ID` | Fellowship ID | Yes | Yes |
| `STAFF_ID` | Staff ID | Yes | Yes |
| `EVENT_ID` | Event ID | Yes | Yes |
| `ITEM_ID` | Inventory item ID | Yes | Yes |
| `VENDOR_ID` | Vendor ID | Yes | Yes |
| `CASE_ID` | Welfare case ID | Yes | Yes |
| `ANNOUNCEMENT_ID` | Announcement ID | Yes | Yes |
| `MISSION_ID` | Mission ID | Partial | Yes |
| `PROGRAM_ID` | Program ID | Partial | Yes |
| `DOCUMENT_ID` | Document ID | No | Yes |
| `MEDIA_ID` | Media ID | No | Yes |

---

# 3. Variable Dependency Flow
=======
## 3.1 Environment Variable Registry

| Variable          | Purpose            | Auto Set | Required |
| ----------------- | ------------------ | -------- | -------- |
| `BASE_URL`        | API base URL       | No       | Yes      |
| `ACCESS_TOKEN`    | Admin JWT token    | Yes      | Yes      |
| `REFRESH_TOKEN`   | Refresh token      | Yes      | Yes      |
| `MEMBER_TOKEN`    | Member role JWT    | No       | Yes      |
| `MEMBER_ID`       | Member resource ID | Yes      | Yes      |
| `ORG_UNIT_ID`     | Org Unit ID        | Yes      | Yes      |
| `FELLOWSHIP_ID`   | Fellowship ID      | Yes      | Yes      |
| `STAFF_ID`        | Staff ID           | Yes      | Yes      |
| `EVENT_ID`        | Event ID           | Yes      | Yes      |
| `ITEM_ID`         | Inventory item ID  | Yes      | Yes      |
| `VENDOR_ID`       | Vendor ID          | Yes      | Yes      |
| `CASE_ID`         | Welfare case ID    | Yes      | Yes      |
| `ANNOUNCEMENT_ID` | Announcement ID    | Yes      | Yes      |
| `MISSION_ID`      | Mission ID         | Partial  | Yes      |
| `PROGRAM_ID`      | Program ID         | Partial  | Yes      |
| `DOCUMENT_ID`     | Document ID        | No       | Yes      |
| `MEDIA_ID`        | Media ID           | No       | Yes      |

---

# 4. Variable Dependency Flow
>>>>>>> Stashed changes

```text
LOGIN ADMIN
 ├── ACCESS_TOKEN
 └── REFRESH_TOKEN

REGISTER MEMBER USER
 └── MEMBER ACCOUNT

LOGIN MEMBER USER
 └── MEMBER_TOKEN

CREATE MEMBER
 └── MEMBER_ID

CREATE ORG UNIT
 └── ORG_UNIT_ID

CREATE FELLOWSHIP
 └── FELLOWSHIP_ID

CREATE STAFF
 └── STAFF_ID

CREATE EVENT
 └── EVENT_ID

CREATE INVENTORY ITEM
 └── ITEM_ID

CREATE VENDOR
 └── VENDOR_ID

CREATE WELFARE CASE
 └── CASE_ID

CREATE ANNOUNCEMENT
 └── ANNOUNCEMENT_ID

CREATE MISSION
 └── MISSION_ID

CREATE PROGRAM
 └── PROGRAM_ID

CREATE DOCUMENT
 └── DOCUMENT_ID

CREATE MEDIA
 └── MEDIA_ID
```

---

<<<<<<< Updated upstream
# 4. Pre-Run Checklist
=======
# 5. Pre-Run Checklist
>>>>>>> Stashed changes

## Before Running Newman

### Required Manual Setup

<<<<<<< Updated upstream
- [ ] MongoDB running
- [ ] API server running on port 5000
- [ ] Postman environment imported
- [ ] Admin user seeded
=======
- [x] MongoDB running
- [x] API server running on port 5000
- [x] Postman environment imported
- [x] Admin user seeded
>>>>>>> Stashed changes
- [ ] Admin login successful
- [ ] `ACCESS_TOKEN` generated
- [ ] `REFRESH_TOKEN` generated
- [ ] Member-role account created
- [ ] `MEMBER_TOKEN` generated
- [ ] Mission record created
- [ ] Program record created
- [ ] Document record created
- [ ] Media record created

---

<<<<<<< Updated upstream
# 5. Known Failure Patterns
=======
# 6. Known Failure Patterns
>>>>>>> Stashed changes

## Pattern A — 401 Instead of 403

### Symptoms
<<<<<<< Updated upstream
Expected `403 Forbidden` but received `401 Unauthorized`.


### Root Cause
`MEMBER_TOKEN` missing or invalid.

### Fix
=======

Expected `403 Forbidden` but received `401 Unauthorized`.

### Root Cause

`MEMBER_TOKEN` missing or invalid.

### Fix

>>>>>>> Stashed changes
1. Register a member-role user
2. Login using member credentials
3. Copy JWT into `MEMBER_TOKEN`

---

## Pattern B — 404 Instead of Auth Error

### Symptoms
<<<<<<< Updated upstream
Expected `401/403` but received `404 Not Found`.

### Root Cause
=======

Expected `401/403` but received `404 Not Found`.

### Root Cause

>>>>>>> Stashed changes
Missing resource IDs:

- `MISSION_ID`
- `PROGRAM_ID`
- `DOCUMENT_ID`
- `MEDIA_ID`

### Fix
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
Create one resource per module and populate IDs.

---

<<<<<<< Updated upstream
# 6. Authentication Test Plan

## Route Group
=======
# 7. Authentication Test Plan

## Route Group

>>>>>>> Stashed changes
`/auth`

---

<<<<<<< Updated upstream
## 6.1 POST Login

### Endpoint
=======
## 8.1 POST Login

### Endpoint

>>>>>>> Stashed changes
```http
POST /auth/login
```

### Sample Request
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```json
{
  "email": "superadmin@chms.com",
  "password": "Password123!"
}
```

### Expected Status Codes

<<<<<<< Updated upstream
| Status | Meaning |
|---|---|
| 200 | Success |
| 401 | Invalid credentials |

---

## Postman Test Script
=======
| Status | Meaning             |
| ------ | ------------------- |
| 200    | Success             |
| 401    | Invalid credentials |

---

## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();

pm.environment.set("ACCESS_TOKEN", json.data.accessToken);
pm.environment.set("REFRESH_TOKEN", json.data.refreshToken);
```

---

<<<<<<< Updated upstream
## 6.2 POST Register Member User

### Endpoint
=======
## 8.2 POST Register Member User

### Endpoint

>>>>>>> Stashed changes
```http
POST /auth/register
```

### Sample Request
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "member@chms.com",
  "password": "Password123!",
  "role": "member"
}
```

---

<<<<<<< Updated upstream
## 6.3 POST Login Member User

### Purpose
Generate `MEMBER_TOKEN`

### Sample Request
=======
## 8.3 POST Login Member User

### Purpose

Generate `MEMBER_TOKEN`

### Sample Request

>>>>>>> Stashed changes
```json
{
  "email": "member@chms.com",
  "password": "Password123!"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("MEMBER_TOKEN", json.data.accessToken);
```

---

<<<<<<< Updated upstream
# 7. Members Module Test Plan

## Route Group
=======
# 8. Members Module Test Plan

## Route Group

>>>>>>> Stashed changes
`/members`

---

<<<<<<< Updated upstream
## 7.1 POST Create Member

### Endpoint
=======
## 8.1 POST Create Member

### Endpoint

>>>>>>> Stashed changes
```http
POST /members
```

### Authorization
<<<<<<< Updated upstream
Bearer `ACCESS_TOKEN`

### Sample Request
=======

Bearer `ACCESS_TOKEN`

### Sample Request

>>>>>>> Stashed changes
```json
{
  "firstName": "Grace",
  "lastName": "Johnson",
  "gender": "female",
  "phone": "+2348012345678",
  "email": "grace.johnson@chms.com",
  "address": "12 Allen Avenue, Ikeja",
  "dateOfBirth": "1998-05-14",
  "maritalStatus": "single"
}
```

---

## Expected Response

```json
{
  "success": true,
  "data": {
    "_id": "member_id"
  }
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("MEMBER_ID", json.data._id);
```

---

<<<<<<< Updated upstream
## 7.2 GET Member By ID

### Endpoint
=======
## 8.2 GET Member By ID

### Endpoint

>>>>>>> Stashed changes
```http
GET /members/{{MEMBER_ID}}
```

---

## Expected Status Codes

<<<<<<< Updated upstream
| Status | Meaning |
|---|---|
| 200 | Member found |
| 404 | Invalid ID |

---

## 7.3 PUT Update Member
=======
| Status | Meaning      |
| ------ | ------------ |
| 200    | Member found |
| 404    | Invalid ID   |

---

## 8.3 PUT Update Member
>>>>>>> Stashed changes

### Sample Request

```json
{
  "phone": "+2348099999999",
  "address": "Updated Address"
}
```

---

<<<<<<< Updated upstream
## 7.4 DELETE Member

| Status | Meaning |
|---|---|
| 200 | Deleted |
| 404 | Not found |

---

# 8. Org Units Module Test Plan
=======
## 8.4 DELETE Member

| Status | Meaning   |
| ------ | --------- |
| 200    | Deleted   |
| 404    | Not found |

---

# 9. Org Units Module Test Plan
>>>>>>> Stashed changes

## POST Create Org Unit

### Sample Request

```json
{
  "name": "Choir Department",
  "description": "Handles worship and praise sessions",
  "meetingDay": "Saturday"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("ORG_UNIT_ID", json.data._id);
```

---

## POST Assign Leader

### Endpoint
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```http
POST /org-units/{{ORG_UNIT_ID}}/assign-leader
```

### Sample Request

```json
{
  "leaderId": "{{MEMBER_ID}}"
}
```

---

<<<<<<< Updated upstream
# 9. Fellowships Module Test Plan
=======
# 10. Fellowships Module Test Plan
>>>>>>> Stashed changes

## POST Create Fellowship

### Sample Request

```json
{
  "name": "Youth Fellowship",
  "location": "Main Auditorium",
  "meetingDay": "Friday",
  "leader": "{{MEMBER_ID}}"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("FELLOWSHIP_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 10. Staff Module Test Plan
=======
# 11. Staff Module Test Plan
>>>>>>> Stashed changes

## POST Create Staff

### Sample Request

```json
{
  "firstName": "Daniel",
  "lastName": "Adebayo",
  "position": "Church Administrator",
  "department": "Administration",
  "email": "daniel@chms.com",
  "phone": "+2348034567890"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("STAFF_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 11. Vendors Module Test Plan
=======
# 12. Vendors Module Test Plan
>>>>>>> Stashed changes

## POST Create Vendor

### Sample Request

```json
{
  "name": "Bright Supplies Ltd",
  "contactPerson": "Michael James",
  "phone": "+2348011122233",
  "email": "vendor@brightsupplies.com"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("VENDOR_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 12. Finance Module Test Plan
=======
# 13. Finance Module Test Plan
>>>>>>> Stashed changes

## POST Record Contribution

### Endpoint
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```http
POST /finance/contributions
```

### Sample Request

```json
{
  "memberId": "{{MEMBER_ID}}",
  "type": "tithe",
  "amount": 25000,
  "paymentMethod": "transfer",
  "date": "2026-05-17"
}
```

---

## POST Log Expense

### Sample Request

```json
{
  "title": "Generator Fuel",
  "amount": 18000,
  "category": "Utilities",
  "vendor": "{{VENDOR_ID}}",
  "date": "2026-05-17"
}
```

---

<<<<<<< Updated upstream
# 13. Inventory Module Test Plan
=======
# 14. Inventory Module Test Plan
>>>>>>> Stashed changes

## POST Create Inventory Item

### Sample Request

```json
{
  "name": "Projector",
  "category": "Electronics",
  "quantity": 2,
  "condition": "good"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("ITEM_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 14. Events Module Test Plan
=======
# 15. Events Module Test Plan
>>>>>>> Stashed changes

## POST Create Event

### Sample Request

```json
{
  "title": "Sunday Worship Service",
  "description": "Weekly worship gathering",
  "location": "Main Hall",
  "startDate": "2026-05-25T09:00:00Z",
  "endDate": "2026-05-25T12:00:00Z"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("EVENT_ID", json.data._id);
```

---

## POST Record Attendance

### Endpoint
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```http
POST /events/{{EVENT_ID}}/attendance
```

### Sample Request

```json
{
  "memberId": "{{MEMBER_ID}}",
  "status": "present"
}
```

---

<<<<<<< Updated upstream
# 15. Welfare Module Test Plan
=======
# 16. Welfare Module Test Plan
>>>>>>> Stashed changes

## POST Create Welfare Case

### Sample Request

```json
{
  "memberId": "{{MEMBER_ID}}",
  "caseType": "medical",
  "description": "Emergency surgery support",
  "status": "open"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("CASE_ID", json.data._id);
```

---

## POST Support Log

### Endpoint
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```http
POST /welfare/{{CASE_ID}}/support-log
```

### Sample Request

```json
{
  "note": "Financial support approved",
  "amount": 50000
}
```

---

<<<<<<< Updated upstream
# 16. Announcements Module Test Plan
=======
# 17. Announcements Module Test Plan
>>>>>>> Stashed changes

## POST Create Announcement

### Sample Request

```json
{
  "title": "Workers Meeting",
  "content": "All workers should attend the monthly meeting.",
  "priority": "high"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("ANNOUNCEMENT_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 17. Missions Module Test Plan
=======
# 18. Missions Module Test Plan
>>>>>>> Stashed changes

## POST Create Mission

### Sample Request

```json
{
  "title": "Rural Evangelism Outreach",
  "location": "Kaduna",
  "startDate": "2026-06-01",
  "endDate": "2026-06-05",
  "budget": 250000
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("MISSION_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 18. Programs Module Test Plan
=======
# 19. Programs Module Test Plan
>>>>>>> Stashed changes

## POST Create Program

### Sample Request

```json
{
  "title": "Leadership Training",
  "description": "Training for emerging leaders",
  "startDate": "2026-07-10",
  "venue": "Conference Hall"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("PROGRAM_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 19. Documents Module Test Plan
=======
# 20. Documents Module Test Plan
>>>>>>> Stashed changes

## POST Create Document

### Sample Request

```json
{
  "title": "2026 Budget",
  "category": "finance",
  "description": "Annual finance budget document"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("DOCUMENT_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 20. Media Module Test Plan
=======
# 21. Media Module Test Plan
>>>>>>> Stashed changes

## POST Upload Media

### Sample Request

```json
{
  "title": "Sunday Worship Highlights",
  "type": "video",
  "url": "https://example.com/media.mp4"
}
```

---

<<<<<<< Updated upstream
## Postman Test Script
=======
## Postman Test Script (Scripts → Post-response tab)
>>>>>>> Stashed changes

```javascript
const json = pm.response.json();
pm.environment.set("MEDIA_ID", json.data._id);
```

---

<<<<<<< Updated upstream
# 21. Reports Module Test Plan
=======
# 22. Reports Module Test Plan
>>>>>>> Stashed changes

## GET Attendance Report

### Endpoint
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```http
GET /reports/attendance?from=2026-05-01&to=2026-05-31
```

---

## GET Finance Report

### Endpoint
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
```http
GET /reports/finance?period=monthly
```

---

<<<<<<< Updated upstream
# 22. Audit Module Test Plan

## Expected Endpoints

| Endpoint | Purpose |
|---|---|
| GET `/audit` | Fetch audit logs |
=======
# 23. Audit Module Test Plan

## Expected Endpoints

| Endpoint         | Purpose           |
| ---------------- | ----------------- |
| GET `/audit`     | Fetch audit logs  |
>>>>>>> Stashed changes
| GET `/audit/:id` | Fetch audit entry |

---

<<<<<<< Updated upstream
# 23. Authentication Validation Matrix

| Scenario | Expected Result |
|---|---|
| Missing token | 401 |
| Invalid token | 401 |
| Member token on admin route | 403 |
| Admin token | 200/201 |

---

# 24. Environment Health Check
=======
# 24. Authentication Validation Matrix

| Scenario                    | Expected Result |
| --------------------------- | --------------- |
| Missing token               | 401             |
| Invalid token               | 401             |
| Member token on admin route | 403             |
| Admin token                 | 200/201         |

---

# 25. Environment Health Check
>>>>>>> Stashed changes

## Recommended Pre-Request Validation

```javascript
pm.test("ACCESS_TOKEN exists", function () {
<<<<<<< Updated upstream
    pm.expect(pm.environment.get("ACCESS_TOKEN")).to.not.be.empty;
=======
  pm.expect(pm.environment.get("ACCESS_TOKEN")).to.not.be.empty;
>>>>>>> Stashed changes
});
```

---

## Validate Required Variables

```javascript
const requiredVars = [
<<<<<<< Updated upstream
    "ACCESS_TOKEN",
    "MEMBER_TOKEN",
    "MISSION_ID",
    "PROGRAM_ID",
    "DOCUMENT_ID",
    "MEDIA_ID"
];

requiredVars.forEach(variable => {
    pm.test(`${variable} exists`, function () {
        pm.expect(pm.environment.get(variable)).to.not.be.empty;
    });
=======
  "ACCESS_TOKEN",
  "MEMBER_TOKEN",
  "MISSION_ID",
  "PROGRAM_ID",
  "DOCUMENT_ID",
  "MEDIA_ID",
];

requiredVars.forEach((variable) => {
  pm.test(`${variable} exists`, function () {
    pm.expect(pm.environment.get(variable)).to.not.be.empty;
  });
>>>>>>> Stashed changes
});
```

---

<<<<<<< Updated upstream
# 25. Recommended Test Execution Order
=======
# 26. Recommended Test Execution Order
>>>>>>> Stashed changes

1. Login Admin
2. Register Member User
3. Login Member User
4. Create Member
5. Create Org Unit
6. Create Fellowship
7. Create Staff
8. Create Vendor
9. Record Finance Contribution
10. Create Inventory Item
11. Create Event
12. Create Welfare Case
13. Create Announcement
14. Create Mission
15. Create Program
16. Create Document
17. Create Media
18. Run Reports
19. Validate Audit Logs

---

<<<<<<< Updated upstream
# 26. Newman Execution Plan
=======
# 27. Newman Execution Plan
>>>>>>> Stashed changes

## Newman Command

```bash
newman run "postman/ChMS_API_v1.postman_collection.json" \
-e "postman/ChMS Local.postman_environment.json" \
--reporters cli,json \
--reporter-json-export newman-results.json
```

---

<<<<<<< Updated upstream
# 27. Success Criteria

| Target | Requirement |
|---|---|
| Route Coverage | 100% |
| CRUD Coverage | Complete |
| Auth Coverage | 401 + 403 validation |
| Environment Integrity | All variables populated |
| Newman Assertions | 51/51 passing |
| Regression Stability | Stable |

---

# 28. Final QA Goal
=======
# 28. Success Criteria

| Target                | Requirement             |
| --------------------- | ----------------------- |
| Route Coverage        | 100%                    |
| CRUD Coverage         | Complete                |
| Auth Coverage         | 401 + 403 validation    |
| Environment Integrity | All variables populated |
| Newman Assertions     | 51/51 passing           |
| Regression Stability  | Stable                  |

---

# 29. Final QA Goal
>>>>>>> Stashed changes

## Objectives

- Resolve Pattern A and Pattern B
- Populate all required environment variables
- Achieve full Newman pass rate
- Produce Phase 2 QA checkpoint report
- Validate route authorization integrity
- Validate CRUD lifecycle for all modules
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
