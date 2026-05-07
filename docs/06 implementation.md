# ChMS Capstone Project

## Document VI — Master Implementation Plan

### Execution Roadmap with Team Plans, Daily Rhythm & Review Standards

---

| Field      | Detail       |
| ---------- | ------------ |
| Version    | 1.0          |
| Date       | May 5, 2026  |
| Submission | May 24, 2026 |
| Duration   | 19 Days      |

> This is the single source of truth for execution. Each team's section in this document is extracted into their individual Team Implementation Plan file.

---

## 1. Executive Summary

| Metric         | Value                 | Note                            |
| -------------- | --------------------- | ------------------------------- |
| Total Duration | 19 Days               | May 5 – May 24, 2026            |
| Team Size      | 20 Backend Developers | 6 layers including admin        |
| Total Features | 17 (F-001 to F-017)   | 10 MUST + 5 SHOULD + 2 COULD    |
| Total Tasks    | 77                    | Across 4 phases, 6 teams        |
| Code Freeze    | May 23, 2026          | No new features after this date |
| Submission     | May 24, 2026          | develop → main, repo submitted  |

---

## 2. GitHub Workflow Quick Reference

| Step        | Action                                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1. Branch   | `git checkout develop && git pull origin develop && && git checkout -b team-0x-xxx && git checkout -b feature/your-feature` |
| 2. Code     | Implement assigned tasks on your feature branch                                                                             |
| 3. Commit   | `git commit -m 'feat(module): description'` — follow commit conventions                                                     |
| 4. Push     | `git push origin feature/your-feature`                                                                                      |
| 5. PR       | Open Pull Request: `feature/your-feature → team-0x-xxx` on GitHub                                                           |
| 6. Review   | Admin reviews; requests changes or approves and merges                                                                      |
| 7. Clean up | After merge, delete your feature branch                                                                                     |

---

## 3. Team Implementation Plans (Master View)

---

### Team 1 — Database & Models

**Members:** DB Dev 1, DB Dev 2, DB Dev 3, DB Dev 4 | **Lead:** DB Lead

| Phase   | Days  | Tasks                                                                  | Exit Criteria                                                 |
| ------- | ----- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| Phase 1 | 1–3   | T-DV-003, T-DV-004, T-DB-001 through T-DB-017 (all 17 schemas)         | All schemas merged to develop; MongoDB + Cloudinary connected |
| Phase 2 | 4–10  | Support API teams with schema queries and fixes; add indexes if needed | Schemas stable; supporting API teams                          |
| Phase 3 | 11–16 | Optimize indexes for reporting queries; add any missing schemas        | Reporting queries performant                                  |
| Phase 4 | 17–19 | Final schema review; verify all relationships and indexes              | DB layer fully verified                                       |

---

### Team 2 — Authentication & RBAC

**Members:** Auth Dev 1, Auth Dev 2, Auth Dev 3 | **Lead:** Auth Lead

| Phase   | Days  | Tasks                                                                           | Exit Criteria                                                   |
| ------- | ----- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Phase 1 | 1–3   | T-AU-001 through T-AU-006: JWT utils, auth middleware, RBAC, all auth endpoints | Login/register/refresh/logout working; RBAC tested on all roles |
| Phase 2 | 4–10  | Wire auth middleware to all new routes from API teams                           | All Phase 2 routes protected by correct role guards             |
| Phase 3 | 11–16 | T-AU-007, T-AU-008: document upload endpoints; wire auth to Phase 3 routes      | Document upload working; all Phase 3 routes protected           |
| Phase 4 | 17–19 | T-AU-009, T-AU-010: audit log middleware and endpoint; final auth review        | Audit logs firing; auth fully verified                          |

---

### Team 3 — Core API: Membership & Org

**Members:** API Dev A1, API Dev A2, API Dev A3, API Dev A4 | **Lead:** API Lead A

| Phase   | Days  | Tasks                                                                | Exit Criteria                                           |
| ------- | ----- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| Phase 1 | 1–3   | Support DB schema validation; prepare Postman collection shell       | Postman collection ready                                |
| Phase 2 | 4–10  | T-MA-001 through T-MA-009: Member CRUD, Org Units, Fellowship, Staff | All membership, org, fellowship, staff endpoints tested |
| Phase 3 | 11–16 | T-MA-010: Announcements; T-MA-011, T-MA-012: Missions                | Announcements and missions endpoints working            |
| Phase 4 | 17–19 | Bug fixes from QA regression; PR cleanup                             | All A-team PRs merged; no open issues                   |

