import { drizzle, type AnyD1Database, type DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";

export type Database = DrizzleD1Database<typeof schema>;

export function createDb(d1: AnyD1Database): Database {
  return drizzle(d1, {
    schema,
    casing: "snake_case",
  });
}
