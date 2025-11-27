# Creator Engine v4.3 (Refined)

Opinionated starter for an automated multi-platform creator engine:

- Supabase for ideas, posts, analytics, queue
- n8n for scheduling and orchestration
- Node scripts for generation + scoring + posting
- Metabase-ready schema for dashboards
- GitHub Actions for daily automation

## Structure

- sql/schema.sql – core tables
- sql/extended_features.sql – variants, queue, assets, competitors, engagement
- scripts/ – Node scripts (Supabase client, generators, publishers)
- n8n/ – importable workflow JSONs (per-platform autopost, scheduler, analytics, responder)
- dashboards/ – JSON descriptors for dashboards and panels
- test_harness/ – quick scripts for local simulations
- .github/workflows/ – example CI for daily generation and scoring
- docker-compose.yml – n8n + Metabase + Caddy

## Environment

Copy `.env.example` to `.env` and fill:

- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_DB_URL (optional, for direct Postgres access)
- OPENAI_API_KEY
- TIKTOK_ACCESS_TOKEN
- TIKTOK_ADVERTISER_ID
- IG_APP_ID
- IG_APP_SECRET
- IG_USER_ID
- IG_PAGE_ID
- IG_ACCESS_TOKEN
- X_API_KEY
- X_API_SECRET
- X_ACCESS_TOKEN
- X_ACCESS_SECRET
- LINKEDIN_CLIENT_ID
- LINKEDIN_CLIENT_SECRET
- LINKEDIN_ACCESS_TOKEN
- LINKEDIN_ORGANIZATION_ID
- SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / EMAIL_FROM / EMAIL_TO (if you wire email digests)
