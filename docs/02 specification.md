# ChMS Capstone Project
## Document II — Technical Specification
### System Architecture, Data Models, API Contracts & Business Rules

---

| Field | Detail |
|---|---|
| Version | 1.0 |
| Date | May 5, 2026 |
| Status | ACTIVE |

---

## 1. System Architecture

### 1.1 Architectural Pattern

```
Client (Postman / Frontend)
         |
    Express Router           →  Route definitions only
         |
    Middleware Layer         →  Auth, RBAC, Validation, Upload
         |
    Controller Layer         →  HTTP in/out — thin; delegates immediately
         |
    Service Layer            →  All business logic lives here
         |
    Model Layer (Mongoose)   →  Schema + DB interaction
         |
    MongoDB Atlas
```

### 1.2 Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v20 LTS | Runtime |
| Express.js | ^4.18 | HTTP framework |
| MongoDB | ^7.x (Atlas) | Primary database |
| Mongoose | ^8.x | ODM — schemas & queries |
| jsonwebtoken | ^9.x | JWT auth tokens |
| bcryptjs | ^2.x | Password hashing |
| multer | ^1.x | File upload handling |
| cloudinary | ^2.x | Cloud media storage |
| joi | ^17.x | Request validation |
| express-rate-limit | ^7.x | Rate limiting |
| cors | ^2.x | CORS handling |
| dotenv | ^16.x | Environment config |
| jest + supertest | ^29.x / ^6.x | Testing |

---

## 2. Data Models

> All models include `timestamps: true`. ObjectId references are indexed. Soft-deletes use `isActive: Boolean`.

### 2.1 User

```js
User {
  _id           : ObjectId
  firstName     : String  [required]
  lastName      : String  [required]
  email         : String  [required, unique, lowercase]
  password      : String  [required, hashed]
  role          : Enum    [super_admin, admin, pastor, finance_officer,
                           welfare_officer, staff, volunteer]
  phone         : String
  profileImage  : String  [Cloudinary URL]
  isActive      : Boolean [default: true]
  lastLogin     : Date
  timestamps    : true
}
```

### 2.2 Member

```js
Member {
  _id           : ObjectId
  firstName     : String  [required]
  lastName      : String  [required]
  email         : String  [optional, unique sparse]
  phone         : String
  gender        : Enum    [male, female, other]
  dateOfBirth   : Date
  address       : String
  memberStatus  : Enum    [active, inactive, visitor, transferred]
  fellowshipId  : ObjectId → Fellowship
  joinDate      : Date    [default: now]
  profileImage  : String  [Cloudinary URL]
  isActive      : Boolean [default: true]
  timestamps    : true
}
```

### 2.3 OrganizationalUnit

```js
OrganizationalUnit {
  _id         : ObjectId
  name        : String  [required]
  type        : Enum    [zone, area, district, region]
  parentId    : ObjectId → OrganizationalUnit [nullable]
  leaderId    : ObjectId → User
  description : String
  isActive    : Boolean [default: true]
  timestamps  : true
}
```

### 2.4 Fellowship

```js
Fellowship {
  _id         : ObjectId
  name        : String  [required]
  unitId      : ObjectId → OrganizationalUnit
  leaderId    : ObjectId → Member
  meetingDay  : Enum    [monday..sunday]
  meetingTime : String
  location    : String
  isActive    : Boolean [default: true]
  timestamps  : true
}
```

### 2.5 Event

```js
Event {
  _id         : ObjectId
  title       : String  [required]
  type        : Enum    [service, ceremony, special, fellowship]
  description : String
  date        : Date    [required]
  startTime   : String
  endTime     : String
  location    : String
  createdBy   : ObjectId → User
  isActive    : Boolean [default: true]
  timestamps  : true
}
```

### 2.6 Attendance

```js
Attendance {
  _id         : ObjectId
  eventId     : ObjectId → Event  [required, indexed]
  memberId    : ObjectId → Member [required, indexed]
  checkedInAt : Date [default: now]
  method      : Enum [manual, qr]
  recordedBy  : ObjectId → User
  timestamps  : true
  // Compound unique index: { eventId, memberId }
}
```

### 2.7 ServiceContribution

```js
ServiceContribution {
  _id         : ObjectId
  eventId     : ObjectId → Event [required]
  date        : Date   [required]
  category    : Enum   [tithe, offering, donation, special]
  channel     : Enum   [cash, transfer, pos, online]
  totalAmount : Number [required, min: 0]
  currency    : String [default: 'NGN']
  notes       : String
  recordedBy  : ObjectId → User
  timestamps  : true
  // Tracks totals per service — NOT per individual
}
```

### 2.8 Expense

```js
Expense {
  _id        : ObjectId
  title      : String [required]
  category   : Enum   [operations, welfare, missions, programs, maintenance, other]
  amount     : Number [required, min: 0]
  currency   : String [default: 'NGN']
  date       : Date   [required]
  vendorId   : ObjectId → Vendor
  receiptUrl : String [Cloudinary URL]
  approvedBy : ObjectId → User
  notes      : String
  timestamps : true
}
```

### 2.9 Program

