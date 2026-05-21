# ChMS API — Postman Request Bodies & Post-Response Scripts

## Complete Reference | Team 06 DevOps/QA

---

## How This Document Works

- **Logged in as:** `superadmin@chms.com` for all create/update/delete operations unless stated otherwise
- **Authorization:** The collection-level pre-request script automatically injects `Bearer {{ACCESS_TOKEN}}` on every request
- **Post-response scripts** go in: `Scripts → Post-response` tab on the specific request named
- **No-Auth and Low-Privilege variants** have their own pre-request and test scripts already in the collection — do not modify them
- **MEMBER_TOKEN** must be set manually once by registering and logging in as `member@chms.com`

---

## Correct Execution Order (First Full Run) - DO THIS FIRST

1. `POST Login` (super admin) — sets `ACCESS_TOKEN`, `REFRESH_TOKEN`, `STAFF_ID` (saves your flat `json.user.id`)
2. `POST Register` (member@chms.com)
3. `POST Login` (member@chms.com) — sets `MEMBER_TOKEN` via your flat-update script, then restore super admin script & log back in
4. `POST Create Fellowship` — sets `FELLOWSHIP_ID`
5. `POST Create Member` — sets `MEMBER_ID`
6. `POST Create Org Unit` — sets `ORG_UNIT_ID`
7. `POST Create Staff` — reads `{{STAFF_ID}}` (as User ID) to populate payload, then overwrites `STAFF_ID` with its finalized Profile Document `_id`
8. `POST Create Event` — sets `EVENT_ID`
9. `POST Create Item` — sets `ITEM_ID`
10. `POST Create Vendor` — sets `VENDOR_ID`
11. `POST Create Case` — sets `CASE_ID`
12. `POST Create Announcement` — sets `ANNOUNCEMENT_ID`
13. `POST Create Mission` — sets `MISSION_ID`
14. `POST Create Program` — sets `PROGRAM_ID`
15. `POST Upload Document` — sets `DOCUMENT_ID`
16. `POST Create Media Entry` — sets `MEDIA_ID`
17. All remaining GET, PUT, DELETE, and sub-route requests can now run successfully

---

## STEP 0 — One-Time Setup (Do This First)

### 0.1 — POST Login (Super Admin)

**Request:** `POST {{BASE_URL}}/auth/login`
**Body:**

```json
{
  "email": "superadmin@chms.com",
  "password": "Password123!"
}
```

**Post-response script — place on `POST Login`:**

```js
// Parse the response body safely
const json = pm.response.json();

if (json && json.success) {
  // 1. Set the tokens (Notice there is NO '.data')
  pm.environment.set("ACCESS_TOKEN", json.accessToken);
  pm.environment.set("REFRESH_TOKEN", json.refreshToken);

  // 2. Set the staff ID using the new mapped "id" key
  if (json.user && json.user.id) {
    pm.environment.set("STAFF_ID", json.user.id);
    console.log("STAFF_ID successfully updated to: " + json.user.id);
  } else {
    console.error("Could not find json.user.id in the response");
  }
} else {
  console.error("Login request was not successful");
}
```

**Sets:** `ACCESS_TOKEN`, `REFRESH_TOKEN`, `STAFF_ID` (Initially holds User Account ID)

---

### 0.2 — Register Member User (Pattern A Fix)

**Request:** `POST {{BASE_URL}}/auth/register`
**Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "staff@chms.com",
  "password": "Password123!",
  "role": "staff"
}
```

**No Post-response script needed here.**

---

### 0.3 — Login as Member (Pattern A Fix)

**Request:** `POST {{BASE_URL}}/auth/login`
**Body:**

```json
{
  "email": "staff@chms.com",
  "password": "Password123!"
}
```

**Post-response script — temporarily replace the script on `POST Login`, run it once, then restore the super admin script:**

```js
// Parse the response body safely
// Parse the response body safely
const json = pm.response.json();

