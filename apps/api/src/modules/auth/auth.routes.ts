import {
  loginBodySchema,
  registerBodySchema,
} from "@workerai/shared/schemas/auth";
import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError, isAppError } from "../../lib/errors";
import { AuthService } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
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

  throw err;
}
