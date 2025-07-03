import { Discord, generateCodeVerifier, generateState } from "arctic";
import type {
  FetchProviderUserParams,
  FetchProviderUserResponse,
  InitOauthFlowResponse,
} from "../types";

const discord = new Discord(
  process.env.SERVER_DISCORD_CLIENT_ID as string,
  process.env.SERVER_DISCORD_CLIENT_SECRET as string,
  process.env.SERVER_DISCORD_REDIRECT_URI ||
    `${process.env.VITE_BASE_URL}/api/auth/callback/discord`,
);

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  avatar?: string;
  email: string;
  verified: boolean;
}

export function initiateDiscordAuthFlow(): InitOauthFlowResponse {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = discord.createAuthorizationURL(state, codeVerifier, ["identify", "email"]);

  return { state, codeVerifier, url };
}

export async function fetchDiscordUser(
  params: FetchProviderUserParams,
): FetchProviderUserResponse {
  if (!params.codeVerifier) {
    throw new Error("Invalid code verifier");
  }

  const tokens = await discord.validateAuthorizationCode(
    params.code,
    params.codeVerifier,
  );
  const discordUserResponse = await fetch("https://discord.com/api/v10/users/@me", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const providerUser: DiscordUser = await discordUserResponse.json();

  return {
    provider_user_id: providerUser.id,
    email: providerUser.email,
    name: providerUser.global_name || providerUser.username,
    avatar_url: providerUser.avatar
      ? `https://cdn.discordapp.com/avatars/${providerUser.id}/${providerUser.avatar}.png`
      : undefined,
  };
}
