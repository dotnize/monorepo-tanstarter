import { createServerFn } from "@tanstack/react-start";
import { getAuthSession } from "./utils";

export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
  console.log("--------- CALLING");
  const { user } = await getAuthSession();

  return user;
});
