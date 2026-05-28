import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

export type Db = ReturnType<typeof createDb>["db"];

export function createDb(connectionString: string) {
  const client = postgres(connectionString, { max: 10 });
  const db = drizzle(client, { schema });
  return { db, client };
}

export async function pingDatabase(connectionString: string): Promise<void> {
  const client = postgres(connectionString, { max: 1 });
  try {
    await client`SELECT 1`;
  } finally {
    await client.end({ timeout: 5 });
  }
}