---

### Team 4 — Core API: Finance & Events

**Members:** API Dev B1, API Dev B2, API Dev B3, API Dev B4 | **Lead:** API Lead B

| Phase   | Days  | Tasks                                                                            | Exit Criteria                                                             |
| ------- | ----- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Phase 1 | 1–3   | Support DB schema validation for finance schemas; document finance API contracts | Finance contracts documented                                              |
| Phase 2 | 4–10  | T-MB-001 through T-MB-009: Finance endpoints, Events CRUD, Attendance            | Finance, events, attendance fully operational; 409 on duplicate confirmed |
| Phase 3 | 11–16 | T-MB-010, T-MB-011, T-MB-012: Reporting endpoints                                | All 3 reporting endpoints return correct aggregated data                  |
| Phase 4 | 17–19 | Bug fixes; optimize finance summary aggregation                                  | All B-team PRs merged; reports verified accurate                          |

---

### Team 5 — Programs, Welfare & Media

**Members:** API Dev C1, API Dev C2, API Dev C3 | **Lead:** API Lead C

| Phase   | Days  | Tasks                                                                     | Exit Criteria                                               |
| ------- | ----- | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Phase 1 | 1–3   | Support DB schema validation for Program, Welfare, Media schemas          | Schemas confirmed; support complete                         |
| Phase 2 | 4–10  | T-MC-001 through T-MC-005: Inventory, Vendor, Welfare CRUD                | Inventory, vendor, welfare endpoints live and tested        |
| Phase 3 | 11–16 | T-MC-006 through T-MC-011: Programs, enrollment, media, Cloudinary upload | Programs and media complete; file uploads tested end-to-end |
| Phase 4 | 17–19 | Bug fixes; validate Cloudinary integration                                | All C-team PRs merged; file upload verified                 |

---

### Team 6 — DevOps & QA

**Members:** DevOps Dev 1, DevOps Dev 2, QA Dev 1, QA Dev 2 | **Lead:** QA Lead

| Phase   | Days  | Tasks                                                                                                                           | Exit Criteria                                           |
| ------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Phase 1 | 1–3   | T-DV-001, T-DV-002, T-DV-005: Repo, folder structure, Express app; T-QA-002: auth integration tests                             | Repo live; all devs have access; Express boots clean    |
| Phase 2 | 4–10  | T-QA-001: Postman collection; T-AD-001: integration checkpoint                                                                  | Postman collection shared; Phase 2 integration verified |
| Phase 3 | 11–16 | T-QA-003: Test all Phase 3 endpoints; document failures                                                                         | Phase 3 test report shared with all teams               |
| Phase 4 | 17–19 | T-QA-004: Full regression; T-DV-006, T-DV-007: console.log cleanup, README; T-AD-002 through T-AD-004: final merge + submission | SUBMISSION COMPLETE                                     |

---

## 4. Daily Execution Checklist

### Start of Day

- [ ] `git pull origin team-0x-xxx` — get latest
- [ ] Rebase your feature branch on develop if needed
- [ ] Confirm your task for today from your team plan
- [ ] Attend standup: Done / Doing / Blocked

### During Day

- [ ] Commit frequently — small, meaningful commits with correct message format
- [ ] If blocked > 2 hours: escalate to team lead immediately
- [ ] Do not touch code outside your assigned module/layer
- [ ] Test every endpoint you write before opening a PR

### End of Day

- [ ] Push to your feature branch
- [ ] Open or update your PR if the feature is complete
- [ ] Update your task status in the team tracker
- [ ] Post a brief end-of-day update in the team channel

---

## 5. PR Review Checklist (Admin Use)

| Check                                                            | Required | Status |
| ---------------------------------------------------------------- | -------- | ------ |
| Follows layered architecture — no logic in routes or controllers | YES      | [ ]    |
| All async handlers have try/catch or asyncHandler                | YES      | [ ]    |
| All inputs validated before use                                  | YES      | [ ]    |
| Correct HTTP status codes used                                   | YES      | [ ]    |
| Consistent response format { success, data, message, error }     | YES      | [ ]    |
| No console.log in production paths                               | YES      | [ ]    |
| Auth + RBAC middleware applied to protected routes               | YES      | [ ]    |
| No secrets or .env values hardcoded                              | YES      | [ ]    |
| Branch is up to date with develop before PR                      | YES      | [ ]    |
| PR description is complete                                       | YES      | [ ]    |

---

_ChMS Capstone Project | Document VI: Master Implementation Plan | Version 1.0 | May 2026_
