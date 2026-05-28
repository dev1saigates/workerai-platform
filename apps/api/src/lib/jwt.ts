import { loadEnv } from "@workerai/config";
import * as jose from "jose";

export type SessionClaims = {
  sub: string;
  email: string;
  workspaceId: string;
};

const env = loadEnv();
const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signSessionToken(
  claims: SessionClaims,
): Promise<string> {
  return new jose.SignJWT({
    email: claims.email,
    workspaceId: claims.workspaceId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionClaims> {
  const { payload } = await jose.jwtVerify(token, secret);
  const sub = payload.sub;
  const email = payload.email;
  const workspaceId = payload.workspaceId;

  if (typeof sub !== "string" || typeof email !== "string") {
    throw new Error("Invalid token payload");
  }
  if (typeof workspaceId !== "string") {
    throw new Error("Invalid token payload");
  }

  return { sub, email, workspaceId };
}
