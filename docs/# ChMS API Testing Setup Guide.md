# ChMS API Testing Setup Guide (Team 06)

## Pre-test Process

Before you start, in your terminal, run;
`git checkout develop`
`git pull origin develop`

This will inject the updated files from all teams into your local repo.

## 1. Import the Postman Collection

Open Postman; at the top of the side panel with the `+ ...`, click the `...` and select import; navigate to your postman folder and select the file below:

```text
postman/ChMS_API_v1.postman_collection.json
```

---

## 2. Import the Postman Environment

Still in Postman, click the ... button, select import and import the environment file from the postman folder:

```text
postman/ChMS Local.postman_environment.json
```

After importing:

- Hover over **ChMS Local** and click the circle checkbox to the right to set it as the active environment in Postman.

---

## 3. Start the Backend Server

Ensure:

- MongoDB is running
- The API server is running on:

```text
http://localhost:5000/api/v1
```

Start the server:

```bash
npm run dev
```

---

## 4. Login Using the Seeded Super Admin

Use the seeded development account:

```json
{
  "email": "superadmin@chms.com",
  "password": "Password123!"
}
```

Run:

```http
POST /api/v1/auth/login
```

The Postman tests will automatically populate:

- `ACCESS_TOKEN`
- `REFRESH_TOKEN`
  `{
    "success": true,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMGI2ZWJlMzIwNWRlYjgzYmQ3OTA0ZiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc3OTEzNDMxMiwiZXhwIjoxNzc5MTM1MjEyfQ.t_2vghIvM2zAi2uDu9CadP1eX2-Ym0zGQq-1OXh0VIY",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMGI2ZWJlMzIwNWRlYjgzYmQ3OTA0ZiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc3OTEzNDMxMiwiZXhwIjoxNzc5NzM5MTEyfQ.iz7UyxY5yKU5yN7AvE8RMrK3E4_7lrZqLB4nPzD5I8M"
    }
}`

Each developer receives their own JWT locally after login.

IMPORTANT:

- Do NOT share JWT tokens
- Only share the login credentials above

---

## 5. Read the Route Test Plan

Before testing routes, review:

```text
docs/chms_detailed_route_test_plan_markdown.md
```

This document contains:

- route-by-route testing instructions
- sample request bodies
- environment variable setup
- dependency flow
- auth validation scenarios
- Newman execution guide
- QA workflow

---

## 6. Recommended Testing Flow

Run requests in this order:

1. Login
2. Members
3. Org Units
4. Fellowships
5. Staff
6. Vendors
7. Finance
8. Inventory
9. Events
10. Welfare
11. Announcements
12. Missions
13. Programs
14. Documents
15. Media
16. Reports
17. Audit

---

## 7. Important Notes

- Some environment variables auto-populate after successful requests.
- Missing IDs can cause `404` errors during testing.
- Missing `MEMBER_TOKEN` can cause `401` errors instead of `403`.

Follow the QA guide carefully to avoid false failures.

---

## 8. Newman Test Command

```bash
newman run "postman/ChMS_API_v1.postman_collection.json" \
-e "postman/ChMS Local.postman_environment.json" \
--reporters cli,json \
--reporter-json-export newman-results.json
```
