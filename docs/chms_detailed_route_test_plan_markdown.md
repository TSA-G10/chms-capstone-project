# ChMS API v1 — Production QA Route Test Plan & Newman Execution Guide

## Project Information

| Item | Value |
|---|---|
| Project | ChMS Capstone — Church Management System |
| Team | Team 06 — DevOps / QA |
| Stack | Node.js, Express, MongoDB |
| API Prefix | `/api/v1` |
| Base URL | `http://localhost:5000/api/v1` |
| Testing Tools | Postman, Newman |
| Environment File | `ChMS Local.postman_environment.json` |

---

# 1. API Route Groups

The application currently exposes 17 mounted route groups:

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
`ChMS Local.postman_environment.json`

---

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

# 4. Pre-Run Checklist

## Before Running Newman

### Required Manual Setup

- [ ] MongoDB running
- [ ] API server running on port 5000
- [ ] Postman environment imported
- [ ] Admin user seeded
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

# 5. Known Failure Patterns

## Pattern A — 401 Instead of 403

### Symptoms
Expected `403 Forbidden` but received `401 Unauthorized`.


### Root Cause
`MEMBER_TOKEN` missing or invalid.

### Fix
1. Register a member-role user
2. Login using member credentials
3. Copy JWT into `MEMBER_TOKEN`

---

## Pattern B — 404 Instead of Auth Error

### Symptoms
Expected `401/403` but received `404 Not Found`.

### Root Cause
Missing resource IDs:

- `MISSION_ID`
- `PROGRAM_ID`
- `DOCUMENT_ID`
- `MEDIA_ID`

### Fix
Create one resource per module and populate IDs.

---

# 6. Authentication Test Plan

## Route Group
`/auth`

---

## 6.1 POST Login

### Endpoint
```http
POST /auth/login
```

### Sample Request
```json
{
  "email": "superadmin@chms.com",
  "password": "Password123!"
}
```

### Expected Status Codes

| Status | Meaning |
|---|---|
| 200 | Success |
| 401 | Invalid credentials |

---

## Postman Test Script

```javascript
const json = pm.response.json();

pm.environment.set("ACCESS_TOKEN", json.data.accessToken);
pm.environment.set("REFRESH_TOKEN", json.data.refreshToken);
```

---

## 6.2 POST Register Member User

### Endpoint
```http
POST /auth/register
```

### Sample Request
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

## 6.3 POST Login Member User

### Purpose
Generate `MEMBER_TOKEN`

### Sample Request
```json
{
  "email": "member@chms.com",
  "password": "Password123!"
}
```

---

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("MEMBER_TOKEN", json.data.accessToken);
```

---

# 7. Members Module Test Plan

## Route Group
`/members`

---

## 7.1 POST Create Member

### Endpoint
```http
POST /members
```

### Authorization
Bearer `ACCESS_TOKEN`

### Sample Request
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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("MEMBER_ID", json.data._id);
```

---

## 7.2 GET Member By ID

### Endpoint
```http
GET /members/{{MEMBER_ID}}
```

---

## Expected Status Codes

| Status | Meaning |
|---|---|
| 200 | Member found |
| 404 | Invalid ID |

---

## 7.3 PUT Update Member

### Sample Request

```json
{
  "phone": "+2348099999999",
  "address": "Updated Address"
}
```

---

## 7.4 DELETE Member

| Status | Meaning |
|---|---|
| 200 | Deleted |
| 404 | Not found |

---

# 8. Org Units Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("ORG_UNIT_ID", json.data._id);
```

---

## POST Assign Leader

### Endpoint
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

# 9. Fellowships Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("FELLOWSHIP_ID", json.data._id);
```

---

# 10. Staff Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("STAFF_ID", json.data._id);
```

---

# 11. Vendors Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("VENDOR_ID", json.data._id);
```

---

# 12. Finance Module Test Plan

## POST Record Contribution

### Endpoint
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

# 13. Inventory Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("ITEM_ID", json.data._id);
```

---

# 14. Events Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("EVENT_ID", json.data._id);
```

---

## POST Record Attendance

### Endpoint
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

# 15. Welfare Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("CASE_ID", json.data._id);
```

---

## POST Support Log

### Endpoint
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

# 16. Announcements Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("ANNOUNCEMENT_ID", json.data._id);
```

---

# 17. Missions Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("MISSION_ID", json.data._id);
```

---

# 18. Programs Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("PROGRAM_ID", json.data._id);
```

---

# 19. Documents Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("DOCUMENT_ID", json.data._id);
```

---

# 20. Media Module Test Plan

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

## Postman Test Script

```javascript
const json = pm.response.json();
pm.environment.set("MEDIA_ID", json.data._id);
```

---

# 21. Reports Module Test Plan

## GET Attendance Report

### Endpoint
```http
GET /reports/attendance?from=2026-05-01&to=2026-05-31
```

---

## GET Finance Report

### Endpoint
```http
GET /reports/finance?period=monthly
```

---

# 22. Audit Module Test Plan

## Expected Endpoints

| Endpoint | Purpose |
|---|---|
| GET `/audit` | Fetch audit logs |
| GET `/audit/:id` | Fetch audit entry |

---

# 23. Authentication Validation Matrix

| Scenario | Expected Result |
|---|---|
| Missing token | 401 |
| Invalid token | 401 |
| Member token on admin route | 403 |
| Admin token | 200/201 |

---

# 24. Environment Health Check

## Recommended Pre-Request Validation

```javascript
pm.test("ACCESS_TOKEN exists", function () {
    pm.expect(pm.environment.get("ACCESS_TOKEN")).to.not.be.empty;
});
```

---

## Validate Required Variables

```javascript
const requiredVars = [
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
});
```

---

# 25. Recommended Test Execution Order

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

# 26. Newman Execution Plan

## Newman Command

```bash
newman run "postman/ChMS_API_v1.postman_collection.json" \
-e "postman/ChMS Local.postman_environment.json" \
--reporters cli,json \
--reporter-json-export newman-results.json
```

---

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

## Objectives

- Resolve Pattern A and Pattern B
- Populate all required environment variables
- Achieve full Newman pass rate
- Produce Phase 2 QA checkpoint report
- Validate route authorization integrity
- Validate CRUD lifecycle for all modules

