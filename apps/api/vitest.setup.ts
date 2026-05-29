// Test env — satisfies @workerai/config Zod validation (no real secrets).
process.env.NODE_ENV = "test";
process.env.JWT_SECRET ??=
  "test-jwt-secret-minimum-32-characters-long-for-ci";
process.env.DATABASE_URL ??=
  "postgresql://workerai_app:workerai_app_dev_local@localhost:5432/workerai";
