-- Signup inserts bypass broken RLS WITH CHECK on custom GUCs (Postgres quirk).
-- ⚠️ CRITICAL: SECURITY DEFINER runs as owner; only used during register in one transaction.

DROP POLICY IF EXISTS workspaces_signup_insert ON workspaces;
DROP POLICY IF EXISTS workspace_members_signup_insert ON workspace_members;

CREATE OR REPLACE FUNCTION workerai_bootstrap_insert_workspace(
  p_name text,
  p_slug text
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO workspaces (name, slug)
  VALUES (p_name, p_slug)
  RETURNING
    workspaces.id,
    workspaces.name,
    workspaces.slug,
    workspaces.created_at,
    workspaces.updated_at;
$$;

CREATE OR REPLACE FUNCTION workerai_bootstrap_insert_workspace_member(
  p_workspace_id uuid,
  p_user_id uuid,
  p_role member_role
)
RETURNS TABLE (
  id uuid,
  workspace_id uuid,
  user_id uuid,
  role member_role,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (p_workspace_id, p_user_id, p_role)
  RETURNING
    workspace_members.id,
    workspace_members.workspace_id,
    workspace_members.user_id,
    workspace_members.role,
    workspace_members.created_at;
$$;

ALTER FUNCTION workerai_bootstrap_insert_workspace(text, text) OWNER TO workerai_owner;
ALTER FUNCTION workerai_bootstrap_insert_workspace_member(uuid, uuid, member_role) OWNER TO workerai_owner;

REVOKE ALL ON FUNCTION workerai_bootstrap_insert_workspace(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION workerai_bootstrap_insert_workspace_member(uuid, uuid, member_role) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION workerai_bootstrap_insert_workspace(text, text) TO workerai_app;
GRANT EXECUTE ON FUNCTION workerai_bootstrap_insert_workspace_member(uuid, uuid, member_role) TO workerai_app;
