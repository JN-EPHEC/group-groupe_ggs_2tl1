import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

const appEnv = process.env.APP_ENV === "production" ? "production" : "dev";
const envPath = appEnv === "production" ? ".env.production" : ".env.dev";

loadEnv({ path: envPath });

if (process.env.DATABASE_URL?.includes("supabase.com") && !process.env.DATABASE_URL.includes("sslmode=")) {
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("sslmode", "require");
  process.env.DATABASE_URL = url.toString();
}

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
