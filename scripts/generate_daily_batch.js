import OpenAI from "openai";
import { supabase } from "./supabase_client.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  console.log("[generate_daily_batch] starting");
  const prompt = `
Generate 10 short-form content ideas for TikTok / Reels / Shorts.
Return a JSON array of objects with:
- title
- topic
- hook
- script_short
- script_medium
- script_long
`;

  const res = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }]
  });

  let ideas;
  try {
    ideas = JSON.parse(res.choices[0].message.content);
  } catch (e) {
    console.error("Failed to parse ideas JSON:", e);
    console.error("Raw:", res.choices[0].message.content);
    process.exit(1);
  }

  for (const idea of ideas) {
    const { data, error } = await supabase.from("content_ideas").insert({
      idea_title: idea.title,
      idea_topic: idea.topic,
      hook: idea.hook,
      script_short: idea.script_short,
      script_medium: idea.script_medium,
      script_long: idea.script_long
    }).select().single();

    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log("Inserted idea:", data.id);
    }
  }
  console.log("[generate_daily_batch] done");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
