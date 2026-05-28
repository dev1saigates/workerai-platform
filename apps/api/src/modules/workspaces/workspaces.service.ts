import type { PublicTx } from "../../infra/db/index";
import { slugifyName, withRandomSuffix } from "../../lib/slug";
import * as repo from "./workspaces.repository";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "23505"
  );
}

export const WorkspacesService = {
  /** Insert workspace; retry on slug collision (avoids RLS-blocked SELECT during signup). */
  async createUniqueWorkspace(
    tx: PublicTx,
    companyName: string,
  ): Promise<{ id: string; name: string; slug: string }> {
    const name = companyName.trim();
    let slug = slugifyName(name);

    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        const row = await repo.insertWorkspace(tx, { name, slug });
        if (!row) {
          throw new Error("Failed to create workspace");
        }
        return { id: row.id, name: row.name, slug: row.slug };
      } catch (err) {
        if (isUniqueViolation(err)) {
          slug = withRandomSuffix(slugifyName(name));
          continue;
        }
        throw err;
      }
    }

    throw new Error("Could not allocate a unique workspace slug");
  },
};
