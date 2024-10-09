import { StatusCodes } from "http-status-codes";
import Habit from "../models/HabitModel.js";
import { BadRequestError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import { addDays, isAfter, isToday } from "date-fns";

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
  const { showArchived } = req.query;
  const query = { user: req.user.userID };

  if (showArchived === "true" || showArchived === "false") {
    query.isArchived = showArchived === "true" ? true : false;
  }

  const userHabits = await Habit.find(query);
  res.status(StatusCodes.OK).json({ userHabits, count: userHabits.length });
}

export async function getSingleHabit(req, res) {
  const { id: habitID } = req.params;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);
  res.status(StatusCodes.OK).json({ habit });
}

export async function updateSingleHabit(req, res) {
  const { id: habitID } = req.params;
  const { name } = req.body;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  habit.name = name;
  await habit.save();

  res.status(StatusCodes.OK).json({ habit });
}

export async function deleteHabit(req, res) {
  const { id: habitID } = req.params;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  await habit.deleteOne();
  res.status(StatusCodes.OK).json({ msg: `Habit removed successfully!` });
}

async function habitRecordLogicSortAndCalculateAndSave(habit) {
  await habit.sortDailyActionsArray(habit.dailyRecords);
  const { streak, totalPoints } = await habit.calculateStreakAndPoints(habit);
  habit.streak = streak;
  habit.totalPoints = totalPoints;
  await habit.save();
}

export async function addDailyAction(req, res) {
  const { id: habitID } = req.params;
  const { answer } = req.body;

  const habit = await getHabitById(habitID);

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
    if (latestRecord.didIt !== "unanswered") {
      throw new BadRequestError(`You already answered ${latestRecord.didIt}`);
    }
    latestRecord.didIt = answer;
    await habit.save();
  }

  await habitRecordLogicSortAndCalculateAndSave(habit);

  res.status(StatusCodes.OK).json({
    name: habit.name,
    habitID: habit._id,
    latestRecord,
    totalPoints: habit.totalPoints,
    streak: habit.streak,
  });
}

export async function updateCustomDateAction(req, res) {
  const { id: habitID } = req.params;
  const { targetRecordID, updatedAnswer } = req.body;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  let targetRecord;
  let targetRecordIndex;
  try {
    targetRecord = habit.dailyRecords.find(
      (record) => record._id.toString() === targetRecordID
    );
    targetRecordIndex = habit.dailyRecords.findIndex(
      (record) => record._id.toString() === targetRecordID
    );
  } catch (error) {
    throw new BadRequestError(`No record with id: ${targetRecordID}`);
  }
  const prequelToTargetRecord = habit.dailyRecords[targetRecordIndex - 1];

  habit.isCustomRecordUpdate = true;
  targetRecord.didIt = updatedAnswer;
  switch (targetRecord.didIt) {
    case "yes":
      targetRecord.points = (prequelToTargetRecord?.points ?? 0) + 1;
      break;
    case "no":
      targetRecord.points = 0;
      break;
    case "unanswered":
      targetRecord.points = 0;
      break;

    default:
      throw new BadRequestError(
        `"${targetRecord.didIt}" is an unsupported answer`
      );
  }

  await habitRecordLogicSortAndCalculateAndSave(habit);

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

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  habit.totalPoints = 0;
  habit.streak = 0;
  habit.dailyRecords = [];
  await habit.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Habit progress reset successfull!", habit });
}

export async function handleArchive(req, res) {
  const { id: habitID } = req.params;
  const { isArchive } = req.body;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  habit.isArchived = isArchive;
  await habit.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: `Successfully set archive to ${isArchive}`, habit });
}

// helpers
async function getHabitById(habitID) {
  let habit;

  try {
    habit = await Habit.findOne({ _id: habitID });
  } catch (error) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }
  if (!habit) {
    throw new BadRequestError(`No habit with id: ${habitID}`);
  }

  return habit;
}

export async function habitSchemaManager(req, res) {
  // Check if the API key is present and correct
  const apiKey = req.headers["x-api-key"];
  const MY_API_KEY = process.env.MY_API_KEY;

  if (apiKey !== MY_API_KEY) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: `You are unauthorized to do this` });
  }

  console.log("Running Habit Schema management function on every 12am!");
  // Fetch all habits from the database
  const habits = await Habit.find();

  if (!habits || habits.length === 0) {
    console.log("Closing Habit Schema scheduler");
    return;
  }

  // check if yesterday was 'unanswered' in all the habit instences
  const checkPromises = habits.map(async (habit) => {
    // Get the latest entry in dailyRecords, (which is yesterday in this case)
    const latestRecord = habit.dailyRecords[habit.dailyRecords.length - 1];

    // Check if yesterday's entry was 'unanswered'
    if (latestRecord && latestRecord.didIt === "unanswered") {
      // Handle the case where yesterday's entry was 'unanswered'
      habit.streak = 0;
      await habit.save();
    }
  });

  // Wait for all checks to complete
  await Promise.all(checkPromises);

  // push an 'unanswered' instence in the dailyRecords field for all of the habits
  const updatePromises = habits.map(async (habit) => {
    const latestRecordDate =
      new Date(
        habit.dailyRecords[habit.dailyRecords.length - 1]?.date ?? null
      ) || null;

    habit.dailyRecords.push({
      didIt: "unanswered",
      points: 0,
      date: addDays(latestRecordDate, 1) || Date.now(),
    });
    await habit.save();
  });

  // Wait for all updates to complete
  await Promise.all(updatePromises);

  res.status(StatusCodes.OK).json({
    msg: `Successfully ran the Habit Schema Manager that is supposed to run in 12 am each day!`,
  });
}

export async function habitSchemaManagerRemoveExtraDates(req, res) {
  // Check if the API key is present and correct
  const apiKey = req.headers["x-api-key"];
  const MY_API_KEY = process.env.MY_API_KEY;

  if (apiKey !== MY_API_KEY) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: `You are unauthorized to do this` });
  }

  console.log("Running Habit Schema manager for removing extra date function!");
  // Fetch all habits from the database
  const habits = await Habit.find();

  if (!habits || habits.length === 0) {
    console.log("Closing Habit Schema scheduler");
    return;
  }

  const checkPromises = habits.map(async (habit) => {
    while (
      isAfter(
        new Date(habit.dailyRecords[habit.dailyRecords.length - 1]?.date),
        new Date()
      )
    ) {
      habit.dailyRecords.pop();
      await habit.save();
    }

    if (
      !isToday(
        new Date(habit.dailyRecords[habit.dailyRecords.length - 1]?.date)
      )
    ) {
      habit.dailyRecords.push({
        didIt: "unanswered",
        points: 0,
        date: Date.now(),
      });
      await habit.save();
    }

    await habitRecordLogicSortAndCalculateAndSave(habit);
  });

  // Wait for all checks to complete
  await Promise.all(checkPromises);

  res.status(StatusCodes.OK).json({
    msg: `Successfully prettified every habit by removing wrong forward dates!`,
  });
}