```js
Program {
  _id             : ObjectId
  title           : String [required]
  type            : Enum   [empowerment, pre_marital, parental, missions, other]
  description     : String
  startDate       : Date
  endDate         : Date
  sessions        : [{
    sessionNumber : Number
    title         : String
    date          : Date
    facilitator   : ObjectId → User
  }]
  coordinatorId   : ObjectId → User
  maxParticipants : Number
  isActive        : Boolean [default: true]
  timestamps      : true
}
```

### 2.10 Additional Models

| Model | Key Fields | Purpose |
|---|---|---|
| Staff | userId, position, department, isVolunteer, hireDate | Staff records |
| WelfareCase | memberId, type, status, supportLog[] | Beneficiary tracking |
| InventoryItem | name, category, quantity, vendorId, unitCost | Asset tracking |
| Vendor | name, contactPerson, phone, email, category | Supplier records |
| ProgramEnrollment | programId, memberId, enrolledAt, status, outcomes | Participant tracking |
| Announcement | title, body, audience, publishedAt | Communication |
| MediaResource | title, type, fileUrl, public_id, price, quantity | Books, audio, digital |
| Mission | title, location, budget, volunteers[], status | Outreach tracking |
| AuditLog | userId, action, entity, entityId, changes, ip | Audit trail |

---

## 3. API Contracts

> **Base URL:** `/api/v1` | **Auth:** `Authorization: Bearer <token>` | **Response:** `{ success, data, message, error }`

### 3.1 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | super_admin | Create user account |
| POST | `/auth/login` | None | Login — returns tokens |
| POST | `/auth/refresh` | Refresh token | Rotate access token |
| POST | `/auth/logout` | Bearer | Invalidate session |
| POST | `/auth/change-password` | Bearer | Change own password |

### 3.2 Members

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/members` | admin, pastor, staff | List members (paginated) |
| POST | `/members` | admin, pastor | Create member |
| GET | `/members/:id` | admin, pastor, staff | Get member |
| PUT | `/members/:id` | admin, pastor | Update member |
| DELETE | `/members/:id` | admin | Soft delete |
| GET | `/members/:id/attendance` | admin, pastor, staff | Attendance history |

### 3.3 Finance

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/finance/contributions` | finance_officer, admin | Record contribution |
| GET | `/finance/contributions` | finance_officer, admin | List contributions |
| POST | `/finance/expenses` | finance_officer, admin | Log expense |
| GET | `/finance/expenses` | finance_officer, admin | List expenses |
| GET | `/finance/summary` | admin | Income vs expense summary |

### 3.4 Events & Attendance

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/events` | all authenticated | List events |
| POST | `/events` | admin, pastor | Create event |
| GET | `/events/:id` | all authenticated | Get event |
| PUT | `/events/:id` | admin, pastor | Update event |
| POST | `/events/:id/attendance` | staff, admin | Record attendance |
| GET | `/events/:id/attendance` | admin, pastor, staff | Get attendance |

### 3.5 Additional API Groups

| Group | Coverage |
|---|---|
| `/org-units` | CRUD + leader assignment |
| `/fellowships` | CRUD + member list |
| `/staff` | Staff CRUD |
| `/programs` | Program CRUD + sessions + enrollment |
| `/welfare` | Case CRUD + support log |
| `/inventory` | Asset CRUD + expense linkage |
| `/vendors` | Vendor CRUD |
| `/announcements` | Create + target audience + publish |
| `/media` | Catalog + Cloudinary upload |
| `/missions` | Mission CRUD + volunteer assignment |
| `/reports` | Attendance, finance, programs |
| `/audit` | Read-only (super_admin only) |

---

## 4. RBAC Matrix

| Module | super_admin | admin | pastor | finance | welfare | staff |
|---|---|---|---|---|---|---|
| User Management | Full | Create/Edit | View | None | None | None |
| Members | Full | Full | Read/Edit | View | View | View |
| Org Units | Full | Full | View | None | None | None |
| Events | Full | Full | Full | View | View | Create |
| Finance | Full | Full | View | Full | None | None |
| Welfare | Full | Full | View | View | Full | View |
| Programs | Full | Full | Full | View | View | View |
| Inventory | Full | Full | None | View | None | View |
| Audit Logs | Full | View | None | None | None | None |

---

## 5. Key Business Rules

### 5.1 Finance
- Contributions recorded as service totals — never per individual by default
- Finance summary: total income, total expenses, net balance, category breakdown
- Only `finance_officer` and `admin` can write finance records
- Currency defaults to NGN

### 5.2 Membership
- Members are data subjects, not system users — no login credentials
- Email is optional — sparse unique index
- Status flow: `visitor → active → inactive / transferred`
- Soft delete only — no hard deletes ever

### 5.3 Attendance
- Compound unique index `{ eventId, memberId }` — duplicate returns 409
- Bulk check-in supported — accepts array of memberIds
- Stats computed on-demand via aggregation

### 5.4 File Uploads
- All files: Multer → Cloudinary pipeline
- Allowed: JPEG, PNG, PDF, MP3 (per use case)
- Max size: 10MB images; 50MB audio/documents
- Store `public_id` alongside URL for future deletion

### 5.5 Programs vs Events
- Events = one-time (date + time + location)
- Programs = multi-session with enrollment
- Life events (pre-marital, parental, child dedication) are Program sub-types

---

*ChMS Capstone Project | Document II: Technical Specification | Version 1.0 | May 2026*
