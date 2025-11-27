import Fastify from "fastify";
import { exec } from "child_process";

const fastify = Fastify({ logger: true });

function runScript(command) {
  return new Promise((resolve, reject) => {
    const child = exec(command, { env: process.env }, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stdout, stderr });
      }
      resolve({ stdout, stderr });
    });
  });
}

fastify.get("/health", async () => {
  return { status: "ok", service: "creator-engine-api" };
});

// LLM idea generation
fastify.post("/run/generate_daily_batch", async (request, reply) => {
  try {
    const result = await runScript("node scripts/generate_daily_batch.js");
    return { ok: true, ...result };
  } catch (e) {
    reply.code(500);
    return { ok: false, ...e };
  }
});

// Analytics scoring
fastify.post("/run/score_analytics", async (request, reply) => {
  try {
    const result = await runScript("node scripts/analytics_scoring.js");
    return { ok: true, ...result };
  } catch (e) {
    reply.code(500);
    return { ok: false, ...e };
  }
});

// Stubs for per-platform autopost hooks - you can extend these to call
// TikTok / IG / X / LinkedIn helpers + Supabase queue logic.

fastify.post("/run/tiktok_post", async (request, reply) => {
  // TODO: implement Supabase queue pop + TikTok upload
  fastify.log.info("tiktok_post hook invoked (stub)");
  return { ok: true, message: "tiktok_post stub" };
});

fastify.post("/run/instagram_post", async (request, reply) => {
  // TODO: implement Supabase queue pop + IG Graph publish
  fastify.log.info("instagram_post hook invoked (stub)");
  return { ok: true, message: "instagram_post stub" };
});

fastify.post("/run/x_post", async (request, reply) => {
  // TODO: implement Supabase queue pop + X publish
  fastify.log.info("x_post hook invoked (stub)");
  return { ok: true, message: "x_post stub" };
});

fastify.post("/run/linkedin_post", async (request, reply) => {
  // TODO: implement Supabase queue pop + LinkedIn publish
  fastify.log.info("linkedin_post hook invoked (stub)");
  return { ok: true, message: "linkedin_post stub" };
});

// Analytics ingest stub
fastify.post("/run/analytics_ingest", async (request, reply) => {
  fastify.log.info("analytics_ingest hook invoked (stub)");
  return { ok: true, message: "analytics_ingest stub" };
});

// Auto responder stub
fastify.post("/run/auto_responder", async (request, reply) => {
  fastify.log.info("auto_responder hook invoked (stub)");
  return { ok: true, message: "auto_responder stub" };
});

// Competitor scan stub
fastify.post("/run/competitor_scan", async (request, reply) => {
  fastify.log.info("competitor_scan hook invoked (stub)");
  return { ok: true, message: "competitor_scan stub" };
});

const port = process.env.PORT || 4000;
const host = "0.0.0.0";

fastify.listen({ port, host })
  .then(() => {
    fastify.log.info(`creator-engine-api listening on ${host}:${port}`);
  })
  .catch(err => {
    fastify.log.error(err);
    process.exit(1);
  });
