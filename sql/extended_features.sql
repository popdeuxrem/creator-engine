-- Extended features: variants, smart queue, assets, hashtags, competitors, engagement

CREATE TABLE IF NOT EXISTS content_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES content_ideas(id) ON DELETE CASCADE,
    variant_type TEXT NOT NULL,        -- caption | hook | script
    label TEXT,                        -- A | B | C
    platform TEXT,                     -- tiktok | instagram | x | linkedin
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_idea ON content_variants(idea_id);

CREATE TABLE IF NOT EXISTS post_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES content_ideas(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES content_variants(id) ON DELETE SET NULL,
    platform TEXT NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    priority INT DEFAULT 0,
    status TEXT DEFAULT 'queued',      -- queued | posting | posted | failed | skipped
    first_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_queue_platform_time ON post_queue(platform, scheduled_for);

CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_path TEXT NOT NULL,
    type TEXT NOT NULL,                -- video | image | audio
    topic TEXT,
    tags TEXT[] DEFAULT '{}',
    source TEXT,                       -- generated | uploaded | repurposed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_tags_gin ON assets USING GIN(tags);

CREATE TABLE IF NOT EXISTS hashtag_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    topic TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    score DOUBLE PRECISION DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hashtag_topic_platform ON hashtag_sets(platform, topic);

CREATE TABLE IF NOT EXISTS competitor_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    handle TEXT NOT NULL,
    profile_url TEXT,
    last_scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competitor_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id UUID REFERENCES competitor_accounts(id) ON DELETE CASCADE,
    platform_post_id TEXT NOT NULL,
    posted_at TIMESTAMPTZ,
    views BIGINT,
    likes BIGINT,
    comments BIGINT,
    shares BIGINT,
    saves BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comp_posts_comp ON competitor_posts(competitor_id);

CREATE TABLE IF NOT EXISTS engagement_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    platform_post_id TEXT NOT NULL,
    event_type TEXT NOT NULL,         -- comment | reply | mention
    author_handle TEXT,
    content TEXT,
    sentiment TEXT,                   -- positive | neutral | negative
    requires_reply BOOLEAN DEFAULT FALSE,
    replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eng_events_reply ON engagement_events(requires_reply, replied);
