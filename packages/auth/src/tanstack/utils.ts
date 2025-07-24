import {
  createSessionJWT,
  SESSION_COOKIE_NAME,
  SESSION_JWT_COOKIE_NAME,
  SessionUser,
  validateSessionJWT,
  validateSessionToken,
} from "@repo/auth";
import type { Session } from "@repo/db/schema";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

export function setSessionCookie(name: string, value: string, expiresAt: Date) {
  setCookie(name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export interface FetchSessionOptions {
  noCookieRefresh?: boolean;
  bypassJwt?: boolean;
}

/**
 * Retrieves the session and user data if valid.
 * Can be used in server routes and functions.
 */
export async function getAuthSession(options?: FetchSessionOptions) {
  const token = getCookie(SESSION_COOKIE_NAME);
  const jwt = getCookie(SESSION_JWT_COOKIE_NAME);
  if (!token) {
    return { session: null, user: null };
  }

  let session: Session | null = null;
  let user: SessionUser | null = null;

  if (!options?.bypassJwt && jwt) {
    // Check for valid JWT
    ({ session, user } = await validateSessionJWT(jwt));
  }

  if (!session || !user) {
    // JWT invalid or expired, fallback to session db call
    ({ session, user } = await validateSessionToken(token));
  }

  if (!session || !user) {
    deleteCookie(SESSION_COOKIE_NAME);
    deleteCookie(SESSION_JWT_COOKIE_NAME);
    return { session: null, user: null };
  }
  if (!options?.noCookieRefresh) {
    // Refresh session & JWT
    setSessionCookie(SESSION_COOKIE_NAME, token, session.expires_at);
    if (!options?.bypassJwt) {
      const newJwt = await createSessionJWT(session, user);
      setSessionCookie(SESSION_JWT_COOKIE_NAME, newJwt.token, newJwt.expiresAt);
    }
  }
  return { session, user };
}