if (json && json.success) {
  // 1. Set the member authentication token (flat structure)
  pm.environment.set("MEMBER_TOKEN", json.accessToken);
  console.log("MEMBER_TOKEN successfully updated!");

  // 2. Set the member user account ID (flat structure)
  if (json.user && json.user.id) {
    pm.environment.set("MEMBER_USER_ID", json.user.id);
    console.log("MEMBER_USER_ID successfully saved: " + json.user.id);
  } else {
    console.error("Could not find json.user.id in the response");
  }
} else {
  console.error("Member login failed or success flag is false");
}
```

**Sets:** `MEMBER_TOKEN`

> After running, restore the super admin Post-response script (Step 0.1) and log back in as super admin.

---

## 1. AUTH

### POST Login

**Request:** `POST {{BASE_URL}}/auth/login`
**Body:**

```json
{
  "email": "superadmin@chms.com",
  "password": "Password123!"
}
```

**Post-response script:**

```js
// Parse the response body safely
const json = pm.response.json();

if (json && json.success) {
  // 1. Set the tokens (Notice there is NO '.data')
  pm.environment.set("ACCESS_TOKEN", json.accessToken);
  pm.environment.set("REFRESH_TOKEN", json.refreshToken);

  // 2. Set the staff ID using the new mapped "id" key
  if (json.user && json.user.id) {
    pm.environment.set("STAFF_ID", json.user.id);
    console.log("STAFF_ID successfully updated to: " + json.user.id);
  } else {
    console.error("Could not find json.user.id in the response");
  }
} else {
  console.error("Login request was not successful");
}
```

### POST Register (admin only)

**Request:** `POST {{BASE_URL}}/auth/register`
**Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "member@chms.com",
  "password": "Password123!",
  "role": "member"
}
```

**No Post-response script.**

### POST Refresh Token

**Request:** `POST {{BASE_URL}}/auth/refresh`
**Body:**

```json
{
  "refreshToken": "{{REFRESH_TOKEN}}"
}
```

**No Post-response script.**

### POST Logout

**Request:** `POST {{BASE_URL}}/auth/logout`
**Body:**

```json
{
  "refreshToken": "{{REFRESH_TOKEN}}"
}
```

**No Post-response script.**

### POST Change Password

**Request:** `POST {{BASE_URL}}/auth/change-password`
**Body:**

```json
{
  "currentPassword": "Password123!",
  "newPassword": "Password456!"
}
```

**No Post-response script.**

---

## 2. MEMBERS

