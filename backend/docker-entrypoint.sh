#!/bin/sh
set -e

cd /app

# Docker volume mounts are often root-owned; API runs as node (see Dockerfile).
mkdir -p /app/uploads/hero /app/uploads/team
chown -R node:node /app/uploads

run_as_node() {
  exec su-exec node "$@"
}

if [ "${RUN_MIGRATIONS:-true}" = "true" ] && [ -n "${DATABASE_URL}" ]; then
  echo "[entrypoint] Applying database migrations..."
  su-exec node npx prisma migrate deploy
else
  echo "[entrypoint] Skipping migrations."
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database (RUN_SEED=true)..."
  su-exec node node prisma/seed.js
fi

echo "[entrypoint] Starting API on port ${PORT:-5000}..."
run_as_node node src/server.js
