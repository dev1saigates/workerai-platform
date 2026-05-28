import { loadEnv } from "@workerai/config";
import { createDb, type Db } from "@workerai/db";
import { sql } from "drizzle-orm";

const env = loadEnv();
const { db } = createDb(env.DATABASE_URL);

export { db };

export type WorkspaceTx = Db & { readonly __workspaceTx: unique symbol };
export type PublicTx = Db & { readonly __publicTx: unique symbol };
export type SystemTx = Db & { readonly __systemTx: unique symbol };

/** ⚠️ CRITICAL: Sets RLS workspace context. Never remove set_config. */
export async function withWorkspaceTransaction<T>(
  workspaceId: string,
  fn: (tx: WorkspaceTx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_workspace', ${workspaceId}, true)`,
    );
    return fn(tx as unknown as WorkspaceTx);
  });
}

export async function withPublicTransaction<T>(
  fn: (tx: PublicTx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    // ⚠️ CRITICAL: Clear workspace context so signup RLS policies allow bootstrap inserts.
    await tx.execute(sql`SELECT set_config('app.current_workspace', '', true)`);
    return fn(tx as unknown as PublicTx);
  });
}

export async function withSystemTransaction<T>(
  fn: (tx: SystemTx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => fn(tx as unknown as SystemTx));
}
