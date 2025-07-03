import { generateState, GitHub } from "arctic";
import type {
  FetchProviderUserParams,
  FetchProviderUserResponse,
  InitOauthFlowResponse,
} from "../types";

const github = new GitHub(
  process.env.SERVER_GITHUB_CLIENT_ID as string,
  process.env.SERVER_GITHUB_CLIENT_SECRET as string,
  process.env.SERVER_GITHUB_REDIRECT_URI ||
    `${process.env.VITE_BASE_URL}/api/auth/callback/github`,
);

interface GitHubUser {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string;
  location: string | null;
  login: string;
}

export function initiateGithubAuthFlow(): InitOauthFlowResponse {
  const state = generateState();

  const url = github.createAuthorizationURL(state, ["user:email"]);

  return { state, url };
}

export async function fetchGithubUser(
  params: FetchProviderUserParams,
): FetchProviderUserResponse {
  const tokens = await github.validateAuthorizationCode(params.code);
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const providerUser: GitHubUser = await githubUserResponse.json();

  return {
    provider_user_id: providerUser.id,
    email: providerUser.email,
    name: providerUser.name || providerUser.login,
    avatar_url: providerUser.avatar_url,
  };
}
