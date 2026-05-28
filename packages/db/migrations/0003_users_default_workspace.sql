ALTER TABLE users
  ADD COLUMN IF NOT EXISTS default_workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL;
