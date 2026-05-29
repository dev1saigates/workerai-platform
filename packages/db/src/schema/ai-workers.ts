import { boolean, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const aiWorkers = pgTable(
  "ai_workers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    role: text("role").notNull(),
    tone: text("tone").notNull().default("Professional"),
    description: text("description").notNull().default(""),
    emoji: text("emoji").notNull().default("🤖"),
    systemPrompt: text("system_prompt").notNull().default(""),
    active: boolean("active").notNull().default(true),
    onboarded: boolean("onboarded").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    workspaceSlugUnique: unique("ai_workers_workspace_slug_unique").on(
      table.workspaceId,
      table.slug,
    ),
  }),
);