**Note:** Create a fellowship (## 4) before testing the members route

### POST Create Member

**Request:** `POST {{BASE_URL}}/members`
**Body:**

```json
{
  "firstName": "Grace",
  "lastName": "Adeleke",
  "email": "grace.adeleke@chms.com",
  "phone": "08012345678",
  "memberStatus": "active",
  "fellowshipId": "{{FELLOWSHIP_ID}}"
}
```

**Post-response script — already in collection on `POST Create Member`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("MEMBER_ID", json.data._id);
}
```

**Sets:** `MEMBER_ID`

### GET All Members — no body

**Request:** `GET {{BASE_URL}}/members?page=1&limit=20`

### GET Member by ID — no body

**Request:** `GET {{BASE_URL}}/members/{{MEMBER_ID}}`

### GET Member Attendance — no body

**Request:** `GET {{BASE_URL}}/members/{{MEMBER_ID}}/attendance`

### PUT Update Member

**Request:** `PUT {{BASE_URL}}/members/{{MEMBER_ID}}`
**Body:**

```json
{
  "phone": "08099999999",
  "memberStatus": "active"
}
```

**No Post-response script.**

### DEL Delete Member — no body

**Request:** `DELETE {{BASE_URL}}/members/{{MEMBER_ID}}`

---

## 3. ORG UNITS

### POST Create Org Unit

**Request:** `POST {{BASE_URL}}/org-units`
**Body:**

```json
{
  "name": "Worship Department",
  "type": "department",
  "description": "Handles all worship and music ministry",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Org Unit`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("ORG_UNIT_ID", json.data._id);
}
```

**Sets:** `ORG_UNIT_ID`

### GET All Org Units — no body

**Request:** `GET {{BASE_URL}}/org-units`

### GET Org Unit by ID — no body

**Request:** `GET {{BASE_URL}}/org-units/{{ORG_UNIT_ID}}`

### PUT Update Org Unit

**Request:** `PUT {{BASE_URL}}/org-units/{{ORG_UNIT_ID}}`
**Body:**

```json
{
  "name": "Worship & Creative Arts Department",
  "description": "Handles worship, music, and creative arts ministry",
  "isActive": true
}
```

**No Post-response script.**

### DEL Delete Org Unit — no body

**Request:** `GET {{BASE_URL}}/org-units/{{ORG_UNIT_ID}}`

### POST Assign Leader

**Request:** `GET {{BASE_URL}}/org-units/{{ORG_UNIT_ID}}/assign-leader`
**Body:**

```json
{
  "leaderId": "{{MEMBER_ID}}"
}
```

**No Post-response script.**

---

## 4. FELLOWSHIPS

### POST Create Fellowship

**Request:** `POST {{BASE_URL}}/fellowships`
**Body:**

```json
{
  "name": "Young Adults Fellowship",
  "description": "Fellowship group for young adults aged 18-35",
  "meetingDay": "Sunday",
  "meetingTime": "16:00",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Fellowship`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("FELLOWSHIP_ID", json.data._id);
}
```

**Sets:** `FELLOWSHIP_ID`

### GET All Fellowships — no body

**Request:** `GET {{BASE_URL}}/fellowships`

### GET Fellowship by ID — no body

**Request:** `GET {{BASE_URL}}/fellowships/{{FELLOWSHIP_ID}}`

### GET Fellowship Members — no body

**Request:** `GET {{BASE_URL}}/fellowships/{{FELLOWSHIP_ID}}/members`

### PUT Update Fellowship

**Request:** `PUT {{BASE_URL}}/fellowships/{{FELLOWSHIP_ID}}`
**Body:**

```json
{
  "name": "Young Adults & Singles Fellowship",
  "meetingDay": "Saturday",
  "meetingTime": "17:00",
  "isActive": true
}
```

**No Post-response script.**

### DEL Delete Fellowship — no body

**Request:** `DELETE {{BASE_URL}}/fellowships/{{FELLOWSHIP_ID}}`

---

## 5. STAFF

### POST Create Staff (Primary Record)

**Logged in as:** super admin (`ACCESS_TOKEN`)
**Request:** `POST {{BASE_URL}}/staff`
**Body:**

```json
{
  "userId": "{{STAFF_ID}}",
  "position": "Church Administrator",
  "department": "Administration",
  "isVolunteer": false,
  "hireDate": "2024-01-01",
  "isActive": true
}
```

**Note:** `{{STAFF_ID}}` is initially set to the User Account ID directly by the `POST /auth/login` script.

**Post-response script — already in collection on `POST Create Staff`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("STAFF_ID", json.data._id);
  console.log(
    "STAFF_ID safely updated to Staff Profile Document ID: " + json.data._id,
  );
}
```

**Sets:** `STAFF_ID` (Overwrites the variable with the final Staff Profile Document `_id`)

---

### POST Create Staff (Second Record — for Delete test)

**Step A:** Register a second user while logged in as super admin.
**Request:** `POST {{BASE_URL}}/auth/register`

```json
{
  "firstName": "James",
  "lastName": "Okafor",
  "email": "admin@chms.com",
  "password": "Password123!",
  "role": "admin"
}
```

**No Post-response script.**

**Step B:** Login as `admin@chms.com` to get their `id`.
`POST {{BASE_URL}}/auth/login`

```json
{
  "email": "admin@chms.com",
  "password": "Password123!"
}
```

**Temporary Post-response script for this login only:**

```js
const json = pm.response.json();
if (json && json.success && json.user && json.user.id) {
  pm.environment.set("ADMIN_USER_ID", json.user.id);
}
```

**Sets:** `ADMIN_USER_ID`

> After running, log back in as super admin to restore your primary `ACCESS_TOKEN` and original `STAFF_ID`.

**Step C:** Create the second Staff record.
`POST {{BASE_URL}}/staff`

```json
{
  "userId": "{{ADMIN_USER_ID}}",
  "position": "Youth Coordinator",
  "department": "Youth Ministry",
  "isVolunteer": false,
  "hireDate": "2024-03-01",
  "isActive": true
}
```

**No Post-response script** — `STAFF_ID` remains pointing to the primary staff profile record.

### GET All Staff — no body

**Request:** `GET {{BASE_URL}}/staff`

### GET Staff by ID — no body

**Request:** `GET {{BASE_URL}}/staff/{{STAFF_ID}}`

