import { workspaces } from "@workerai/db";
import type { PublicTx } from "../../infra/db/index";

export async function insertWorkspace(
  tx: PublicTx,
  data: { name: string; slug: string },
) {
  const [row] = await tx
    .insert(workspaces)
    .values({
      name: data.name,
      slug: data.slug,
    })
    .returning();
  return row;
}
