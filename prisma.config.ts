import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

const appEnv = process.env.APP_ENV === "production" ? "production" : "dev";
const envPath = appEnv === "production" ? ".env.prod" : ".env.dev";

loadEnv({ path: envPath });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "",
  },
});