No Post-response script.

### PUT Update Staff

**Request:** `PUT {{BASE_URL}}/staff/{{STAFF_ID}}`

**Body:**

```json
{
  "position": "Senior Church Administrator",
  "department": "Administration & Operations",
  "isVolunteer": false,
  "isActive": true
}
```

No Post-response script.

### DEL Delete Staff — no body

**Request:** `DELETE {{BASE_URL}}/staff/{{STAFF_ID}}`

No Post-response script.

---

## 6. FINANCE

### POST Record Contributions

**Request:** `POST {{BASE_URL}}/finance/contributions`
**Body:**

```json
{
  "eventId": "{{EVENT_ID}}",
  "totalAmount": 5000,
  "date": "2025-05-01",
  "notes": "Monthly tithe",
  "category": "tithe",
  "channel": "transfer"
}
```

**No Post-response script.**

### GET List Contributions — no body

**Request:** `GET {{BASE_URL}}/finance/contributions`

### POST Log Expense

**Request:** `POST {{BASE_URL}}/finance/expenses`
**Body:**

```json
{
  "title": "Sound equipment maintenance",
  "amount": 15000,
  "category": "operations",
  "date": "2025-05-01",
  "vendorId": "{{VENDOR_ID}}"
}
```

**No Post-response script.**

### GET List Expenses — no body

**Request:** `GET {{BASE_URL}}/finance/expenses`

### GET Finance Summary — no body

**Request:** `GET {{BASE_URL}}/finance/summary`

---

## 7. EVENTS

### POST Create Event

**Request:** `POST {{BASE_URL}}/events`
**Body:**

```json
{
  "title": "Midweek Service",
  "description": "Weekly Thursday worship service",
  "date": "2025-06-04",
  "startTime": "17:30",
  "endTime": "19:30",
  "location": "Main Auditorium",
  "type": "service"
}
{
  "title": "Sunday Service",
  "description": "Weekly Sunday worship service",
  "date": "2025-06-01",
  "startTime": "09:00",
  "endTime": "12:00",
  "location": "Main Auditorium",
  "type": "service"
}
```

