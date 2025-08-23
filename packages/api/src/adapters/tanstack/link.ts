import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { router } from "../../router";

const getClientLinkExternal = createIsomorphicFn()
  .client(
    () =>
      new RPCLink({
        url: `${window.location.origin}/api/rpc`,
      }),
  )
  .server(
    () =>
      new RPCLink({
        url: process.env.VITE_API_URL
          ? `${process.env.VITE_API_URL}/rpc`
          : `${process.env.VITE_BASE_URL}/api/rpc`,
        headers: () => getHeaders(),
      }),
  );

// Use this when the oRPC instance is on a separate server, outside TanStack Start.
export const client: RouterClient<typeof router> = createORPCClient(
  getClientLinkExternal(),
);
