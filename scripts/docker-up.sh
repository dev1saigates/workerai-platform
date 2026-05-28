#!/usr/bin/env bash
# Starts local Postgres. Adds Docker Desktop binaries to PATH (fixes
# "docker-credential-desktop: executable file not found").
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ -d "/Applications/Docker.app/Contents/Resources/bin" ]; then
  export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found. Install Docker Desktop and open it once:"
  echo "  https://docs.docker.com/desktop/setup/install/mac-install/"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker is installed but not running. Open Docker Desktop from Applications, wait until it says Running, then try again."
  exit 1
fi

docker compose up -d --build "$@"

echo ""
echo "Postgres should be on localhost:5432 (database: workerai)"
echo "Logs: pnpm docker:logs"
