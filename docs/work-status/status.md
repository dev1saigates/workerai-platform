# WorkerAI — Project status

**Last updated:** 23 May 2026

| Symbol | Meaning |
|:------:|---------|
| ✅ | Done |
| ⬜ | Remaining |

---

## Progress overview

| Phase | Progress | Status |
|-------|----------|--------|
| **Phase 1** — Setup & monorepo | `████████░░` **80%** (8/10) | 🟡 In progress |
| **Phase 2** — Frontend UI | `██████████` **100%** (13/13 screens) | ✅ Complete (polish remaining) |
| **Phase 3** — Database (PostgreSQL) | `░░░░░░░░░░` **0%** (0/10) | ⬜ Not started |
| **Phase 4** — Backend API | `░░░░░░░░░░` **0%** (0/17) | ⬜ Not started |
| **Phase 5** — AI pipeline (vLLM) | `░░░░░░░░░░` **0%** (0/6) | ⬜ Not started |
| **Phase 6** — Deploy & go-live | `░░░░░░░░░░` **0%** (0/5) | ⬜ Not started |

---

## Phase 1 — Setup & monorepo

| | Task |
|:-:|------|
| ✅ | pnpm monorepo (`apps/web`, `apps/api`, `packages`) |
| ✅ | Next.js web app runs locally |
| ✅ | Fastify API stub (port 4000) |
| ✅ | Root `.gitignore` (no `node_modules` in Git) |
| ✅ | GitHub push working |
| ✅ | Shared app layout (`AppShell` — sidebar + header once) |
| ✅ | Light / dark theme |
| ⬜ | Docker Compose |
| ⬜ | CI pipeline (lint, typecheck, tests) |
| ⬜ | Env package fully wired (`packages/config`) |

---

## Phase 2 — Frontend UI

### Screens at a glance

| Screen | Reference | Progress | Status |
|--------|-----------|----------|--------|
| Sign in | `signin.png` | 6/8 | 🟡 |
| Sign up | `login.png` | 5/7 | 🟡 |
| App shell | — | 5/6 | 🟡 |
| Command Centre | `dashboard.png` | 5/7 | 🟡 |
| Approvals | `approvals.png` | 6/9 | 🟡 |
| AI Workers | `ai_workers.png` | 5/9 | 🟡 |
| Task log | `task-log.png` | 3/4 | 🟡 |
| Workflows | `workflows.png` | 3/4 | 🟡 |
| Claw — Ingestion | `claw_ingestion.png` | 3/4 | 🟡 |
| Knowledge hub | `knowledge_hub.png` | 3/4 | 🟡 |
| Reports | `reports.png` | 3/4 | 🟡 |
| Team | `team.png` | 3/4 | 🟡 |
| Settings | `settings.png` | 3/4 | 🟡 |

---

### 2.1 Auth pages

#### Sign in

| | Task |
|:-:|------|
| ✅ | Route `/sign-in` |
| ✅ | Email + password + validation |
| ✅ | Show / hide password |
| ✅ | Logo + tagline + link to sign up |
| ✅ | GDPR footer |
| ⬜ | Light mode final pass |
| ⬜ | Connect to real login API |

#### Sign up

| | Task |
|:-:|------|
| ✅ | Route `/sign-up` |
| ✅ | Full name + company + work email + password rules |
| ✅ | Create workspace button + link to sign in |
| ⬜ | Light mode final pass |
| ⬜ | Connect to real register API |

---

### 2.2 App shell

| | Task |
|:-:|------|
| ✅ | Sidebar + nav groups (Main / Data & tools / Workspace) |
| ✅ | Approvals badge (count) |
| ✅ | User profile + logout |
| ✅ | Mobile menu |
| ✅ | Header (title, search, notifications, theme toggle) |
| ⬜ | Active nav highlight on every route |

---

### 2.3 Main screens

#### Command Centre

| | Task |
|:-:|------|
| ✅ | Route `/dashboard` |
| ✅ | 4 metric cards |
| ✅ | Live Activity list |
| ✅ | Needs your approval widget |
| ✅ | Worker status + Configure link |
| ⬜ | Final spacing / colours vs reference |
| ⬜ | Centre status pill text |

#### Approvals queue

| | Task |
|:-:|------|
| ✅ | Route `/approvals` |
| ✅ | Heading + item count + Approve All Safe |
| ✅ | Filters (All / Urgent) |
| ✅ | Cards + JSON preview + Approve / Edit / Reject |
| ⬜ | Reject reason dialog |
| ⬜ | Edit draft modal |
| ⬜ | Final spacing / colours vs reference |

#### AI Workers

