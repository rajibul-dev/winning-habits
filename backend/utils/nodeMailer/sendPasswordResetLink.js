import sendEmail from "./sendEmail.js";

export default async function sendPasswordResetLink({
  origin,
  token,
  email,
  name,
}) {
  const passwordResetLink = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `Reset your password by clicking on the following link:\n<a href="${passwordResetLink}">${passwordResetLink}</a>`;

  return sendEmail({
    to: email,
    subject: `Reset Password`,
    html: `<h2>Hello ${name}</h2>\n${message}`,
  });
}
