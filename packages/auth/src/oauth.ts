import { z } from "zod/v4";
import type {
  FetchProviderUserParams,
  FetchProviderUserResponse,
  InitOauthFlowResponse,
} from "./types";

import { fetchDiscordUser, initiateDiscordAuthFlow } from "./providers/discord";
import { fetchGithubUser, initiateGithubAuthFlow } from "./providers/github";
import { fetchGoogleUser, initiateGoogleAuthFlow } from "./providers/google";

type OAuthProviderConfig = Record<
  string,
  {
    initiateFlow: () => InitOauthFlowResponse;
    fetchUser: (params: FetchProviderUserParams) => FetchProviderUserResponse;
  }
>;

// Add new OAuth providers here
export const oauthProviderConfig = {
  discord: {
    initiateFlow: initiateDiscordAuthFlow,
    fetchUser: fetchDiscordUser,
  },
  github: {
    initiateFlow: initiateGithubAuthFlow,
    fetchUser: fetchGithubUser,
  },
  google: {
    initiateFlow: initiateGoogleAuthFlow,
    fetchUser: fetchGoogleUser,
  },
} satisfies OAuthProviderConfig;

export const oauthProviders = z.enum(
  Object.keys(oauthProviderConfig) as [keyof typeof oauthProviderConfig],
);

export type OAuthProvider = keyof typeof oauthProviderConfig;
