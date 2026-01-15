import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const client = postgres(process.env.SERVER_DATABASE_URL as string);

export const db = drizzle({
  client,
  schema,
  casing: "snake_case",
});
