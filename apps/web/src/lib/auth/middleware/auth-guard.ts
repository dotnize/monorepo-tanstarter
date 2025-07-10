import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import type { FetchSessionOptions } from "~/lib/auth/utils";
import { getAuthSession } from "~/lib/auth/utils";

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const authMiddleware = (options?: FetchSessionOptions) =>
  createMiddleware({ type: "function" }).server(async ({ next }) => {
    const { user } = await getAuthSession(options);

    if (!user) {
      setResponseStatus(401);
      throw new Error("Unauthorized");
    }

    return next({ context: { user } });
  });
