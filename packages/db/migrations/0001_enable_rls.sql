-- ⚠️ CRITICAL: Row-Level Security — tenants must never see each other's data.
-- API sets app.current_workspace via withWorkspaceTransaction before tenant queries.

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspaces_tenant_isolation ON workspaces
  FOR ALL
  TO workerai_app
  USING (
    id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  )
  WITH CHECK (
    id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY workspace_members_tenant_isolation ON workspace_members
  FOR ALL
  TO workerai_app
  USING (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  )
  WITH CHECK (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

-- users: global login table — no RLS here; auth uses withPublicTransaction + careful queries.
