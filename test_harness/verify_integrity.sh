#!/usr/bin/env bash
set -euo pipefail

echo "[verify_integrity] checking required env vars..."
required=(SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY OPENAI_API_KEY)
for k in "${required[@]}"; do
  if [ -z "${!k:-}" ]; then
    echo "Missing env var: $k"
    exit 1
  fi
done

echo "[verify_integrity] basic check passed."
