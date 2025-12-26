import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.SERVER_POLAR_ACCESS_TOKEN,
  server: (process.env.SERVER_POLAR_MODE as never) || "sandbox",
});
