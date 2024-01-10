import crypto from "crypto";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import sendVerificationToken from "../utils/nodeMailer/sendVerificationToken.js";
import createTokenUser from "../utils/jwt/createTokenUser.js";

import User from "../models/UserModel.js";
import Token from "../models/TokenModel.js";
import { attachCookiesToResponse } from "../utils/jwt/jwt.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  // check if there is already an account with provided email
  const existingUser = await User.findOne({ email });

  // existing user in the database?
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new BadRequestError("An account already exists with this Email");
    }

    // just set a new verification token for them
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

  // Creating new user
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
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Your email or password is wrong");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Your email or password is wrong");
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email");
  }

  // reusable object with name, id, and role
  const tokenUser = createTokenUser(user);

  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError(
        "You have been restricted to use this web app",
      );
    }

    // To attach in the res.cookie
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.get("user-agent");
  const ip = req.ip;

  const cookFirstTokenForUser = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(cookFirstTokenForUser);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
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
