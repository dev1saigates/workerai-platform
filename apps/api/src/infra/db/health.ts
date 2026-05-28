import { loadEnv } from "@workerai/config";
import { pingDatabase } from "@workerai/db";

export async function checkDatabaseHealth(): Promise<{
  ok: boolean;
  error?: string;
}> {
  const env = loadEnv();
  try {
    await pingDatabase(env.DATABASE_URL);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
