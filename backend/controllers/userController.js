import { StatusCodes } from "http-status-codes";
import cloudinaryPackage from "cloudinary";
const cloudinary = cloudinaryPackage.v2;
import fs from "fs";
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

export async function updateAvatar(req, res) {
  const user = await User.findOne({ _id: req.user.userID });

  if (!req.files) {
    throw new BadRequestError("No file selected");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image");
  }
  const maxSize = 1024 * 1024 * 10;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload an image smaller than 10MB");
  }

  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: `winning-habits-app/pfps/${req.user.userID}`,
    },
  );
  fs.unlinkSync(req.files.image.tempFilePath);

  if (!result.secure_url) {
    throw new BadRequestError("Failed to upload the image");
  }

  user.avatar = result.secure_url;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ image: result.secure_url, msg: "Successfully uploaded the image" });
}
