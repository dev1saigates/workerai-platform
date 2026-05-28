import { users } from "@workerai/db";
import { eq, sql } from "drizzle-orm";
import type { PublicTx } from "../../infra/db/index";

export async function findUserByEmail(tx: PublicTx, email: string) {
  const rows = await tx
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return rows[0] ?? null;
}

export async function insertUser(
  tx: PublicTx,
  data: { email: string; passwordHash: string; fullName: string },
) {
  const [row] = await tx
    .insert(users)
    .values({
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
    })
    .returning();
  return row;
}

export async function setUserDefaultWorkspace(
  tx: PublicTx,
  userId: string,
  workspaceId: string,
) {
  const [row] = await tx
    .update(users)
    .set({ defaultWorkspaceId: workspaceId, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return row;
}

type WorkspaceMemberRow = {
  id: string;
  workspace_id: string;
  user_id: string;
  role: "owner" | "manager" | "member";
  created_at: Date;
};

/** Signup only — uses SECURITY DEFINER function (RLS-safe bootstrap). */
export async function insertWorkspaceMember(
  tx: PublicTx,
  data: { workspaceId: string; userId: string; role: "owner" },
) {
  const result = await tx.execute<WorkspaceMemberRow>(
    sql`SELECT * FROM workerai_bootstrap_insert_workspace_member(${data.workspaceId}, ${data.userId}, ${data.role}::member_role)`,
  );

  const row = result[0];
  if (!row) return undefined;

  return {
    id: row.id,
    workspaceId: row.workspace_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function findUserById(tx: PublicTx, userId: string) {
  const rows = await tx
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0] ?? null;
}
