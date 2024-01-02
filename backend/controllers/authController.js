import crypto from "crypto";
import { StatusCodes } from "http-status-codes";

import User from "../models/UserModel.js";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import sendVerificationToken from "../utils/nodeMailer/sendVerificationToken.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  // check if there is already an account with provided email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new BadRequestError("An account already exists with this Email");
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");

    existingUser.verificationToken = verificationToken;
    await existingUser.save();

    const origin = `http://localhost:5000`;

    await sendVerificationToken({
      name: existingUser.name,
      email: existingUser.email,
      verificationToken,
      origin,
    });

    return res.status(StatusCodes.OK).json({
      msg: "A new verification email has been sent. Please check your email to verify your account.",
    });
  }

  // 1st registration is admin by default
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  console.log(name);

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = `http://localhost:5000`;

  await sendVerificationToken({
    user: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
  });
}

export async function verifyEmail(req, res) {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });

  if (!verificationToken) {
    throw new UnauthenticatedError("Verification failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email verified" });
}

export async function requestNewVerificationEmail(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("No user found with this email");
  }

  // Generate a new verification token
  const verificationToken = crypto.randomBytes(40).toString("hex");

  // Associate the new token with the user
  user.verificationToken = verificationToken;
  await user.save();

  // Send the new verification email
  const origin = `http://localhost:5000`;

  await sendVerificationToken({
    user: user.name,
    email: user.email,
    verificationToken,
    origin,
  });

  res.status(StatusCodes.OK).json({
    msg: "New verification email sent. Please check your email to verify your account.",
  });
}

export async function login(req, res) {
  res.send("Logged in successfully");
}

export async function logout(req, res) {
  res.send("Logged out successfully");
}

export async function forgotPassword(req, res) {
  res.send("Forgot password");
}

export async function resetPassword(req, res) {
  res.send("Password reset successfull");
}

export async function changePassword(req, res) {
  res.send("Password changed successfully");
}
