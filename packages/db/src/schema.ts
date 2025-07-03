import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const user = pgTable("user", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(21)),
  name: text(),
  first_name: text(),
  last_name: text(),
  avatar_url: text(),
  email: text().unique().notNull(),

  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
  setup_at: timestamp(),
  terms_accepted_at: timestamp(),
});

export const oauthAccount = pgTable(
  "oauth_account",
  {
    provider_id: text().notNull(),
    provider_user_id: text().notNull(),
    user_id: text()
      .notNull()
      .references(() => user.id),
  },
  (table) => [primaryKey({ columns: [table.provider_id, table.provider_user_id] })],
);

export const session = pgTable("session", {
  id: text().primaryKey().notNull(),
  user_id: text()
    .notNull()
    .references(() => user.id),
  expires_at: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
