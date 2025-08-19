import { pub } from "./base";
import { requiredAuthMiddleware } from "./middleware/auth";

export const authed = pub.use(requiredAuthMiddleware);
