import { loadEnv } from "@workerai/config";
import { buildApp } from "./app";

const env = loadEnv();
const app = await buildApp({ logger: true });

try {
  await app.listen({ port: env.API_PORT, host: env.API_HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
