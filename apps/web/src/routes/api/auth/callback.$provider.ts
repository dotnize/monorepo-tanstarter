import { createServerFileRoute, getCookie } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";

import { createSession, SESSION_COOKIE_NAME } from "@repo/auth";
import { oauthProviderConfig, oauthProviders } from "@repo/auth/oauth";
import { OAuth2RequestError } from "@repo/auth/types";
import { setSessionCookie } from "@repo/auth/utils/tanstack";

import { db } from "@repo/db";
import * as schema from "@repo/db/schema";

export const ServerRoute = createServerFileRoute("/api/auth/callback/$provider").methods({
  GET: async ({ request, params }) => {
    const providerResult = oauthProviders.safeParse(params.provider);
    if (!providerResult.success) {
      return new Response("Invalid provider", {
        status: 400,
      });
    }
    const provider = providerResult.data;

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const storedState = getCookie(`${provider}_oauth_state`);
    const storedCodeVerifier = getCookie(`${provider}_code_verifier`);

    if (!code || !state || !storedState || state !== storedState) {
      return new Response(null, {
        status: 400,
      });
    }

    try {
      const { provider_user_id, ...providerUser } = await oauthProviderConfig[
        provider
      ].fetchUser({
        code,
        codeVerifier: storedCodeVerifier,
      });

      const existingUser = await db.query.oauthAccount.findFirst({
        where: and(
          eq(schema.oauthAccount.provider_id, provider),
          eq(schema.oauthAccount.provider_user_id, provider_user_id),
        ),
      });

      if (existingUser) {
        const { session, token } = await createSession(existingUser.user_id);
        setSessionCookie(SESSION_COOKIE_NAME, token, session.expires_at);
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
          },
        });
      } else {
        const existingUserEmail = await db.query.user.findFirst({
          where: eq(schema.user.email, providerUser.email),
        });
        if (existingUserEmail) {
          await db.insert(schema.oauthAccount).values({
            provider_id: provider,
            provider_user_id: provider_user_id,
            user_id: existingUserEmail.id,
          });
          const { session, token } = await createSession(existingUserEmail.id);
          setSessionCookie(SESSION_COOKIE_NAME, token, session.expires_at);
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
            },
          });
        }
      }

      const userId = await db.transaction(async (tx) => {
        const [{ newId }] = await tx
          .insert(schema.user)
          .values(providerUser)
          .returning({ newId: schema.user.id });
        await tx.insert(schema.oauthAccount).values({
          provider_id: provider,
          provider_user_id: provider_user_id,
          user_id: newId,
        });
        return newId;
      });

      const { session, token } = await createSession(userId);
      setSessionCookie(SESSION_COOKIE_NAME, token, session.expires_at);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    } catch (e) {
      console.log(e);
      if (e instanceof OAuth2RequestError) {
        return new Response(null, {
          status: 400,
        });
      }
      return new Response(null, {
        status: 500,
      });
    }
  },
});
