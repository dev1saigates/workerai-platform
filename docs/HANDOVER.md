# WorkerAI — Developer handover guide

**Last updated:** 28 May 2026  
**Audience:** Any developer taking over this repo (internal or contractor).  
**Read time:** ~15 minutes.

---

## 1. What this project is

WorkerAI is a **multi-tenant** platform: each customer is a **workspace** (tenant). Users create **AI workers** (personas) that draft emails, posts, etc. Every draft goes to an **approval queue** before use. Data must remain in the **UK/EU** in production.

| Layer | Tech | Folder |
|--------|------|--------|
| Frontend | Next.js 15/16, React, Tailwind v4 | `apps/web` |
| API | Node 22, Fastify, TypeScript | `apps/api` |
| Database | PostgreSQL 16 + pgvector (Docker locally) | `packages/db` |
| Shared validation | Zod schemas | `packages/shared` |
| Config | Zod-validated env | `packages/config` |

**Monorepo tool:** pnpm workspaces (like multiple PHP apps in one repo with Composer).

---

## 2. Prerequisites

| Tool | Version | Notes |
|------|---------|--------|
| Node.js | 22+ recommended | API uses modern ESM |
| pnpm | 9+ / 11 | `corepack enable` if needed |
| Docker Desktop | Latest | **Mac:** install app, open once, leave running |
| Git | Any | Repo: `workerai-platform` |

---

## 3. First-time setup (copy-paste, one line at a time)

```bash
cd workerai-platform
cp .env.example .env
```

Edit `.env`:

- Set `JWT_SECRET` to **at least 32 characters** (API will not start otherwise).
- Leave database URLs as-is for local Docker.

```bash
pnpm install
pnpm docker:up
pnpm db:migrate
```

**Terminal 1 — API:**

```bash
pnpm dev:api
```

**Terminal 2 — Web:**

```bash
pnpm dev:web
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Web app |
| http://localhost:4000/health | API alive |
| http://localhost:4000/health/db | API + Postgres |

**Do not** paste multi-line blocks with `#` comments into zsh — run each command separately.

---

## 4. Environment variables (`.env` at repo root)

| Variable | Required | Used by | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | API | `development` / `production` / `test` |
| `API_PORT` | No | API | Default `4000` |
| `API_HOST` | No | API | Default `0.0.0.0` |
| `JWT_SECRET` | **Yes** | API | Min 32 chars. **No default in code** (intentional). |
| `DATABASE_URL` | **Yes** | API | Runtime DB user `workerai_app` (RLS enforced) |
| `DATABASE_URL_MIGRATE` | Yes* | Migrations | Owner role `workerai_owner` (DDL only) |
| `NEXT_PUBLIC_API_URL` | Yes** | Web | e.g. `http://localhost:4000` |

\* Needed for `pnpm db:migrate`.  
\** Needed for sign-in / sign-up API calls.

**Never commit `.env`** — it is gitignored.

**Local Docker Postgres passwords** (dev only — see `docker/postgres/init/02-roles.sql`):

| Role | Purpose |
|------|---------|
| `workerai_app` | Normal API queries (RLS) |
| `workerai_owner` | Migrations / DDL |
| `workerai_migrator` | Future data moves |
| `workerai_break_glass` | Emergency only (bypasses RLS) |

---

## 5. Root scripts (`package.json`)

| Command | What it does |
|---------|----------------|
| `pnpm dev:web` | Next.js dev server (port 3000) |
| `pnpm dev:api` | Fastify API with hot reload (port 4000) |
| `pnpm docker:up` | Start Postgres container |
| `pnpm docker:down` | Stop containers |
| `pnpm docker:logs` | Postgres logs |
| `pnpm docker:reset` | **Deletes DB volume** + recreates |
| `pnpm db:migrate` | Apply SQL migrations |
| `pnpm db:generate` | Generate new migration from Drizzle schema |
| `pnpm build` | Production build of web only |

---

## 6. Folder structure (short map)

```
workerai-platform/
├── apps/
│   ├── web/                 # Next.js UI (pages, components, mock data)
│   │   └── src/
│   │       ├── app/         # Routes (App Router): sign-in, dashboard, workers…
│   │       ├── components/  # AppShell, modals, avatars
│   │       └── lib/         # Mock data + auth-api.ts (calls backend)
│   └── api/                 # Fastify HTTP API
│       └── src/
│           ├── server.ts    # Entry + routes registration
│           ├── infra/db/    # DB connection + transaction helpers
│           ├── lib/         # JWT, passwords, errors, slugs
│           └── modules/     # Feature modules (auth, workspaces…)
├── packages/
│   ├── config/              # Zod env validation (loadEnv)
│   ├── db/                  # Drizzle schema + migrations
│   └── shared/              # Zod schemas shared by web + api
├── docker/                  # Postgres image + init SQL (roles, extensions)
├── scripts/                 # docker-up.sh, db-migrate.sh
├── docs/
│   ├── HANDOVER.md          # This file
│   └── work-status/         # Phase checklist
├── .env.example             # Template (copy to .env)
└── docker-compose.yml       # Local Postgres only
```

### Backend module pattern (target for all features)

Each feature should live under `apps/api/src/modules/<name>/`:

| File | Role |
|------|------|
| `<name>.routes.ts` | HTTP routes + Zod validation |
| `<name>.service.ts` | Business logic (only layer other modules call) |
| `<name>.repository.ts` | SQL via Drizzle; uses `WorkspaceTx` for tenant data |
| Tests | Unit + tenancy isolation (workspace A cannot see B) |

**Rule:** Never call `db.transaction()` directly — use `withWorkspaceTransaction`, `withPublicTransaction`, or `withSystemTransaction` from `apps/api/src/infra/db/index.ts`.

