#!/usr/bin/env bash
set -euo pipefail

echo "[simulate_daily_run] generating ideas..."
npm run generate:daily

echo "[simulate_daily_run] scoring analytics..."
npm run score:analytics

echo "[simulate_daily_run] done."
