export interface InitOauthFlowResponse {
  state: string;
  codeVerifier?: string;
  url: URL;
}

export interface FetchProviderUserParams {
  code: string;
  codeVerifier?: string;
}

export type FetchProviderUserResponse = Promise<{
  provider_user_id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}>;

export { OAuth2RequestError } from "arctic";