---

## 7. API routes

**Base URL (local):** `http://localhost:4000`  
**Response shape (all routes):**

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "STRING", "message": "...", "status": 400 } }
```

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | API running message |
| GET | `/health` | No | Process OK + env check |
| GET | `/health/db` | No | Postgres ping |

### Auth (implemented)

| Method | Path | Body | Success `data` |
|--------|------|------|----------------|
| POST | `/auth/register` | `fullName`, `companyName`, `email`, `password` | `{ token, user, workspace }` |
| POST | `/auth/login` | `email`, `password` | `{ token, user, workspace }` |

**Password rules (register):** min 8 chars, 1 uppercase, 1 number.

**Token:** JWT (HS256), 7-day expiry. Stored in browser `localStorage` key `workerai:session` (demo — move to httpOnly cookie for production).

**Register flow (database):** One transaction creates `users` → `workspaces` → `workspace_members` (role `owner`) → sets `users.default_workspace_id`.

### Not implemented yet (UI only / mock)

Workers, tasks, approvals, billing, AI generation, etc. — see section 9.

---

## 8. Database

### Tables (current migrations)

| Table | Purpose |
|-------|---------|
| `workspaces` | Tenant (company) |
| `users` | Login account (global email unique) |
| `workspace_members` | Links user ↔ workspace + role (`owner` / `manager` / `member`) |

### Migrations (in order)

| File | Purpose |
|------|---------|
| `0000_hesitant_famine.sql` | Create tables + enums |
| `0001_enable_rls.sql` | Row-Level Security on tenant tables |
| `0002_rls_signup.sql` | Allow inserts during registration |
| `0003_users_default_workspace.sql` | `users.default_workspace_id` for login |

Apply with: `pnpm db:migrate` (requires Docker Postgres + `.env`).

### Row-Level Security (RLS)

- API connects as **`workerai_app`**.
- Before tenant queries, code sets: `app.current_workspace = <uuid>` inside `withWorkspaceTransaction`.
- **Never remove** that `set_config` call — it is legally/security critical for multi-tenancy.

---

## 9. What is real vs demo (important for reviewers)

| Area | Status |
|------|--------|
| Sign-in / sign-up | **Real** — hits API + Postgres |
| Dashboard, workers, tasks, approvals, settings, etc. | **UI mock** — data in `apps/web/src/lib/*-data.ts` |
| Worker chat messages | **Demo** — not vLLM yet |
| Onboarding in chat | **localStorage** only |
| Vercel deploy (`apps/web`) | Demo UI; **no UK customer data** until EU/UK backend |

---

## 10. Frontend routes (web)

| Path | Description |
|------|-------------|
| `/sign-in` | Login form |
| `/sign-up` | Register form |
| `/dashboard` | Command centre (mock KPIs) |
| `/workers` | AI workers list |
| `/workers/[slug]` | Worker chat |
| `/approvals` | Approval queue (mock) |
| `/task-log` | Tasks (mock) |
| `/workflows` | Workflows (mock) |
| `/claw` | Email ingestion (mock) |
| `/knowledge` | Knowledge hub (mock) |
| `/reports` | Reports (mock) |
| `/team` | Team (mock) |
| `/settings` | Settings tabs (mock) |

App shell (sidebar): `apps/web/src/components/app-shell.tsx`.

---

## 11. Production & legal (UK/EU)

- **Do not** use US-only services (e.g. Resend email, Cloudflare R2) for customer data.
- Approved examples: AWS `eu-west-2`, Stripe (IE entity), Sentry EU, Brevo EU, Neon/Crunchy London.
- Production DB and API must be hosted **UK/EU**.
- Vercel frontend-only demo is OK; real PII goes to EU/UK API only.

---

## 12. Troubleshooting

| Problem | Fix |
|---------|-----|
| `JWT_SECRET` too small | Use 32+ characters in `.env` |
| `EADDRINUSE` port 4000 | `lsof -ti :4000 \| xargs kill` or stop other terminal |
| `Cannot find package '@workerai/db'` | Run `pnpm install` from repo root |
| `docker-credential-desktop` not found | Open Docker Desktop; or use `scripts/docker-up.sh` |
| `ECONNREFUSED` on migrate | Docker not running → `pnpm docker:up` |
| `pnpm docker:up` wrong folder | Must be inside `workerai-platform` (where `package.json` is) |
| CORS errors on login | API must run; `NEXT_PUBLIC_API_URL` must match API port |

---

## 13. Roadmap (what to build next)

1. **JWT auth middleware** on protected API routes  
2. **Workers module** — CRUD in DB, replace `workers-data.ts`  
3. **Tasks + approvals** — state machine + API  
4. **Audit log** — hash chain, same transaction as writes  
5. **vLLM** — self-hosted AI (client hardware), SSE streaming  
6. **CI** — lint, typecheck, tests on every PR  

Detail: `docs/work-status/status.md`.

---

## 14. Review checklist (for senior dev meeting)

- [ ] `pnpm install` + `pnpm docker:up` + `pnpm db:migrate` on a clean machine  
- [ ] `pnpm dev:api` → `/health` and `/health/db` OK  
- [ ] Register + login on http://localhost:3000  
- [ ] Confirm `.env` is not committed  
- [ ] Confirm tenant queries use `withWorkspaceTransaction` (when added)  
- [ ] Understand mock UI vs real API boundary (section 9)  

---

## 15. Key contacts / context

| Item | Detail |
|------|--------|
| Client | UK SME business owner |
| Builder | Saigates Limited, Wolverhampton |
| Repo path (example) | `/Applications/workerAI/workerai-platform` |

*Update this section with your team contacts before handover.*

---

*Questions about architecture rules: see `.cursorrules` and `CLAUDE.md` in repo root.*
