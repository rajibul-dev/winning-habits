import { StatusCodes } from "http-status-codes";
import Achievement from "../models/AchievementModel.js";
import BadRequestError from "../errors/badRequestError.js";

export async function getMyAchievements(req, res) {
  const { userID } = req.user;
  const achievements = await Achievement.find({ user: userID }).populate({
    path: "habit",
    select: "name totalPoints",
  });
  res.status(StatusCodes.OK).json({ achievements, count: achievements.length });
}

export async function getUserAchievements(req, res) {
  const { id: userID } = req.params;

  let achievements;
  try {
    achievements = await Achievement.find({ user: userID })
      .populate({
        path: "habit",
        select: "name totalPoints",
      })
      .populate({
        path: "user",
        select: "name",
      });
  } catch (error) {
    throw new BadRequestError(`No user with id: ${userID}`);
  }

  res.status(StatusCodes.OK).json({ achievements, count: achievements.length });
}