**Post-response script — already in collection on `POST Create Event`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("EVENT_ID", json.data._id);
}
```

**Sets:** `EVENT_ID`

### GET All Events — no body

**Request:** `GET {{BASE_URL}}/events`

### GET Event by ID — no body

**Request:** `GET {{BASE_URL}}/events/{{EVENT_ID}}`

### PUT Update Event

**Request:** `PUT {{BASE_URL}}/events/{{EVENT_ID}}`
**Body:**

```json
{
  "title": "Sunday Worship Service",
  "location": "Main Auditorium — Hall A"
}
```

**No Post-response script.**

### DEL Delete Event — no body

**Request:** `DELETE {{BASE_URL}}/events/{{EVENT_ID}}`

### POST Record Attendance

**Request:** `POST {{BASE_URL}}/events/{{EVENT_ID}}`
**Body:**

```json
{
  "memberId": "{{MEMBER_ID}}",
  "status": "present"
}
```

**No Post-response script.**

### GET Event Attendance — no body

**Request:** `POST {{BASE_URL}}/events/{{EVENT_ID}}/attendance`

---

## 8. INVENTORY

### POST Create Item

**Request:** `POST {{BASE_URL}}/inventory`
**Body:**

```json
{
  "name": "Wireless Microphone",
  "description": "Shure SM58 wireless microphone",
  "quantity": 4,
  "unit": "pieces",
  "category": "audio equipment",
  "isActive": true
}
{
  "name": "Keyboard Synthesizer",
  "description": "Yamaha QX-77",
  "quantity": 1,
  "unit": "pieces",
  "category": "musical equipment",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Item`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("ITEM_ID", json.data._id);
}
```

**Sets:** `ITEM_ID`

### GET All Inventory — no body

**Request:** `GET {{BASE_URL}}/inventory`

### GET Item by ID — no body

**Request:** `GET {{BASE_URL}}/inventory/{{ITEM_ID}}`

### PUT Update Item

**Request:** `PUT {{BASE_URL}}/inventory/{{ITEM_ID}}`
**Body:**

```json
{
  "quantity": 5,
  "description": "Shure SM58 wireless microphone — updated stock"
}
```

**No Post-response script.**

### PUT Link Expense

**Request:** `PUT {{BASE_URL}}/inventory/{{ITEM_ID}}/link-expense`
**Body:**

```json
{
  "expenseId": "{{EXPENSE_ID}}"
}
```

**No Post-response script.**

### DEL Delete Item — no body

**Request:** `DELETE {{BASE_URL}}/inventory/{{ITEM_ID}}`

---

## 9. VENDORS

### POST Create Vendor

**Request:** `POST {{BASE_URL}}/vendors`
**Body:**

```json
{
  "name": "Covenant Sound Solutions",
  "contactPerson": "Tunde Balogun",
  "email": "tunde@covenantsound.com",
  "phone": "08055566677",
  "address": "12 Lagos Island, Lagos",
  "isActive": true
}
{
  "name": "Digital Communications Solutions",
  "contactPerson": "Ifeanyi Adams",
  "email": "ifeanyi@dcs.com",
  "phone": "08055566678",
  "address": "12 Lagos Island, Lagos",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Vendor`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("VENDOR_ID", json.data._id);
}
```

**Sets:** `VENDOR_ID`

### GET All Vendors — no body

**Request:** `POST {{BASE_URL}}/vendors`

### GET Vendor by ID — no body

**Request:** `POST {{BASE_URL}}/vendors/ {{VENDOR_ID}}`

### PUT Update Vendor

**Request:** `PUT {{BASE_URL}}/vendors/{{VENDOR_ID}}`
**Body:**

```json
{
  "contactPerson": "Tunde Balogun Jr.",
  "phone": "08055566699"
}
```

**No Post-response script.**

### DEL Delete Vendor — no body

**Request:** `DELETE {{BASE_URL}}/vendors/{{VENDOR_ID}}`

## 10. WELFARE

### POST Create Case

**Request:** `POST {{BASE_URL}}/welfare`
**Body:**

```json
{
  "memberId": "{{MEMBER_ID}}",
  "type": "financial",
  "description": "Member requires support for medical bills",
  "status": "open",
  "priority": "high"
}
{
  "memberId": "{{MEMBER_ID}}",
  "type": "financial",
  "description": "Member requires support for his business",
  "status": "open",
  "priority": "high"
}
```

**Post-response script — already in collection on `POST Create Case`:**

```js
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("CASE_ID", json.data._id);
}
```

**Sets:** `CASE_ID`

### GET All Cases — no body

**Request:** `GET {{BASE_URL}}/welfare`

### GET Case by ID — no body

**Request:** `GET {{BASE_URL}}/welfare/{{CASE_ID}}`

### PUT Update Case

**Request:** `PUT {{BASE_URL}}/welfare/{{CASE_ID}}`
**Body:**

```json
{
  "status": "in_progress",
  "priority": "medium"
}
```

**No Post-response script.**

### POST Add Support Log

**Request:** `PUT {{BASE_URL}}/welfare/{{CASE_ID}}/support-log`
**Body:**

```json
{
  "note": "Contacted member. Medical bill support of N50,000 approved.",
  "supportedBy": "{{STAFF_ID}}"
}
```

**No Post-response script.**

### GET Support Log — no body

**Request:** `GET {{BASE_URL}}/welfare/{{CASE_ID}}/support-log`

---

## 11. ANNOUNCEMENTS

### POST Create Announcement

**Request:** `POST {{BASE_URL}}/announcements`
**Body:**

```json
{
  "title": "Easter Sunday Service",
  "body": "Join us for our special Easter Sunday service on April 20th at 9am.",
  "audience": "all",
  "publishDate": "2025-04-15",
  "isActive": true
}
{
  "title": "Easter Monday BBQ",
  "body": "Join us for our special Easter Monday BBQ hangout June 30th from 2pm.",
  "audience": "all",
  "publishDate": "2025-04-15",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Announcement`:**

```js
if (pm.response.code === 201 || pm.response.code === 200) {
  const json = pm.response.json();
  if (json.data && json.data._id)
    pm.environment.set("ANNOUNCEMENT_ID", json.data._id);
}
```

**Sets:** `ANNOUNCEMENT_ID`

### GET All Announcements — no body

**Request:** `GET {{BASE_URL}}/announcements`

### GET Announcement by ID — no body

**Request:** `GET {{BASE_URL}}/announcements/{{ANNOUNCEMENT_ID}}`

### PUT Update Announcement

**Request:** `PUT {{BASE_URL}}/announcements/{{ANNOUNCEMENT_ID}}`
**Body:**

```json
{
  "title": "Easter Sunday Service — Updated Venue",
  "content": "Join us for our special Easter Sunday service on April 20th at 9am in the Main Auditorium.",
  "isActive": true
}
```

**No Post-response script.**

### DEL Delete Announcement — no body

**Request:** `DELETE {{BASE_URL}}/announcements/{{ANNOUNCEMENT_ID}}`

---

## 12. MISSIONS

### POST Create Mission

**Request:** `POST {{BASE_URL}}/missions`
**Body:**

```json
{
  "title": "Lagos Outreach 2025",
  "description": "Community evangelism outreach across Lagos mainland",
  "location": "Lagos Mainland",
  "startDate": "2025-07-01",
  "endDate": "2025-07-07",
  "status": "planned",
  "isActive": true
}
{
  "title": "Ibadan Outreach 2026",
  "description": "Community evangelism outreach across Lagos mainland",
  "location": "Ibadan",
  "startDate": "2025-07-01",
  "endDate": "2025-07-07",
  "status": "planned",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Mission`:**

```js
if (pm.response.code === 201 || pm.response.code === 200) {
  const json = pm.response.json();
  if (json.data && json.data._id)
    pm.environment.set("MISSION_ID", json.data._id);
}
```

**Sets:** `MISSION_ID`

### GET All Missions — no body

**Request:** `GET {{BASE_URL}}/missions`

### GET Mission by ID — no body

**Request:** `GET {{BASE_URL}}/missions/{{MISSION_ID}}`

### PUT Update Mission

**Request:** `PUT {{BASE_URL}}/missions/{{MISSION_ID}}`
**Body:**

```json
{
  "status": "active",
  "description": "Community evangelism outreach across Lagos mainland — registration open"
}
```

**No Post-response script.**

### POST Add Volunteer

**Request:** `POST {{BASE_URL}}/missions/{{MISSION_ID}}/volunteers`
**Body:**

```json
{
  "volunteerId": "{{MEMBER_USER_ID}}"
}
```

**No Post-response script.**

### GET Mission Volunteers — no body

**Request:** `POST {{BASE_URL}}/missions/{{MISSION_ID}}/volunteers`

---

## 13. PROGRAMS

### POST Create Program

**Request:** `POST {{BASE_URL}}/programs`
**Body:**

```json
{
  "title": "Discipleship Class 2025",
  "description": "12-week discipleship training for new members",
  "type": "missions",
  "startDate": "2025-06-01",
  "endDate": "2025-08-24",
  "status": "upcoming",
  "isActive": true
}
{
  "title": "Training of Community Youths",
  "description": "12-week skills acquisition programme for community youths",
  "type": "empowerment",
  "startDate": "2025-06-01",
  "endDate": "2025-08-24",
  "status": "upcoming",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Program`:**

```js
if (pm.response.code === 201 || pm.response.code === 200) {
  const json = pm.response.json();
  if (json.data && json.data._id)
    pm.environment.set("PROGRAM_ID", json.data._id);
}
```

**Sets:** `PROGRAM_ID`

### GET All Programs — no body

**Request:** `GET {{BASE_URL}}/programs`

### GET Program by ID — no body

**Request:** `GET {{BASE_URL}}/programs/{{PROGRAM_ID}}`

### PUT Update Program

**Request:** `PUT {{BASE_URL}}/programs/{{PROGRAM_ID}}`
**Body:**

```json
{
  "status": "active",
  "description": "12-week discipleship training for new members — now enrolling"
}
```

**No Post-response script.**

### POST Add Session

**Request:** `POST {{BASE_URL}}/programs/{{PROGRAM_ID}}/sessions`
**Body:**

```json
{
  "sessionNumber": 1,
  "title": "Session 1 — Introduction to Faith",
  "date": "2025-06-01",
  "startTime": "10:00",
  "endTime": "12:00",
  "facilitator": "{{STAFF_ID}}"
}
```

**No Post-response script.**

### POST Enroll Member

**Request:** `POST {{BASE_URL}}/programs/{{PROGRAM_ID}}/enroll`
**Body:**

```json
{
  "memberId": "{{MEMBER_ID}}"
}
```

**No Post-response script.**

### GET Participants — no body

**Request:** `GET {{BASE_URL}}/programs/{{PROGRAM_ID}}/participants`

### DEL Delete Program — no body

**Request:** `DELETE {{BASE_URL}}/programs/{{PROGRAM_ID}}`

---

## 14. DOCUMENTS

### POST Upload Document

**Request:** `POST {{BASE_URL}}/documents`
**Body:** `form-data`

| Key          | Value                               |
| ------------ | ----------------------------------- |
| `file`       | _(select a file from your machine)_ |
| `entityType` | `member`                            |
| `entityId`   | `{{MEMBER_ID}}`                     |
| `title`      | `Member Registration Form`          |

| Key          | Value                               |
| ------------ | ----------------------------------- |
| `file`       | _(select a file from your machine)_ |
| `entityType` | `member`                            |
| `entityId`   | `{{MEMBER_ID}}`                     |
| `title`      | `Child Dedication Form`             |

**Post-response script — already in collection on `POST Upload Document`:**

```js
if (pm.response.code === 201 || pm.response.code === 200) {
  const json = pm.response.json();
  if (json.data && json.data._id)
    pm.environment.set("DOCUMENT_ID", json.data._id);
}
```

**Sets:** `DOCUMENT_ID`

### GET All Documents — no body (query params `entityType` and `entityId` are optional)

**Request:** `GET {{BASE_URL}}/documents?entityType=&entityId=`

### GET Document by ID — no body

**Request:** `GET {{BASE_URL}}/documents/{{DOCUMENT_ID}}`

### DEL Delete Document — no body

**Request:** `DELETE {{BASE_URL}}/documents/{{DOCUMENT_ID}}`

---

## 15. MEDIA

### POST Create Media Entry

**Request:** `POST {{BASE_URL}}/media`
**Body:**

```json
{
  "title": "Sunday Service Sermon — May 2025",
  "type": "video",
  "description": "Full sermon recording from Sunday May 24th service",
  "url": "[https://youtu.be/example123](https://youtu.be/example123)",
  "isActive": true
}
{
  "title": "Midweek Service Sermon — May 2025",
  "type": "video",
  "description": "Full sermon recording from Midweek May 28th service",
  "url": "[https://youtu.be/example123](https://youtu.be/example123)",
  "isActive": true
}
```

**Post-response script — already in collection on `POST Create Media Entry`:**

```js
if (pm.response.code === 201 || pm.response.code === 200) {
  const json = pm.response.json();
  if (json.data && json.data._id) pm.environment.set("MEDIA_ID", json.data._id);
}
```

**Sets:** `MEDIA_ID`

### GET All Media — no body

**Request:** `POST {{BASE_URL}}/media`

### GET Media by ID — no body

**Request:** `POST {{BASE_URL}}/media/{{MEDIA_ID}}`

### PUT Update Media

**Request:** `PUT {{BASE_URL}}/media/{{MEDIA_ID}}`
**Body:**

```json
{
  "title": "Midweek Service Sermon — May 28th 2025",
  "description": "Full sermon recording — Pastor James Okafor"
}
```

**No Post-response script.**

### POST Upload Media File

**Request:** `POST {{BASE_URL}}/media/{{MEDIA_ID}}/upload`
**Body:** `form-data`

| Key    | Value                               |
| ------ | ----------------------------------- |
| `file` | _(select a video/audio/image file)_ |

**No Post-response script.**

### DEL Delete Media — no body

**Request:** `DELETE {{BASE_URL}}/media/{{MEDIA_ID}}`

---

## 16. REPORTS

All report endpoints are GET with query parameters. No body, no Post-response scripts.

### GET Attendance Report

**Request**: `{{BASE_URL}}/reports/attendance?from=2025-01-01&to=2025-12-31`

### GET Finance Report

**Request**: `{{BASE_URL}}/reports/finance?period=monthly`

### GET Programs Report

**Request**: `{{BASE_URL}}/reports/programs`

---

## 17. AUDIT

All audit endpoints are GET. No body, no Post-response scripts.

### GET Audit Logs

URL: `{{BASE_URL}}/audit?page=1&limit=20`

---

# Environment Variables — Who Sets What

This section details the environment variables required for running the automated testing collection in Postman for the Church Management System (ChMS). Ensure your environment template (`ChMS Local.postman_environment.json`) is updated accordingly.

| Variable Name         | Set By (Endpoint / Step)            | Collection Sequence | Scope / Purpose                                                                         |
| :-------------------- | :---------------------------------- | :------------------ | :-------------------------------------------------------------------------------------- |
| **`BASE_URL`**        | _Manually Configured_               | Pre-Run Setup       | Root API target URL (Default: `http://localhost:5000/api/v1`)                           |
| **`ACCESS_TOKEN`**    | `POST /auth/login` (Super Admin)    | Step 0.1            | Primary Bearer Token used for administrative requests                                   |
| **`REFRESH_TOKEN`**   | `POST /auth/login` (Super Admin)    | Step 0.1            | Used to request updated access tokens without full re-authentication                    |
| **`MEMBER_USER_ID`**  | `POST /auth/login` (Member Account) | Step 0.3            | The unique **User Account ID** (`users` collection) for member authentication tracking  |
| **`MEMBER_TOKEN`**    | `POST /auth/login` (Member Account) | Step 0.3            | Dedicated authorization token for simulating lower-privileged member actions            |
| **`MEMBER_ID`**       | `POST /members`                     | Section 2           | The unique **Member Profile ID** (`members` collection) for tracking directory records  |
| **`ORG_UNIT_ID`**     | `POST /groups/org-units`            | Section 3           | Administrative structural division node (e.g., Ministries, Departments)                 |
| **`FELLOWSHIP_ID`**   | `POST /groups/fellowships`          | Section 4           | Small group / home fellowship location tracking reference                               |
| **`STAFF_ID`**        | `POST /staff`                       | Section 5           | Unique tracking reference link for a certified team/staff profile                       |
| **`EVENT_ID`**        | `POST /events`                      | Section 7           | Unique event tracking instance identifier used for attendance and event giving          |
| **`EXPENSE_ID`**      | `POST /finance/expenses`            | Section 6           | Unique financial transaction identifier tracking an outgoing church cost                |
| **`VENDOR_ID`**       | `POST /finance/vendors`             | Section 6           | Corporate profile marker for a merchant/supplier providing services or inventory        |
| **`ITEM_ID`**         | `POST /inventory`                   | Section 8           | Unique tracking ID for a physical operational asset                                     |
| **`CASE_ID`**         | `POST /care`                        | Section 9           | Unique management record tracker for specialized member follow-ups or counseling        |
| **`ANNOUNCEMENT_ID`** | `POST /announcements`               | Section 11          | Direct notice identifier for caching, targeting, and displaying church feeds            |
| **`MISSION_ID`**      | `POST /missions`                    | Section 12          | Outreach program identifier used to link deployment projects and global initiatives     |
| **`PROGRAM_ID`**      | `POST /programs`                    | Section 13          | Systematic curriculum tracking instance (e.g., Foundation School, Discipleship Classes) |
| **`DOCUMENT_ID`**     | `POST /documents`                   | Section 14          | Portal management link tracking legal forms, template uploads, or policy files          |
| **`MEDIA_ID`**        | `POST /media`                       | Section 15          | Direct resource marker tracking multimedia file objects linked with Cloudinary storage  |

---

### Key Operational Rules for the Team:

1. **User ID vs. Member ID Distinction:** \* Always pass `{{MEMBER_USER_ID}}` when hitting validation gateways checking the `users` authentication collection (e.g., **`POST /missions/{{MISSION_ID}}/volunteers`**).
   - Pass `{{MEMBER_ID}}` when updating data models inside the core profile directories or tracking giving histories.
2. **Finance & Inventory Workflows:**
   - Do not mix up `{{VENDOR_ID}}` (the profile card for a supplier) with `{{EXPENSE_ID}}` (the literal receipt voucher record). To successfully link asset acquisition parameters, make sure your **`PUT /inventory/{{ITEM_ID}}/link-expense`** payload explicitly passes `{{EXPENSE_ID}}`.

---
