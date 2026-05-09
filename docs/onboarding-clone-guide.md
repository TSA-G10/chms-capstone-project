# ChMS Capstone Project

## Developer Onboarding Guide — Clone & Branch Setup

---

| Field      | Detail                         |
| ---------- | ------------------------------ |
| Version    | 1.0                            |
| Date       | May 5, 2026                    |
| Applies To | All 20 developers, all 6 teams |

---

## Before You Start

You will need:

- [ ] Git installed on your machine — verify with `git --version`
- [ ] A GitHub account
- [ ] An invitation to the `chms-capstone` repository — confirm you have accepted it
- [ ] Node.js v20 LTS installed — verify with `node --version`

---

## Step 1 — Clone the Repository

Run this once on your local machine. Everyone clones the same URL.

```bash
// Go to your selected project directory and run; no need to git init as git clone will do that for you:

git clone https://github.com/TSA-G10/chms-capstone-project
cd chms-capstone-project
```

You now have a local copy of the repository. By default, you are on the `main` branch.

Verify:

```bash
git branch
# Expected output:
# * main
```

---

## Step 2 — Fetch All Remote Branches

The team branches already exist on the remote. Pull them all down so your local Git knows about them:

```bash
git fetch --all
```

Verify all branches are visible:

```bash
git branch -r
# Expected output includes:
#   origin/main
#   origin/develop
#   origin/team-01-db-models
#   origin/team-02-auth-rbac
#   origin/team-03-membership-org
#   origin/team-04-finance-events
#   origin/team-05-programs-welfare-media
#   origin/team-06-devops-qa
```

---

## Step 3 — Check Out Your Team Branch

Each developer checks out **only their own team branch**. Find your team below and run the corresponding command.

### Team 01 — Database & Models

**Members:** DB Dev 1, DB Dev 2, DB Dev 3, DB Dev 4

```bash
git checkout team-01-db-models
git pull origin team-01-db-models
```

---

### Team 02 — Authentication & RBAC

**Members:** Auth Dev 1, Auth Dev 2, Auth Dev 3

```bash
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
```

---

### Team 03 — Core API: Membership & Org

**Members:** API Dev A1, API Dev A2, API Dev A3, API Dev A4

```bash
git checkout team-03-membership-org
git pull origin team-03-membership-org
```

---

### Team 04 — Core API: Finance & Events

**Members:** API Dev B1, API Dev B2, API Dev B3, API Dev B4

```bash
git checkout team-04-finance-events
git pull origin team-04-finance-events
```

---

### Team 05 — Programs, Welfare & Media

**Members:** API Dev C1, API Dev C2, API Dev C3

```bash
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media
```

---

### Team 06 — DevOps & QA

**Members:** DevOps Dev 1, DevOps Dev 2, QA Dev 1, QA Dev 2

```bash
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
```

---

## Step 4 — Verify You Are on the Right Branch

```bash
git branch
# The * marks your current branch. Example for Team 03:
# * team-03-membership-org
#   main

git log --oneline -3
# Shows the last 3 commits on your team branch
```

---

## Step 5 — Set Up Your Environment

```bash
# Install dependencies
npm install

# Copy the environment file
cp .env.example .env

# Open .env and fill in your real values:
# MONGO_URI, JWT secrets, Cloudinary credentials
```

Verify the server starts:

```bash
npm run dev
# Expected:
# MongoDB Connected: ...
# Server running on port 5000 in development mode
```

Verify the health endpoint:

```bash
curl http://localhost:5000/health
# Expected: {"success":true,"message":"ChMS API is running."}
```

---

## Step 6 — Create Your Feature Branch

Once you are on your team branch and the server is confirmed working, create your assigned feature branch. **Always branch off your team branch — never off `develop` or `main`.**

The feature branch names for each team are listed in your Team Implementation Plan. General pattern:

```bash
# Make sure your team branch is up to date first
git checkout [your-team-branch]
git pull origin [your-team-branch]

# Then create your feature branch
git checkout -b feature/[your-feature-name]
git push origin feature/[your-feature-name]
```

**Examples by team:**

```bash
# Team 01
git checkout team-01-db-models
git pull origin team-01-db-models
git checkout -b feature/db-config-mongodb
git push origin feature/db-config-mongodb

# Team 02
git checkout team-02-auth-rbac
git pull origin team-02-auth-rbac
git checkout -b feature/auth-jwt-utilities
git push origin feature/auth-jwt-utilities

# Team 03
git checkout team-03-membership-org
git pull origin team-03-membership-org
git checkout -b feature/membership-member-crud
git push origin feature/membership-member-crud

# Team 04
git checkout team-04-finance-events
git pull origin team-04-finance-events
git checkout -b feature/finance-contributions
git push origin feature/finance-contributions

# Team 05
git checkout team-05-programs-welfare-media
git pull origin team-05-programs-welfare-media
git checkout -b feature/inventory-vendors
git push origin feature/inventory-vendors

# Team 06
git checkout team-06-devops-qa
git pull origin team-06-devops-qa
git checkout -b feature/devops-repo-setup
git push origin feature/devops-repo-setup
```

---

## Branch Rules — Read Before Writing Any Code

| Rule                                        | Detail                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| Never push to `main`                        | Admin only. Protected. Your push will be rejected.                     |
| Never push to `develop`                     | Team leads only, via PR. Your push will be rejected.                   |
| Never push to a team branch directly        | Your push will be rejected. Always use a feature branch and open a PR. |
| Always branch from your team branch         | `git checkout team-XX-... && git checkout -b feature/...`              |
| Always push your feature branch immediately | `git push origin feature/...` right after creating it                  |
| PR target is always your team branch        | `feature/your-feature → team-XX-your-team`                             |
| Team lead PRs to develop                    | Only the team lead opens the PR from the team branch to `develop`      |

---

## Quick Reference — Who Does What

| Action                             | Who                  |
| ---------------------------------- | -------------------- |
| `feature/... → team-XX-...` PR     | Individual developer |
| Review + merge `feature → team` PR | Team lead            |
| `team-XX-... → develop` PR         | Team lead            |
| Review + merge `team → develop` PR | General admin        |
| `develop → main` PR                | General admin        |

---

## If You Get Stuck

| Problem                                            | Action                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Push rejected on `main`, `develop`, or team branch | You are pushing to a protected branch. Switch to your feature branch first.              |
| `git checkout team-XX-...` says branch not found   | Run `git fetch --all` first, then retry.                                                 |
| Merge conflict on your feature branch              | Pull the latest team branch, rebase, resolve conflicts, then push.                       |
| `.env` values missing or wrong                     | Check `.env.example` for all required keys. Ask team lead for shared dev credentials.    |
| Server fails to start                              | Check `MONGO_URI` in your `.env` is correct and your IP is whitelisted in MongoDB Atlas. |

---

_ChMS Capstone Project | Developer Onboarding Guide | Version 1.0 | May 2026_
