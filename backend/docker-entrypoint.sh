#!/bin/sh
set -e

cd /app

if [ "${RUN_MIGRATIONS:-true}" = "true" ] && [ -n "${DATABASE_URL}" ]; then
  echo "[entrypoint] Applying database migrations..."
  npx prisma migrate deploy
else
  echo "[entrypoint] Skipping migrations."
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database (RUN_SEED=true)..."
  node prisma/seed.js
fi

echo "[entrypoint] Starting API on port ${PORT:-5000}..."
exec node src/server.js
