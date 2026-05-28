import { z } from "zod";

/**
 * All secrets and URLs validated at startup — app crashes if anything is missing.
 * PHP analogy: one bootstrap file that checks $_ENV before loading the app.
 */

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  // ⚠️ SECURITY: Never add a fallback for JWT_SECRET or DATABASE_URL.
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  DATABASE_URL_MIGRATE: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  if (cached) return cached;
  cached = envSchema.parse(source);
  return cached;
}
