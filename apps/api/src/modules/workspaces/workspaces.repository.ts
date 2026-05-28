import { sql } from "drizzle-orm";
import type { PublicTx } from "../../infra/db/index";

type WorkspaceRow = {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
};

/** Signup only — uses SECURITY DEFINER function (RLS-safe bootstrap). */
export async function insertWorkspace(
  tx: PublicTx,
  data: { name: string; slug: string },
) {
  const result = await tx.execute<WorkspaceRow>(
    sql`SELECT * FROM workerai_bootstrap_insert_workspace(${data.name}, ${data.slug})`,
  );

  const row = result[0];
  if (!row) return undefined;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
