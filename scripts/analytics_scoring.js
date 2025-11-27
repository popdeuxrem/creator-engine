import { supabase } from "./supabase_client.js";

async function main() {
  console.log("[analytics_scoring] starting");

  const { data: rows, error } = await supabase
    .from("analytics_raw")
    .select("*, platform_posts(idea_id)")
    .order("collected_at", { ascending: false })
    .limit(2000);

  if (error) {
    console.error("Fetch analytics_raw error:", error);
    process.exit(1);
  }

  for (const row of rows) {
    const views = row.views || 0;
    const likes = row.likes || 0;
    const comments = row.comments || 0;
    const shares = row.shares || 0;
    const saves = row.saves || 0;
    const completion = row.completion_rate || 0;

    const score =
      completion * 0.3 +
      ((likes + comments) / (views + 1)) * 0.25 +
      ((shares + saves) / (views + 1)) * 0.2 +
      Math.log10(views + 10) * 0.25;

    const ideaId = row.platform_posts?.idea_id;
    if (!ideaId) continue;

    const { error: insErr } = await supabase.from("analytics_scored").upsert(
      {
        idea_id: ideaId,
        final_score: score,
        updated_at: new Date().toISOString()
      },
      { onConflict: "idea_id" }
    );

    if (insErr) console.error("Upsert error:", insErr);
  }

  console.log("[analytics_scoring] done");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
