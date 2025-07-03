import {
  invalidateSession,
  SESSION_COOKIE_NAME,
  SESSION_JWT_COOKIE_NAME,
} from "@repo/auth";
import {
  createServerFileRoute,
  deleteCookie,
  setHeader,
} from "@tanstack/react-start/server";
import { getAuthSession } from "~/lib/auth/utils";

export const ServerRoute = createServerFileRoute("/api/auth/logout").methods({
  POST: async () => {
    setHeader("Location", "/");

    const { session } = await getAuthSession({ noCookieRefresh: true });
    if (!session) {
      return new Response(null, {
        status: 401,
      });
    }

    deleteCookie(SESSION_COOKIE_NAME);
    deleteCookie(SESSION_JWT_COOKIE_NAME);
    await invalidateSession(session.id);

    return new Response(null, {
      status: 302,
    });
  },
});
