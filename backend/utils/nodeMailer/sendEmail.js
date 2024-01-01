import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailerConfig.js";

export default async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: `Rajibul Islam`,
    to,
    subject,
    html,
  });
}
