import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";
import { base64url, EncryptJWT, jwtDecrypt } from "jose";

import { db } from "@repo/db";
import type { Session } from "@repo/db/schema";
import { session as sessionTable, user as userTable } from "@repo/db/schema";

export const SESSION_COOKIE_NAME = "session";
export const SESSION_JWT_COOKIE_NAME = "session_jwt";
const jwtSecret = base64url.decode(process.env.SERVER_JWT_SECRET!);

function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(
  userId: string,
  token = generateSessionToken(),
): Promise<{ session: Session; token: string }> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    user_id: userId,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days expiration
  };
  await db.insert(sessionTable).values(session);
  return { session, token };
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({
      user: {
        // Only return the necessary user data for the client
        id: userTable.id,
        name: userTable.name,
        first_name: userTable.first_name,
        last_name: userTable.last_name,
        avatar_url: userTable.avatar_url,
        email: userTable.email,
        setup_at: userTable.setup_at,
      },
      session: sessionTable,
    })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.user_id, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expires_at.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({
        expires_at: session.expires_at,
      })
      .where(eq(sessionTable.id, session.id));
  }

  return { session, user };
}

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof validateSessionToken>>["user"]
>;

export async function validateSessionJWT(jwt: string) {
  try {
    const { payload } = await jwtDecrypt<{ session: Session; user: SessionUser }>(
      jwt,
      jwtSecret,
    );
    const { session, user } = payload;
    if (!session || !user) {
      return { session: null, user: null };
    }

    const sessionExpiresAt =
      typeof session.expires_at === "string"
        ? new Date(session.expires_at)
        : session.expires_at;

    if (!sessionExpiresAt || Date.now() >= sessionExpiresAt.getTime()) {
      return { session: null, user: null };
    }

    // Serialize session expiry date
    const serializedSession = {
      ...session,
      expires_at: sessionExpiresAt,
    };
    return { session: serializedSession, user };
  } catch {
    return { session: null, user: null };
  }
}

export async function createSessionJWT(
  session: Session,
  user: SessionUser,
): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
  const token = await new EncryptJWT({ session, user })
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .encrypt(jwtSecret);

  return { token, expiresAt };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}
export async function invalidateAllSessions(userId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.user_id, userId));
}
