-- Four database roles (see project rules). Passwords are for LOCAL DEV ONLY.
-- Change all passwords before any shared/staging environment.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workerai_owner') THEN
    CREATE ROLE workerai_owner WITH LOGIN PASSWORD 'workerai_owner_dev_local' CREATEDB;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workerai_app') THEN
    CREATE ROLE workerai_app WITH LOGIN PASSWORD 'workerai_app_dev_local';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workerai_migrator') THEN
    CREATE ROLE workerai_migrator WITH LOGIN PASSWORD 'workerai_migrator_dev_local';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workerai_break_glass') THEN
    CREATE ROLE workerai_break_glass WITH LOGIN PASSWORD 'workerai_break_glass_dev_local' BYPASSRLS;
  END IF;
END
$$;

ALTER DATABASE workerai OWNER TO workerai_owner;

GRANT CONNECT ON DATABASE workerai TO workerai_app, workerai_migrator, workerai_break_glass;
GRANT ALL ON SCHEMA public TO workerai_owner, workerai_migrator, workerai_break_glass;
GRANT USAGE ON SCHEMA public TO workerai_app;

-- Default privileges for tables created by owner/migrator (app can read/write tenant data)
ALTER DEFAULT PRIVILEGES FOR ROLE workerai_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO workerai_app;
ALTER DEFAULT PRIVILEGES FOR ROLE workerai_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO workerai_app;
ALTER DEFAULT PRIVILEGES FOR ROLE workerai_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO workerai_app;
ALTER DEFAULT PRIVILEGES FOR ROLE workerai_migrator IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO workerai_app;
