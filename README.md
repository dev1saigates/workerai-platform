# WorkerAI Platform

Multi-tenant SaaS for UK SMEs — AI drafts business content; humans approve before anything is sent.

**Company:** Saigates Limited, Wolverhampton, UK  
**Legal:** All production customer data must stay in the **UK**.

---

## Start here (handover)

Read **[docs/HANDOVER.md](docs/HANDOVER.md)** — setup, `.env`, folder map, API routes, database, and what is real vs demo UI.

**Quick start (local):**

```bash
cd workerai-platform
cp .env.example .env    # edit JWT_SECRET (min 32 chars)
pnpm install
pnpm docker:up
pnpm db:migrate
pnpm dev:api            # terminal 1 → http://localhost:4000
pnpm dev:web            # terminal 2 → http://localhost:3000
```

**Progress tracker:** [docs/work-status/status.md](docs/work-status/status.md)
