import { os } from "@orpc/server";
import {
  RequestHeadersPluginContext,
  ResponseHeadersPluginContext,
} from "@orpc/server/plugins";
import type { SessionUser } from "@repo/auth";
import type { Session } from "@repo/db/schema";
import { requiredAuthMiddleware } from "./lib/auth/middleware";
import type { FetchSessionOptions } from "./lib/auth/utils";

interface ORPCContext extends RequestHeadersPluginContext, ResponseHeadersPluginContext {
  session?: { user: SessionUser; session: Session };
  fetchSessionOptions?: FetchSessionOptions;
}

export const pub = os.$context<ORPCContext>();
export const authed = pub.use(requiredAuthMiddleware);