| | Task |
|:-:|------|
| ✅ | Route `/workers` |
| ✅ | Heading + count + Add Worker button |
| ✅ | Worker card grid + stats row |
| ✅ | Worker chat `/workers/[slug]` |
| ⬜ | Green **Active** badge on cards |
| ⬜ | **Stats** + **Config** footer (per reference) |
| ⬜ | Remove Add Worker test alert |
| ⬜ | Final spacing / colours vs reference |

#### Task log

| | Task |
|:-:|------|
| ✅ | Build page (remove Coming soon) |
| ✅ | Heading + AI Generate / Create Task + filter pills |
| ✅ | Task list + priority + status badges |
| ⬜ | Pagination (when API wired) |

#### Workflows

| | Task |
|:-:|------|
| ✅ | Build page (remove Coming soon) |
| ✅ | Heading + New Workflow + subtitle |
| ✅ | Template cards (3) + Your workflows list |
| ✅ | Trigger labels (EMAIL / MANUAL / CRM) + active badge + play/pause |
| ⬜ | Final spacing / colours vs reference |

#### Claw — Ingestion

| | Task |
|:-:|------|
| ✅ | Build page (remove Coming soon) |
| ✅ | Heading + stats + channel grid + Test Ingest |
| ✅ | Webhook URL + Copy + recent ingestion list |
| ⬜ | Final spacing / colours vs reference |

#### Knowledge hub

| | Task |
|:-:|------|
| ✅ | Build page (remove Coming soon) |
| ✅ | Upload + document list + search |
| ✅ | Stats row + status badges (indexed / processing / failed) |
| ⬜ | Final spacing / colours vs reference |

#### Reports

| | Task |
|:-:|------|
| ✅ | Build page (remove Coming soon) |
| ✅ | KPI tiles + charts + date range |
| ✅ | Top workers table |
| ⬜ | Final spacing / colours vs reference |

#### Team

| | Task |
|:-:|------|
| ✅ | Build page (remove Coming soon) |
| ✅ | Member list + roles + invite |
| ✅ | Remove member (UI-only) |
| ⬜ | Final spacing / colours vs reference |

#### Settings

| | Task |
|:-:|------|
| ✅ | Build page (remove Coming soon) |
| ✅ | Sub-nav + Workspace form (company, hours, timezone) |
| ✅ | Placeholder tabs (Profile, Integrations, GDPR, Billing, Audit) |
| ⬜ | Final spacing / colours vs reference |

---

## Phase 3 — Database (PostgreSQL)

| | Task |
|:-:|------|
| ⬜ | Docker Compose — Postgres 16 |
| ⬜ | PostgreSQL running (local or UK/EU host) |
| ⬜ | Extensions: `pgvector`, `pg_partman` |
| ⬜ | Database roles (`workerai_owner`, `workerai_app`, `workerai_migrator`, `workerai_break_glass`) |
| ⬜ | Row-Level Security (RLS) per workspace |
| ⬜ | Drizzle schema (`packages/db`) |
| ⬜ | First migration applied |
| ⬜ | `DATABASE_URL` in environment |
| ⬜ | API connects with `workerai_app` role |
| ⬜ | Transaction helpers (`withWorkspaceTransaction`, etc.) |

---

## Phase 4 — Backend API

| | Task |
|:-:|------|
| ⬜ | Module structure (routes / service / repository / tests) |
| ⬜ | Workspaces module |
| ⬜ | Auth — register + login (Argon2id) + sessions |
| ⬜ | Workers module |
| ⬜ | Tasks module (lifecycle states) |
| ⬜ | Approvals module |
| ⬜ | Audit log (hash chain, same DB transaction) |
| ⬜ | Wire UI: sign-in |
| ⬜ | Wire UI: sign-up |
| ⬜ | Wire UI: dashboard |
| ⬜ | Wire UI: approvals |
| ⬜ | Wire UI: workers |
| ⬜ | Remaining modules (billing, integrations, workflows, claw, drive, reports, team, settings, GDPR, API keys) |

---

## Phase 5 — AI pipeline (vLLM on DGX)

| | Task |
|:-:|------|
| ⬜ | vLLM connection (`:8000` on DGX) |
| ⬜ | Generation API (interactive + async) |
| ⬜ | SSE streaming to browser |
| ⬜ | Embeddings (Knowledge hub search) |
| ⬜ | Background jobs (graphile-worker) |
| ⬜ | Quotas per workspace |

---

## Phase 6 — Deploy & go-live

| | Task |
|:-:|------|
| ⬜ | Production hosting (UK/EU only) |
| ⬜ | HTTPS + reverse proxy (Caddy) |
| ⬜ | Monitoring (Sentry EU, Better Stack DE) |
| ⬜ | Security review (rate limits, secrets) |
| ⬜ | Client UAT sign-off |
