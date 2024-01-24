import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import createTokenUser from "../utils/jwt/createTokenUser.js";
import { attachCookiesToResponse } from "../utils/jwt/jwt.js";

export async function getAllUsers(req, res) {
  const users = await User.find().select("-password");
  res.status(StatusCodes.OK).json({ users, count: users.length });
}

export async function getSingleUser(req, res) {
  let user;
  try {
    user = await User.findOne({ _id: req.params.id }).select("-password");
  } catch (error) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }

  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
}

export async function showMe(req, res) {
  res.status(StatusCodes.OK).json({ user: req.user });
}

export async function updateUser(req, res) {
  const { name } = req.body;

  if (!name) {
    throw new BadRequestError("Please provide the relevant values");
  }

  const user = await User.findOne({ _id: req.user.userID });

  user.name = name;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
}
