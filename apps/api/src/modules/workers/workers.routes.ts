import {
  createWorkerBodySchema,
  updateWorkerBodySchema,
} from "@workerai/shared/schemas/workers";
import type { FastifyInstance, FastifyReply } from "fastify";
import { ZodError } from "zod";
import { requireAuth } from "../../lib/auth-guard";
import { AppError, isAppError } from "../../lib/errors";
import { WorkersService } from "./workers.service";

function workspaceIdFromRequest(request: {
  workspaceId?: string;
}): string {
  if (!request.workspaceId) {
    throw new AppError("UNAUTHORIZED", "Workspace context missing.", 401);
  }
  return request.workspaceId;
}

export async function workersRoutes(app: FastifyInstance) {
  app.get(
    "/workers",
    { preHandler: requireAuth },
    async (request) => {
      const workspaceId = workspaceIdFromRequest(request);
      const data = await WorkersService.list(workspaceId);
      return { success: true, data };
    },
  );

  app.get(
    "/workers/:slug",
    { preHandler: requireAuth },
    async (request) => {
      const workspaceId = workspaceIdFromRequest(request);
      const { slug } = request.params as { slug: string };
      const data = await WorkersService.getBySlug(workspaceId, slug);
      return { success: true, data };
    },
  );

  app.post(
    "/workers",
    { preHandler: requireAuth },
    async (request, reply) => {
      try {
        const workspaceId = workspaceIdFromRequest(request);
        const body = createWorkerBodySchema.parse(request.body);
        const data = await WorkersService.create(workspaceId, body);
        return reply.status(201).send({ success: true, data });
      } catch (err) {
        return handleWorkersError(reply, err);
      }
    },
  );

  app.patch(
    "/workers/:slug",
    { preHandler: requireAuth },
    async (request, reply) => {
      try {
        const workspaceId = workspaceIdFromRequest(request);
        const { slug } = request.params as { slug: string };
        const body = updateWorkerBodySchema.parse(request.body);
        const data = await WorkersService.update(workspaceId, slug, body);
        return { success: true, data };
      } catch (err) {
        return handleWorkersError(reply, err);
      }
    },
  );

  app.delete(
    "/workers/:slug",
    { preHandler: requireAuth },
    async (request, reply) => {
      try {
        const workspaceId = workspaceIdFromRequest(request);
        const { slug } = request.params as { slug: string };
        await WorkersService.remove(workspaceId, slug);
        return { success: true, data: { deleted: true } };
      } catch (err) {
        return handleWorkersError(reply, err);
      }
    },
  );
}

function handleWorkersError(reply: FastifyReply, err: unknown) {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    return reply.status(400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: first?.message ?? "Invalid request body",
        status: 400,
      },
    });
  }

  if (isAppError(err)) {
    return reply.status(err.status).send({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        status: err.status,
      },
    });
  }

  throw err;
}
