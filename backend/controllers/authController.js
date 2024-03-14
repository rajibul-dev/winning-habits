import crypto from "crypto";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import sendVerificationToken from "../utils/nodeMailer/sendVerificationToken.js";
import createTokenUser from "../utils/jwt/createTokenUser.js";

import User from "../models/UserModel.js";
import Token from "../models/TokenModel.js";
import { attachCookiesToResponse } from "../utils/jwt/jwt.js";
import sendPasswordResetLink from "../utils/nodeMailer/sendPasswordResetLink.js";
import createHash from "../utils/createHash.js";

const origin = process.env.FRONTEND_ORIGIN;

export async function register(req, res) {
  const { name, email, password } = req.body;

  // check if there is already an account with provided email
  const existingUser = await User.findOne({ email });

  // existing user in the database? If they're verified send descriptive error and don't do anything. If not verified, create a new verification token and replace it in the database with the old one
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new BadRequestError("An account already exists with this Email");
    }

    // just set a new verification token for them and replace it in the database with the old token. Edit: modify with the new name and password, and reiterate role
    const verificationToken = crypto.randomBytes(40).toString("hex");
    existingUser.verificationToken = verificationToken;
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";
    existingUser.role = role;
    existingUser.name = name;
    existingUser.password = password;
    await existingUser.save();

    // send the token to their email, the token is within a link actually, in the '/verify-email' route we handle that verify link request
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

  // if already verified
  if (user.isVerified) {
    throw new BadRequestError("User is already verified! Please Login!");
  }

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

  // upload the token object in the database
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.get("user-agent");
  const ip = req.ip;
  const cookFirstTokenForUser = {
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  };
  await Token.create(cookFirstTokenForUser);

  // Automatic login
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({
    msg: `Successfully verified your email: ${email}`,
    user: tokenUser, // Optionally return the user data
  });
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
  await Token.findOneAndDelete({ user: req.user.userID });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "You logged out" });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide a valid email");
  }

  const user = await User.findOne({ email });

  // We will be sneaky and not even let know the potential hecker (not hacker 😅) that there was no such account with the provided email

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    // send password reset link on email
    await sendPasswordResetLink({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    // add to the database the resetToken and expiry date
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    // reset token should be hashed
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: `Please check your email for reseting the password` });
}

export async function resetPassword(req, res) {
  const { email, token, password } = req.body;

  if (!token || !email || !password) {
    throw new BadRequestError("Credentials missing");
  }

  const user = await User.findOne({ email });

  if (user) {
    // we will need this to validate the password toekn validity
    const currentDate = new Date(Date.now());

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    } else {
      throw new BadRequestError(`This password reset link has expired`);
    }
  }

  // again, we are being sneaky here
  res.status(StatusCodes.OK).json({ msg: "Password reset successfully" });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findOne({ user: req.user.userID });

  // compare currentPassword
  const currentPasswordCurrect = await user.comparePassword(currentPassword);

  if (!currentPasswordCurrect) {
    throw new BadRequestError("The provided current password does not match");
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Changed password successfully" });
}

export async function google(req, res) {
  const { name, email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    // create their account
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    user = await User.create({
      name,
      email,
      role,
      password: generatedPassword,
      isVerified: true,
    });

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.get("user-agent");
    const ip = req.ip;

    // upload the token object in the database
    const cookFirstTokenForUser = {
      refreshToken,
      ip,
      userAgent,
      user: user._id,
    };
    await Token.create(cookFirstTokenForUser);

    // Log them in
    const tokenUser = createTokenUser(user); // Use your existing function
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({
      msg: `Logged in successfully with ${email}`,
      user: tokenUser,
    });
  } else {
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
    const cookFirstTokenForUser = {
      refreshToken,
      ip,
      userAgent,
      user: user._id,
    };
    await Token.create(cookFirstTokenForUser);

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({
      msg: `Logged in successfully with ${email}`,
      user: tokenUser,
    });
  }
}
