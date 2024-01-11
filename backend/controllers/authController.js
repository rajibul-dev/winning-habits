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

  // existing user in the database? If they're verified send descriptive error and don't do anything. If not verified, create a new verification token and replace it in the database with the old one
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new BadRequestError("An account already exists with this Email");
    }

    // just set a new verification token for them and replace it in the database with the old token
    const verificationToken = crypto.randomBytes(40).toString("hex");
    existingUser.verificationToken = verificationToken;
    await existingUser.save();

    // send the token to their email, the token is within a link actually, in the '/verify-email' route we handle that verify link request
    const origin = `http://localhost:5000`;
    await sendVerificationToken({
      name: existingUser.name,
      email: existingUser.email,
      verificationToken,
      origin,
    });

    // let them know with a message in the website
    return res.status(StatusCodes.OK).json({
      msg: "A new verification email has been sent. Please check your email to verify your account.",
    });
  }

  // Creating new user (as they didn't exist already)
  // 1st account is admin by default
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  // create user in the database
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // send verification link in email
  const origin = `http://localhost:5000`;
  await sendVerificationToken({
    user: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  // let them know with a message
  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
  });
}

export async function verifyEmail(req, res) {
  // in the frontend we extract the token and email from the url and send api request with these two values being in the body
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });

  // validate if there is no token at all
  if (!verificationToken) {
    throw new UnauthenticatedError("Verification failed");
  }
  // validate if token doesn't match
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification failed");
  }

  // all good?
  // set isVerified to true and related changes in the database
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

  // let them know with a message
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

  // validate if user with email exists, if not, don't explicitly tell them that for security reasons
  if (!user) {
    throw new BadRequestError("Your email or password is wrong");
  }

  // compare password with this function, it hashes the password and compares with the hashed password in the database
  const isPasswordCorrect = await user.comparePassword(password);

  // validate if password is wrong
  if (!isPasswordCorrect) {
    throw new BadRequestError("Your email or password is wrong");
  }

  // validate if they verified their email
  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email");
  }

  // reusable object with name, id, and role, takes the values from the database
  const tokenUser = createTokenUser(user);

  // get ready to cook a refresh token
  let refreshToken = "";

  // if there is already a refresh token in the database and user is logging in again, we need to use the same token in the cookies
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    // in here we are attatching a banning logic in the token collection
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError(
        "You have been restricted to use this web app",
      );
    }

    // We good, the user is not banned
    // attatch the token to the cookie of the client, so that the authentication middleware can validate it
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  // create new token as the user is logging in for the first time
  // cook all the values for it
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.get("user-agent");
  const ip = req.ip;

  // upload the token object in the database
  const cookFirstTokenForUser = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(cookFirstTokenForUser);

  // attatch the token to the cookie of the client, so that the authentication middleware can validate it
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
