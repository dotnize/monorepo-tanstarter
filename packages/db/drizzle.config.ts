import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.SERVER_DATABASE_URL as string,
  },
} satisfies Config;
