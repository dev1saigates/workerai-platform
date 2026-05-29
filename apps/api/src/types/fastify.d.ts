import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    /** Set by requireAuth after JWT verification. */
    userId?: string;
    userEmail?: string;
    workspaceId?: string;
  }
}
