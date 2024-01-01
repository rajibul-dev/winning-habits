import sendEmail from "./sendEmail.js";

export default async function sendVerificationToken({
  name,
  email,
  verificationToken,
  origin,
}) {
  const verifyEmailLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>Hello ${name}, please confirm your email by clicking on the following link: <a href="${verifyEmailLink}">Verify Email</a></p>`;

  sendEmail({
    to: email,
    subject: `Email Verification`,
    html: `<h1>Winning Habit account confirmation</h1>
    ${message}`,
  });
}
