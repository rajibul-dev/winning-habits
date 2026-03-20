import { Resend } from "resend";
import { config } from "dotenv";

config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({
  to,
  subject,
  html,
  from = `"Winning Habits" <message@winninghabits.app>`,
}) {
  await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}
