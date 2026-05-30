# Integrations & authorisation

**Repo:** `workerai-platform` · **Secrets live in:** root `.env` (never commit)

---

## WorkerAI API (Fastify)

| Method | Path | Auth | Status |
|--------|------|------|--------|
| GET | `/` | None | Live |
| GET | `/health` | None | Live |
| GET | `/health/db` | None | Live |
| POST | `/auth/register` | None | Live |
| POST | `/auth/login` | None | Live |
| GET | `/auth/me` | Bearer JWT | Live |

**Base URL (local):** `http://localhost:4000`  
**Web calls API via:** `NEXT_PUBLIC_API_URL`

---

## Environment keys (in use today)

| Key | Required | Used by | Purpose |
|-----|----------|---------|---------|
| `JWT_SECRET` | Yes | API | Sign/verify session JWT (min 32 chars) |
| `DATABASE_URL` | Yes | API | Postgres runtime (`workerai_app`) |
| `DATABASE_URL_MIGRATE` | Yes* | Migrations | Postgres DDL (`workerai_owner`) |
| `NEXT_PUBLIC_API_URL` | Yes | Web | API base URL for sign-in / sign-up |
| `NODE_ENV` | No | API | `development` / `production` / `test` |
| `API_HOST` | No | API | Default `0.0.0.0` |
| `API_PORT` | No | API | Default `4000` |

\* Required for `pnpm db:migrate`.

---

## Authorisation

| Item | Method | Where | Status |
|------|--------|-------|--------|
| Password storage | Argon2id | API (`@node-rs/argon2`) | Live |
| Session token | JWT HS256, 7-day expiry | API (`jose`) | Live |
| Protected routes | `Authorization: Bearer <token>` | `apps/api/src/lib/auth-guard.ts` | Live |
| Browser session | `localStorage` key `workerai:session` | Web | Live (demo — httpOnly cookie in production) |
| Multi-tenant DB | PostgreSQL RLS + `app.current_workspace` | API transactions | Live |
| API keys (programmatic) | Workspace API tokens | — | Not built |

---

## Database (local Docker)

| Role | Env / connection | Password (local dev only) |
|------|------------------|---------------------------|
| `workerai_app` | `DATABASE_URL` | `workerai_app_dev_local` |
| `workerai_owner` | `DATABASE_URL_MIGRATE` | `workerai_owner_dev_local` |
| `workerai_migrator` | Migrations (future) | `workerai_migrator_dev_local` |
| `workerai_break_glass` | Emergency only | `workerai_break_glass_dev_local` |
| `postgres` (superuser) | Docker init | `workerai_dev_local_only` |

---

## Third-party integrations

| Integration | Category | Auth type | Env key(s) (when wired) | Data region | Status |
|-------------|----------|-----------|-------------------------|-------------|--------|
| **PostgreSQL** | Database | Connection string | `DATABASE_URL`, `DATABASE_URL_MIGRATE` | Local Docker / UK-EU host in prod | **Live** (local) |
| **vLLM** | AI inference | Base URL + API key (optional) | `VLLM_BASE_URL`, `VLLM_API_KEY` | On-prem (client DGX) | Not wired |
| **Gmail** | Email | OAuth 2.0 | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Google (verify DPA) | UI only |
| **Microsoft Outlook** | Email | OAuth 2.0 | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_REDIRECT_URI` | EU tenant (verify DPA) | UI only |
| **Google Calendar** | Calendar | OAuth 2.0 | Same as Gmail OAuth | Google (verify DPA) | UI only |
| **LinkedIn** | Social | OAuth 2.0 | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI` | Verify DPA | UI only |
| **Stripe** | Billing | Secret + webhook | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY` | IE entity (approved) | UI only (mock connected) |
| **Brevo** | Email | API key | `BREVO_API_KEY` | EU (approved) | UI only |
| **AWS S3** | File storage | IAM keys | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_REGION=eu-west-2` | London (approved) | Not wired |
| **AWS SES** | Email send | IAM keys | Same AWS keys + `AWS_SES_FROM` | London (approved) | Not wired |
| **Sentry** | Error monitoring | DSN | `SENTRY_DSN` | EU (`de.sentry.io`) (approved) | Not wired |
| **Better Stack** | Logging | Source token | `BETTER_STACK_SOURCE_TOKEN` | Germany (approved) | Not wired |
| **HubSpot CRM** | CRM | OAuth / API key | `HUBSPOT_CLIENT_ID`, `HUBSPOT_CLIENT_SECRET` or `HUBSPOT_API_KEY` | Verify DPA | UI only |
| **Xero** | Finance | OAuth 2.0 | `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET` | Verify DPA | UI only |
| **Slack** | Notifications | OAuth / bot token | `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_BOT_TOKEN` | Verify DPA | UI only |
| **Microsoft Teams** | Notifications | OAuth / webhook | `TEAMS_WEBHOOK_URL` or Microsoft OAuth | Verify DPA | UI only |
| **WhatsApp Business** | Messaging | Meta API | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Verify DPA | UI only |
| **Zapier** | Automation | Webhook / API key | `ZAPIER_WEBHOOK_SECRET` | Verify DPA | UI only |
| **Redis** | Cache / pub-sub | Connection URL | `REDIS_URL` | UK/EU host when used | Not wired |
| **GitHub** | Source control | Personal / deploy token | `GITHUB_TOKEN` (CI only) | — | Repo only |
| **Vercel** | Web hosting | Dashboard token | `VERCEL_TOKEN` (deploy) | Verify data policy for prod | Web demo deploy |

---

## Banned (do not use for customer data)

| Service | Reason |
|---------|--------|
| Resend | US data storage |
| Cloudflare R2 | No UK region guarantee |
| Backblaze B2 | No UK region guarantee |

---

## Claw (inbound webhooks)

| Item | Key / auth | Status |
|------|------------|--------|
| Inbound JSON webhook | `CLAW_WEBHOOK_SECRET` (HMAC verify) | UI only — API not wired |

---

*Update this file when a new env key or integration is added. Never paste real secret values here.*
