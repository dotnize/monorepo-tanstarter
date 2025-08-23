import { ORPCError } from "@orpc/server";
import { pub } from "../base";

import { getAuthSession } from "@repo/auth/tanstack/utils";
// import { getAuthSession } from "../lib/auth/utils";

export const getUser = pub.handler(async ({ context }) => {
  if (!context.reqHeaders) {
    throw new ORPCError("BAD_REQUEST");
  }

  const session =
    context.session ??
    (await getAuthSession(
      // uncomment if using framework-agnostic utils
      // { reqHeaders: context.reqHeaders, resHeaders: context.resHeaders ?? null },
      context.fetchSessionOptions,
    ));

  return session.user;
});
