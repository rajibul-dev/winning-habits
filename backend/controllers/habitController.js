import { StatusCodes } from "http-status-codes";
import Habit from "../models/HabitModel.js";
import { BadRequestError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";

export async function createHabit(req, res) {
  req.body.user = req.user.userID;
  const habit = await Habit.create(req.body);
  res.status(StatusCodes.CREATED).json({ habit });
}

export async function getAllHabits(req, res) {
  const habits = await Habit.find().populate({
    path: "user",
    select: "name email",
  });
  res.status(StatusCodes.OK).json({ habits, count: habits.length });
}

export async function getUserHabits(req, res) {
  const userHabits = await Habit.find({ user: req.user.userID });
  res.status(StatusCodes.OK).json({ userHabits, count: userHabits.length });
}

export async function getSingleHabit(req, res) {
  const { id: habitID } = req.params;

  let habit;
  try {
    habit = await Habit.findOne({ _id: habitID });
  } catch (error) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }

  checkPermissions(req.user, habit.user);
  res.status(StatusCodes.OK).json({ habit });
}

export async function updateSingleHabit(req, res) {
  const { id: habitID } = req.params;
  const { name } = req.body;

  let habit;
  try {
    habit = await Habit.findOne({ _id: habitID });
  } catch (error) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }

  checkPermissions(req.user, habit.user);

  habit.name = name;
  await habit.save();

  res.status(StatusCodes.OK).json({ habit });
}

export async function deleteHabit(req, res) {
  const { id: habitID } = req.params;

  let habit;
  try {
    habit = await Habit.findOne({ _id: habitID });
  } catch (error) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }

  checkPermissions(req.user, habit.user);

  await habit.deleteOne();
  res.status(StatusCodes.OK).json({ msg: `Habit removed successfully!` });
}

export async function addDailyAction(req, res) {
  const { id: habitID } = req.params;
  const { answer } = req.body;

  let habit;
  try {
    habit = await Habit.findOne({ _id: habitID });
  } catch (error) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }

  checkPermissions(req.user, habit.user);

  let latestRecord;
  if (habit.dailyRecords.length === 0) {
    const newRecord = {
      didIt: answer,
      points: 1,
      date: Date.now(),
    };

    habit.dailyRecords.push(newRecord);
    await habit.save();

    latestRecord = habit.dailyRecords[0];
  } else {
    latestRecord = habit.dailyRecords[habit.dailyRecords.length - 1];
    latestRecord.didIt = answer;
    await habit.save();
  }

  res.status(StatusCodes.OK).json({
    name: habit.name,
    habitID: habit._id,
    latestRecord,
    totalPoints: habit.totalPoints,
    streak: habit.streak,
  });
}

export async function updateDailyAction(req, res) {
  const { id: habitID } = req.params;
  const { targetRecordID, updatedAnswer } = req.body;

  let habit;
  try {
    habit = await Habit.findOne({ _id: habitID });
  } catch (error) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }

  checkPermissions(req.user, habit.user);

  let targetRecord;
  try {
    targetRecord = habit.dailyRecords.find(
      (record) => record._id.toString() === targetRecordID,
    );
  } catch (error) {
    throw new BadRequestError(`No record with id: ${targetRecordID}`);
  }

  const targetRecordPrevPoint = targetRecord.points;
  targetRecord.didIt = updatedAnswer;
  await habit.save();

  if (updatedAnswer === "no") {
    habit.totalPoints -= targetRecordPrevPoint;
    await habit.save();
  }

  res.status(StatusCodes.OK).json({
    name: habit.name,
    habitID: habit._id,
    targetRecord,
    totalPoints: habit.totalPoints,
    streak: habit.streak,
  });
}

export async function resetHabitProgress(req, res) {
  const { id: habitID } = req.params;

  let habit;
  try {
    habit = await Habit.findOne({ _id: habitID });
  } catch (error) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }

  checkPermissions(req.user, habit.user);

  habit.totalPoints = 0;
  habit.streak = 0;
  habit.dailyRecords = [];
  await habit.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Habit progress reset successfull!", habit });
}
