import { workspaces } from "@workerai/db";
import type { LoginBody, RegisterBody } from "@workerai/shared/schemas/auth";
import { eq } from "drizzle-orm";
import {
  withPublicTransaction,
  withWorkspaceTransaction,
  type WorkspaceTx,
} from "../../infra/db/index";
import { AppError } from "../../lib/errors";
import { signSessionToken } from "../../lib/jwt";
import { hashPassword, verifyPassword } from "../../lib/password";
import { WorkspacesService } from "../workspaces/workspaces.service";
import * as repo from "./auth.repository";

async function loadWorkspaceInContext(
  tx: WorkspaceTx,
  workspaceId: string,
) {
  const rows = await tx
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);
  return rows[0] ?? null;
}

export const AuthService = {
  async register(input: RegisterBody) {
    const email = input.email.toLowerCase();

    const existing = await withPublicTransaction((tx) =>
      repo.findUserByEmail(tx, email),
    );
    if (existing) {
      throw new AppError(
        "EMAIL_IN_USE",
        "An account with this email already exists.",
        409,
      );
    }

    const passwordHash = await hashPassword(input.password);

    const result = await withPublicTransaction(async (tx) => {
      const user = await repo.insertUser(tx, {
        email,
        passwordHash,
        fullName: input.fullName,
      });
      if (!user) {
        throw new Error("Failed to create user");
      }

      const workspace = await WorkspacesService.createUniqueWorkspace(
        tx,
        input.companyName,
      );

      await repo.insertWorkspaceMember(tx, {
        workspaceId: workspace.id,
        userId: user.id,
        role: "owner",
      });

      const updated = await repo.setUserDefaultWorkspace(
        tx,
        user.id,
        workspace.id,
      );

      return {
        user: updated ?? user,
        workspace,
      };
    });

    const token = await signSessionToken({
      sub: result.user.id,
      email: result.user.email,
      workspaceId: result.workspace.id,
    });

    return {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
      },
      workspace: result.workspace,
    };
  },

  async login(input: LoginBody) {
    const email = input.email.toLowerCase();

    const user = await withPublicTransaction((tx) =>
      repo.findUserByEmail(tx, email),
    );

    if (!user) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        "Email or password is incorrect.",
        401,
      );
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError(
        "INVALID_CREDENTIALS",
        "Email or password is incorrect.",
        401,
      );
    }

    if (!user.defaultWorkspaceId) {
      throw new AppError(
        "NO_WORKSPACE",
        "No workspace is linked to this account.",
        403,
      );
    }

    const workspace = await withWorkspaceTransaction(
      user.defaultWorkspaceId,
      (tx) => loadWorkspaceInContext(tx, user.defaultWorkspaceId!),
    );

    if (!workspace) {
      throw new AppError("NO_WORKSPACE", "Workspace not found.", 403);
    }

    const token = await signSessionToken({
      sub: user.id,
      email: user.email,
      workspaceId: workspace.id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
    };
  },
};
