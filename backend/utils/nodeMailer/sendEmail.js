import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailerConfig.js";

export default async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: `"Winning Habit" <winninghabitapp@gmail.com>`,
    to,
    subject,
    html,
  });
}
