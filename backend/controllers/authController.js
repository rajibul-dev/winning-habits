import crypto from "crypto";
import { StatusCodes } from "http-status-codes";

import User from "../models/UserModel.js";
import { BadRequestError } from "../errors/index.js";
import sendVerificationToken from "../utils/nodeMailer/sendVerificationToken.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  // check if there is already an account with provided email
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new BadRequestError("An account already extst with this Email");
  }

  // 1st registration is admin by default
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

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
  res.send("Verified email");
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
