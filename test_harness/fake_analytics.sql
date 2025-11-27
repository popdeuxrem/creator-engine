-- Simple fake analytics injector for local testing
INSERT INTO analytics_raw (post_id, impressions, views, likes, comments, shares, saves, watch_time_seconds, completion_rate)
SELECT id,
       1000 + floor(random() * 5000),
       800 + floor(random() * 4000),
       50 + floor(random() * 300),
       10 + floor(random() * 80),
       5 + floor(random() * 50),
       3 + floor(random() * 40),
       120 + floor(random() * 600),
       0.3 + random() * 0.6
FROM platform_posts
ORDER BY created_at DESC
LIMIT 20;
