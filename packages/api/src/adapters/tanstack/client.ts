import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { router } from "../../router";

const getORPCClient = createIsomorphicFn()
  .server(() => {
    return createRouterClient(router, {
      /**
       * Provide initial context if needed.
       *
       * Because this client instance is shared across all requests,
       * only include context that's safe to reuse globally.
       * For per-request context, use middleware context or pass a function as the initial context.
       */
      context: async () => {
        const request = getWebRequest();
        return {
          reqHeaders: request.headers,
          // resHeaders: // TODO if possible, this is to allow us to set cookies on SSR
        };
      },
    });
  })
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
    });

    console.log("clieeent-sideeeeeeeeeeeeeee");

    return createORPCClient(link);
  });

export const client: RouterClient<typeof router> = getORPCClient();
