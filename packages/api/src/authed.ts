import { pub } from "./base";
import { requiredAuthMiddleware } from "./lib/auth/middleware";

export const authed = pub.use(requiredAuthMiddleware);
