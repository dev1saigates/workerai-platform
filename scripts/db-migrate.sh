#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [ -z "${DATABASE_URL_MIGRATE:-}" ]; then
  echo "DATABASE_URL_MIGRATE is missing from .env"
  exit 1
fi

export DATABASE_URL_MIGRATE
pnpm --filter @workerai/db migrate
