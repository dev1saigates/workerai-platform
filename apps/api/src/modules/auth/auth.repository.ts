import { users, workspaceMembers } from "@workerai/db";
import { eq } from "drizzle-orm";
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

export async function insertWorkspaceMember(
  tx: PublicTx,
  data: { workspaceId: string; userId: string; role: "owner" },
) {
  const [row] = await tx
    .insert(workspaceMembers)
    .values({
      workspaceId: data.workspaceId,
      userId: data.userId,
      role: data.role,
    })
    .returning();
  return row;
}

export async function findUserById(tx: PublicTx, userId: string) {
  const rows = await tx
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0] ?? null;
}
