# ChMS API Testing Setup Guide (Team 06)

## Pre-test Process

Before you start, in your terminal, run;
`git checkout develop`
`git pull origin develop`

Add to your .env file:
ADMIN_EMAIL=superadmin@chms.com
ADMIN_PASSWORD=Password123!

This will inject the updated files from all teams into your local repo.

## 1. Import the Postman Collection and Environment together

Open Postman; at the top of the side panel with the `+ ...`, click the `...` and select import; navigate to your postman folder and select the files below:

```text
postman/ChMS_API_v1.postman_collection.json
```

```text
postman/ChMS Local.postman_environment.json
```

After importing:

- Hover over **ChMS Local** and click the circle checkbox to the right to set it as the active environment in Postman.

---

## 2. Start the Backend Server

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

## 3. See Super Admin user

To seed the super_admin account, run the command below in the terminal;
`npm run seed:admin`

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

## 6. Important Notes

- Some environment variables auto-populate after successful requests.
- Missing IDs can cause `404` errors during testing.
- Missing `MEMBER_TOKEN` can cause `401` errors instead of `403`.

Follow the QA guide carefully to avoid false failures.

---

## 7. Newman Test Command

```bash
newman run "postman/ChMS API v1.postman_collection.json" \
  -e "postman/ChMS Local.postman_environment.json" \
  --reporters cli,json \
  --reporter-json-export postman/newman-results.json
```
