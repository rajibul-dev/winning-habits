import { StatusCodes } from "http-status-codes";
import cloudinaryPackage from "cloudinary";
const cloudinary = cloudinaryPackage.v2;
import fs from "fs";
import User, { defaultImageURL } from "../models/UserModel.js";
import Token from "../models/TokenModel.js";
import Habit from "../models/HabitModel.js";
import Achievement from "../models/AchievementModel.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import createTokenUser from "../utils/jwt/createTokenUser.js";
import {
  attachCookiesToResponse,
  clearCookiesFromResponse,
} from "../utils/jwt/jwt.js";

const PROFILE_HABIT_MOMENTUM_THRESHOLD = 30;

function getManagedAvatarPublicId(imageURL) {
  if (!imageURL || imageURL === defaultImageURL) return null;
  if (imageURL.includes("googleusercontent")) return null;
  if (!imageURL.includes("/winning-habits-app/")) return null;

  const parts = imageURL.split("/winning-habits-app/");
  const filename = `winning-habits-app/${parts[parts.length - 1]}`;

  return filename.substring(0, filename.lastIndexOf("."));
}

async function deleteManagedAvatar(imageURL) {
  const publicId = getManagedAvatarPublicId(imageURL);

  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
}

async function deleteUserAccount(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }

  try {
    await deleteManagedAvatar(user.avatar);
  } catch (error) {
    console.error("Failed to delete the user's avatar from cloudinary:", error);
  }

  await Promise.all([
    Achievement.deleteMany({ user: user._id }),
    Habit.deleteMany({ user: user._id }),
    Token.deleteMany({ user: user._id }),
    user.deleteOne(),
  ]);

  return user;
}

export async function getAllUsers(req, res) {
  // const users = await User.find().select("-password");
  const users = await User.aggregate([
    {
      $lookup: {
        from: "habits",
        localField: "_id",
        foreignField: "user",
        as: "habits",
      },
    },
    {
      $addFields: {
        lastActivity: {
          $max: "$habits.updatedAt",
        },
      },
    },
    {
      $sort: { lastActivity: -1 },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ users, count: users.length });
}

export async function getUserCount(req, res) {
  const userCount = await User.countDocuments();
  res.status(StatusCodes.OK).json({ count: userCount });
}

export async function getUserById(req, res) {
  let user;
  try {
    user = await User.findOne({ _id: req.params.id }).select("-password");
  } catch (error) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }

  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ user });
}

export async function getCurrentUser(req, res) {
  res.status(StatusCodes.OK).json({ user: req.user });
}

export async function updateCurrentUser(req, res) {
  const normalizedName = req.body.name?.trim();

  if (!normalizedName) {
    throw new BadRequestError("Please provide the relevant values");
  }

  const user = await User.findOne({ _id: req.user.userID });

  user.name = normalizedName;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
}

export async function updateCurrentUserAvatar(req, res) {
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

  await deleteManagedAvatar(user.avatar);

  user.avatar = result.secure_url;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    image: result.secure_url,
    msg: "Successfully uploaded the image",
  });
}

export async function deleteCurrentUserAvatar(req, res) {
  const user = await User.findOne({ _id: req.user.userID });

  if (user.avatar === defaultImageURL) {
    throw new BadRequestError(`There is no image to begin with`);
  }

  await deleteManagedAvatar(user.avatar);

  user.avatar = defaultImageURL;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    msg: "Successfully removed the image",
  });
}

export async function deleteCurrentUser(req, res) {
  await deleteUserAccount(req.user.userID);
  clearCookiesFromResponse(res);

  res.status(StatusCodes.OK).json({ msg: "Account deleted successfully" });
}

export async function deleteUserById(req, res) {
  await deleteUserAccount(req.params.id);

  if (req.user.userID === req.params.id) {
    clearCookiesFromResponse(res);
  }

  await Habit.deleteMany({ user: req.params.id });
  await Achievement.deleteMany({ user: req.params.id });
  await Token.deleteMany({ user: req.params.id });

  res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
}

export async function getUserHabits(req, res) {
  const userID = req.params.id;
  const habits = await Habit.find({ user: userID });
  const profileHabits = habits.map((habit) => ({
    ...habit.toObject(),
    isProfileStrong: habit.totalPoints >= PROFILE_HABIT_MOMENTUM_THRESHOLD,
  }));

  res.status(StatusCodes.OK).json({
    habits: profileHabits,
    userHabits: profileHabits,
    count: profileHabits.length,
    profileStrongThreshold: PROFILE_HABIT_MOMENTUM_THRESHOLD,
  });
}

export async function getUserHabitCount(req, res) {
  const userID = req.params.id;
  const habitCount = await Habit.countDocuments({ user: userID });
  const seriousAboutCount = await Habit.countDocuments({
    user: userID,
    totalPoints: { $gte: PROFILE_HABIT_MOMENTUM_THRESHOLD },
  });
  const masteredCount = await Achievement.countDocuments({ user: userID });

  res.status(StatusCodes.OK).json({
    count: habitCount,
    seriousAboutCount,
    achievedCount: masteredCount,
    profileStrongThreshold: PROFILE_HABIT_MOMENTUM_THRESHOLD,
  });
}
