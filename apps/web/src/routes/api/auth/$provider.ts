import {
  createServerFileRoute,
  setCookie,
  setHeader,
} from "@tanstack/react-start/server";

import { oauthProviderConfig, oauthProviders } from "@repo/auth/oauth";

export const ServerRoute = createServerFileRoute("/api/auth/$provider").methods({
  GET: ({ params }) => {
    const providerResult = oauthProviders.safeParse(params.provider);
    if (!providerResult.success) {
      return new Response("Invalid provider", {
        status: 400,
      });
    }
    const provider = providerResult.data;

    const { state, codeVerifier, url } = oauthProviderConfig[provider].initiateFlow();

    setCookie(`${provider}_oauth_state`, state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });
    if (codeVerifier) {
      setCookie(`${provider}_code_verifier`, codeVerifier, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      });
    }

    setHeader("Location", url.toString());

    return new Response(null, {
      status: 302,
    });
  },
});
