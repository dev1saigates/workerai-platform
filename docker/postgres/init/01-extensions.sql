-- Runs once when the Postgres data volume is first created.
-- ⚠️ LEGAL: Production DB must stay UK/EU (this file is for local Docker only).

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_partman is for audit log partitioning in production; add on hosted Postgres later.
