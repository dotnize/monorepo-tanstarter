import { Resend } from "resend";

export const resend = new Resend(process.env.SERVER_RESEND_TOKEN);
