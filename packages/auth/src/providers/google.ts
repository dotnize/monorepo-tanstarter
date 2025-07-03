import { generateCodeVerifier, generateState, Google } from "arctic";
import type {
  FetchProviderUserParams,
  FetchProviderUserResponse,
  InitOauthFlowResponse,
} from "../types";

const google = new Google(
  process.env.SERVER_GOOGLE_CLIENT_ID as string,
  process.env.SERVER_GOOGLE_CLIENT_SECRET as string,
  process.env.SERVER_GOOGLE_REDIRECT_URI ||
    `${process.env.VITE_BASE_URL}/api/auth/callback/google`,
);

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
  email_verified: boolean;
  locale: string;
}

export function initiateGoogleAuthFlow(): InitOauthFlowResponse {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  return { state, codeVerifier, url };
}

export async function fetchGoogleUser(
  params: FetchProviderUserParams,
): FetchProviderUserResponse {
  if (!params.codeVerifier) {
    throw new Error("Invalid code verifier");
  }

  const tokens = await google.validateAuthorizationCode(params.code, params.codeVerifier);
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const providerUser: GoogleUser = await response.json();

  return {
    provider_user_id: providerUser.sub,
    email: providerUser.email,
    name: providerUser.name,
    first_name: providerUser.given_name,
    last_name: providerUser.family_name,
    avatar_url: providerUser.picture,
  };
}
