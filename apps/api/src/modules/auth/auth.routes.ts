import {
  loginBodySchema,
  registerBodySchema,
} from "@workerai/shared/schemas/auth";
import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { requireAuth } from "../../lib/auth-guard";
import { AppError, isAppError } from "../../lib/errors";
import { AuthService } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
  app.get(
    "/auth/me",
    { preHandler: requireAuth },
    async (request) => ({
      success: true,
      data: {
        user: {
          id: request.userId,
          email: request.userEmail,
        },
        workspaceId: request.workspaceId,
      },
    }),
  );
  app.post("/auth/register", async (request, reply) => {
    try {
      const body = registerBodySchema.parse(request.body);
      const data = await AuthService.register(body);
      return { success: true, data };
    } catch (err) {
      return handleAuthError(reply, err);
    }
  });

  app.post("/auth/login", async (request, reply) => {
    try {
      const body = loginBodySchema.parse(request.body);
      const data = await AuthService.login(body);
      return { success: true, data };
    } catch (err) {
      return handleAuthError(reply, err);
    }
  });
}

function handleAuthError(
  reply: { status: (code: number) => { send: (body: unknown) => unknown } },
  err: unknown,
) {
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

  const pgCode =
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string"
      ? (err as { code: string }).code
      : null;

  if (pgCode === "42501") {
    return reply.status(503).send({
      success: false,
      error: {
        code: "DATABASE_POLICY_ERROR",
        message:
          "Could not create workspace (database security policy). Run pnpm db:migrate and try again.",
        status: 503,
      },
    });
  }

  throw err;
}
