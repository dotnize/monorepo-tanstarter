import {
  invalidateSession,
  SESSION_COOKIE_NAME,
  SESSION_JWT_COOKIE_NAME,
} from "@repo/auth";
import { getAuthSession } from "@repo/auth/utils/tanstack";
import { createFileRoute } from "@tanstack/react-router";
import { deleteCookie, setResponseHeader } from "@tanstack/react-start/server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        setResponseHeader("Location", "/");

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
    },
  },
});
