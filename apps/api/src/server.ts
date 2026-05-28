import { loadEnv } from "@workerai/config";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { checkDatabaseHealth } from "./infra/db/health";
import { authRoutes } from "./modules/auth/auth.routes";

const env = loadEnv();

const app = Fastify({ logger: true });

await app.register(cors, {
  origin:
    env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : false,
  credentials: true,
});

app.get("/", async () => ({
  success: true,
  data: { message: "WorkerAI API is running" },
}));

app.get("/health", async () => ({
  success: true,
  data: {
    status: "ok",
    nodeEnv: env.NODE_ENV,
    databaseConfigured: Boolean(env.DATABASE_URL),
  },
}));

app.get("/health/db", async (_request, reply) => {
  const dbHealth = await checkDatabaseHealth();
  if (!dbHealth.ok) {
    return reply.status(503).send({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: dbHealth.error ?? "Database ping failed",
        status: 503,
      },
    });
  }
  return {
    success: true,
    data: { status: "ok", database: "connected" },
  };
});

await app.register(authRoutes);

try {
  await app.listen({ port: env.API_PORT, host: env.API_HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
