import type {
  CreateWorkerBody,
  UpdateWorkerBody,
  Worker,
} from "@workerai/shared/schemas/workers";
import { withWorkspaceTransaction } from "../../infra/db/index";
import { AppError } from "../../lib/errors";
import { slugifyName, withRandomSuffix } from "../../lib/slug";
import * as repo from "./workers.repository";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "23505"
  );
}

function toWorker(row: {
  id: string;
  slug: string;
  name: string;
  role: string;
  tone: string;
  description: string;
  emoji: string;
  systemPrompt: string;
  active: boolean;
  onboarded: boolean;
}): Worker {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    tone: row.tone,
    description: row.description,
    emoji: row.emoji,
    systemPrompt: row.systemPrompt,
    active: row.active,
    onboarded: row.onboarded,
  };
}

export const WorkersService = {
  async list(workspaceId: string): Promise<Worker[]> {
    const rows = await withWorkspaceTransaction(workspaceId, (tx) =>
      repo.listWorkersByWorkspace(tx, workspaceId),
    );
    return rows.map(toWorker);
  },

  async getBySlug(workspaceId: string, slug: string): Promise<Worker> {
    const row = await withWorkspaceTransaction(workspaceId, (tx) =>
      repo.findWorkerBySlug(tx, workspaceId, slug),
    );
    if (!row) {
      throw new AppError("WORKER_NOT_FOUND", "Worker not found.", 404);
    }
    return toWorker(row);
  },

  async create(workspaceId: string, input: CreateWorkerBody): Promise<Worker> {
    const name = input.name.trim();
    let slug = slugifyName(name);
    const tone = input.tone?.trim() || "Professional";
    const description = input.description?.trim() ?? "";
    const emoji = input.emoji?.trim() || "🤖";
    const systemPrompt = input.systemPrompt?.trim() ?? "";

    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        const row = await withWorkspaceTransaction(workspaceId, (tx) =>
          repo.insertWorker(tx, {
            workspaceId,
            name,
            slug,
            role: input.role.trim(),
            tone,
            description,
            emoji,
            systemPrompt,
          }),
        );
        if (!row) {
          throw new Error("Failed to create worker");
        }
        return toWorker(row);
      } catch (err) {
        if (isUniqueViolation(err)) {
          slug = withRandomSuffix(slugifyName(name));
          continue;
        }
        throw err;
      }
    }

    throw new AppError(
      "WORKER_SLUG_CONFLICT",
      "Could not allocate a unique worker slug.",
      409,
    );
  },

  async update(
    workspaceId: string,
    slug: string,
    input: UpdateWorkerBody,
  ): Promise<Worker> {
    const patch: Parameters<typeof repo.updateWorkerBySlug>[3] = {};

    if (input.name !== undefined) patch.name = input.name.trim();
    if (input.role !== undefined) patch.role = input.role.trim();
    if (input.tone !== undefined) patch.tone = input.tone.trim();
    if (input.description !== undefined) patch.description = input.description.trim();
    if (input.emoji !== undefined) patch.emoji = input.emoji.trim();
    if (input.systemPrompt !== undefined) {
      patch.systemPrompt = input.systemPrompt.trim();
    }
    if (input.active !== undefined) patch.active = input.active;
    if (input.onboarded !== undefined) patch.onboarded = input.onboarded;

    const row = await withWorkspaceTransaction(workspaceId, (tx) =>
      repo.updateWorkerBySlug(tx, workspaceId, slug, patch),
    );
    if (!row) {
      throw new AppError("WORKER_NOT_FOUND", "Worker not found.", 404);
    }
    return toWorker(row);
  },

  async remove(workspaceId: string, slug: string): Promise<void> {
    const row = await withWorkspaceTransaction(workspaceId, (tx) =>
      repo.deleteWorkerBySlug(tx, workspaceId, slug),
    );
    if (!row) {
      throw new AppError("WORKER_NOT_FOUND", "Worker not found.", 404);
    }
  },
};
