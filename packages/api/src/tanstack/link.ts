import { RPCLink } from "@orpc/client/fetch";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

export const getClientLink = createIsomorphicFn()
  .client(
    () =>
      new RPCLink({
        url: `${window.location.origin}/api/rpc`,
      }),
  )
  .server(
    () =>
      new RPCLink({
        url: `${process.env.VITE_BASE_URL}/api/rpc`,
        headers: () => getHeaders(),
      }),
  );
