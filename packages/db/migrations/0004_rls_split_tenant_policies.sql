-- Fix signup: FOR ALL tenant policy blocked INSERT even when signup_insert exists.
-- Split tenant isolation into SELECT/UPDATE/DELETE only; INSERT uses signup policy.

DROP POLICY IF EXISTS workspaces_tenant_isolation ON workspaces;
DROP POLICY IF EXISTS workspace_members_tenant_isolation ON workspace_members;

CREATE POLICY workspaces_tenant_select ON workspaces
  FOR SELECT
  TO workerai_app
  USING (
    id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY workspaces_tenant_update ON workspaces
  FOR UPDATE
  TO workerai_app
  USING (
    id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  )
  WITH CHECK (
    id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY workspaces_tenant_delete ON workspaces
  FOR DELETE
  TO workerai_app
  USING (
    id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY workspace_members_tenant_select ON workspace_members
  FOR SELECT
  TO workerai_app
  USING (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY workspace_members_tenant_update ON workspace_members
  FOR UPDATE
  TO workerai_app
  USING (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  )
  WITH CHECK (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );

CREATE POLICY workspace_members_tenant_delete ON workspace_members
  FOR DELETE
  TO workerai_app
  USING (
    workspace_id = NULLIF(current_setting('app.current_workspace', true), '')::uuid
  );
