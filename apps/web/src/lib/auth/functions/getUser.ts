import { createServerFn } from "@tanstack/react-start";
import { getAuthSession } from "~/lib/auth/utils";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const { user } = await getAuthSession();

  return user;
});
