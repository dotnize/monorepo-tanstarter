import { env } from "cloudflare:workers";

import { createDb } from "@repo/db";

export const getDb = () => createDb(env.DB);
