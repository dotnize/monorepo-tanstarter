import { ORPCError } from "@orpc/server";
import { pub } from "../base";
import { getAuthSession } from "../utils/auth";

export const getUser = pub.handler(async ({ context }) => {
  if (!context.reqHeaders || !context.resHeaders) {
    // TODO
    console.log("MISSING HEADERS --------------");
    console.log("reqHeaders:", !!context.reqHeaders);
    console.log("resHeaders:", !!context.resHeaders);
    throw new ORPCError("BAD_REQUEST");
  }

  const session =
    context.session ??
    (await getAuthSession(
      { reqHeaders: context.reqHeaders, resHeaders: context.resHeaders },
      context.fetchSessionOptions,
    ));

  return session.user;
});
