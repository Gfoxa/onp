import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations-sqlite",
    seed: "node node_modules/tsx/dist/cli.mjs prisma/seed.ts",
  },
  datasource: { url: env("DATABASE_URL") },
});
