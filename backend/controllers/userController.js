import { StatusCodes } from "http-status-codes";
import cloudinaryPackage from "cloudinary";
const cloudinary = cloudinaryPackage.v2;
import fs from "fs";
import User, { defaultImageURL } from "../models/UserModel.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import createTokenUser from "../utils/jwt/createTokenUser.js";
import { attachCookiesToResponse } from "../utils/jwt/jwt.js";

export async function getAllUsers(req, res) {
  const users = await User.find().select("-password");
  res.status(StatusCodes.OK).json({ users, count: users.length });
}

export async function getAllUsersLength(req, res) {
  const userCount = await User.countDocuments();
  res.status(StatusCodes.OK).json({ count: userCount });
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
  const existingImageURL = user.avatar || null;
  const isThatDefaultImage = existingImageURL === defaultImageURL;

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
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);

  if (!result.secure_url) {
    throw new BadRequestError("Failed to upload the image");
  }

  if (!isThatDefaultImage && existingImageURL) {
    const parts = existingImageURL.split("/winning-habits-app/");
    const filename = `winning-habits-app/${parts[parts.length - 1]}`;
    const filenameWithoutExtension = filename.substring(
      0,
      filename.lastIndexOf(".")
    );
    await cloudinary.uploader.destroy(filenameWithoutExtension);
  }

  user.avatar = result.secure_url;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    image: result.secure_url,
    msg: "Successfully uploaded the image",
  });
}

export async function removeAvatar(req, res) {
  const user = await User.findOne({ _id: req.user.userID });
  const existingImageURL = user.avatar || null;

  if (existingImageURL === defaultImageURL) {
    throw new BadRequestError(`There is no image to begin with`);
  }

  if (existingImageURL) {
    const parts = existingImageURL.split("/winning-habits-app/");
    const filename = `winning-habits-app/${parts[parts.length - 1]}`;
    const filenameWithoutExtension = filename.substring(
      0,
      filename.lastIndexOf(".")
    );
    await cloudinary.uploader.destroy(filenameWithoutExtension);
  }

  user.avatar = defaultImageURL;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    msg: "Successfully removed the image",
  });
}
