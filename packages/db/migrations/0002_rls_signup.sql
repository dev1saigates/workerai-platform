-- Allow workspace + membership creation during signup (no tenant context yet).
-- ⚠️ CRITICAL: Only applies when app.current_workspace is unset/empty.

CREATE POLICY workspaces_signup_insert ON workspaces
  FOR INSERT
  TO workerai_app
  WITH CHECK (
    coalesce(nullif(trim(current_setting('app.current_workspace', true)), ''), NULL) IS NULL
  );

CREATE POLICY workspace_members_signup_insert ON workspace_members
  FOR INSERT
  TO workerai_app
  WITH CHECK (
    coalesce(nullif(trim(current_setting('app.current_workspace', true)), ''), NULL) IS NULL
  );
