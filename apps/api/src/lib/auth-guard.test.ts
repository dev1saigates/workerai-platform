import { describe, expect, it } from "vitest";
import { buildApp } from "../app";
import { signSessionToken } from "./jwt";

describe("requireAuth", () => {
  it("returns 401 without Authorization header", async () => {
    const app = await buildApp({ logger: false });

    const res = await app.inject({
      method: "GET",
      url: "/auth/me",
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toMatchObject({
      success: false,
      error: { code: "UNAUTHORIZED" },
    });

    await app.close();
  });

  it("returns 401 for invalid token", async () => {
    const app = await buildApp({ logger: false });

    const res = await app.inject({
      method: "GET",
      url: "/auth/me",
      headers: { authorization: "Bearer not-a-valid-jwt" },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns session for valid Bearer token", async () => {
    const app = await buildApp({ logger: false });
    const token = await signSessionToken({
      sub: "user-123",
      email: "me@example.com",
      workspaceId: "ws-456",
    });

    const res = await app.inject({
      method: "GET",
      url: "/auth/me",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      success: true,
      data: {
        user: { id: "user-123", email: "me@example.com" },
        workspaceId: "ws-456",
      },
    });

    await app.close();
  });
});
