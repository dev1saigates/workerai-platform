import type { FastifyReply, FastifyRequest } from "fastify";
import { verifySessionToken } from "./jwt";

function unauthorized(reply: FastifyReply, message: string) {
  return reply.status(401).send({
    success: false,
    error: {
      code: "UNAUTHORIZED",
      message,
      status: 401,
    },
  });
}

/**
 * Fastify preHandler — verifies Bearer JWT and sets request.userId / workspaceId.
 * Use on any route that requires a logged-in user.
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    await unauthorized(reply, "Missing or invalid Authorization header");
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    await unauthorized(reply, "Missing or invalid Authorization header");
    return;
  }

  try {
    const claims = await verifySessionToken(token);
    // ⚠️ CRITICAL: workspaceId is used by withWorkspaceTransaction on protected routes.
    request.userId = claims.sub;
    request.userEmail = claims.email;
    request.workspaceId = claims.workspaceId;
  } catch {
    await unauthorized(reply, "Invalid or expired token");
  }
}
