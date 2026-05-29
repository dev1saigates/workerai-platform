-- AI worker personas (tenant-scoped).

CREATE TABLE ai_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  role text NOT NULL,
  tone text DEFAULT 'Professional' NOT NULL,
  description text DEFAULT '' NOT NULL,
  emoji text DEFAULT '🤖' NOT NULL,
  system_prompt text DEFAULT '' NOT NULL,
  active boolean DEFAULT true NOT NULL,
  onboarded boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT ai_workers_workspace_slug_unique UNIQUE (workspace_id, slug)
);

CREATE INDEX ai_workers_workspace_id_idx ON ai_workers (workspace_id);

-- ⚠️ CRITICAL: Row-Level Security — workspace_id must match app.current_workspace.
ALTER TABLE ai_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY ai_workers_tenant_select ON ai_workers
  FOR SELECT
  TO workerai_app
  USING (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY ai_workers_tenant_insert ON ai_workers
  FOR INSERT
  TO workerai_app
  WITH CHECK (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY ai_workers_tenant_update ON ai_workers
  FOR UPDATE
  TO workerai_app
  USING (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  )
  WITH CHECK (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY ai_workers_tenant_delete ON ai_workers
  FOR DELETE
  TO workerai_app
  USING (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON ai_workers TO workerai_app;

ALTER DEFAULT PRIVILEGES FOR ROLE workerai_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO workerai_app;
