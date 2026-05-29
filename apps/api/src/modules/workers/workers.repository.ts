import { aiWorkers } from "@workerai/db";
import { and, asc, eq } from "drizzle-orm";
import type { WorkspaceTx } from "../../infra/db/index";

export async function listWorkersByWorkspace(tx: WorkspaceTx, workspaceId: string) {
  return tx
    .select()
    .from(aiWorkers)
    .where(eq(aiWorkers.workspaceId, workspaceId))
    .orderBy(asc(aiWorkers.name));
}

export async function findWorkerBySlug(
  tx: WorkspaceTx,
  workspaceId: string,
  slug: string,
) {
  const rows = await tx
    .select()
    .from(aiWorkers)
    .where(
      and(eq(aiWorkers.workspaceId, workspaceId), eq(aiWorkers.slug, slug)),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function insertWorker(
  tx: WorkspaceTx,
  data: {
    workspaceId: string;
    name: string;
    slug: string;
    role: string;
    tone: string;
    description: string;
    emoji: string;
    systemPrompt: string;
  },
) {
  const [row] = await tx
    .insert(aiWorkers)
    .values({
      workspaceId: data.workspaceId,
      name: data.name,
      slug: data.slug,
      role: data.role,
      tone: data.tone,
      description: data.description,
      emoji: data.emoji,
      systemPrompt: data.systemPrompt,
    })
    .returning();
  return row;
}

export async function updateWorkerBySlug(
  tx: WorkspaceTx,
  workspaceId: string,
  slug: string,
  patch: Partial<{
    name: string;
    slug: string;
    role: string;
    tone: string;
    description: string;
    emoji: string;
    systemPrompt: string;
    active: boolean;
    onboarded: boolean;
  }>,
) {
  const [row] = await tx
    .update(aiWorkers)
    .set({ ...patch, updatedAt: new Date() })
    .where(
      and(eq(aiWorkers.workspaceId, workspaceId), eq(aiWorkers.slug, slug)),
    )
    .returning();
  return row;
}

export async function deleteWorkerBySlug(
  tx: WorkspaceTx,
  workspaceId: string,
  slug: string,
) {
  const [row] = await tx
    .delete(aiWorkers)
    .where(
      and(eq(aiWorkers.workspaceId, workspaceId), eq(aiWorkers.slug, slug)),
    )
    .returning();
  return row;
}
