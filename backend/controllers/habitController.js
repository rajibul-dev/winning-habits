import { StatusCodes } from "http-status-codes";
import Habit from "../models/HabitModel.js";
import { BadRequestError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import { addDays, isAfter, isSameDay, startOfDay } from "date-fns";
import { getNow } from "../utils/getNow.js";
import Achievement from "../models/AchievementModel.js";
import User from "../models/UserModel.js";

const NOTE_MAX_LENGTH = 280;

export async function createHabit(req, res) {
  // add 60 past dates with unanswered status for the new habit
  const dailyRecords = [];
  for (let i = 0; i < 60; i++) {
    dailyRecords.push({
      didIt: "unanswered",
      date: addDays(getNow(), -i),
      note: "",
    });
  }

  req.body.user = req.user.userID;
  req.body.dailyRecords = dailyRecords;

  const habit = await Habit.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ habit, msg: "Habit created successfully!" });
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

  // check if achievement is associated with this habit and if so, delete it as well
  await Achievement.deleteOne({ habit: habit._id });

  await habit.deleteOne();
  res.status(StatusCodes.OK).json({ msg: `Habit removed successfully!` });
}

// ------ HELPERS ------
async function habitRecordLogicSortAndCalculateAndSave(habit) {
  sortRecords(habit.dailyRecords);

  habit.recalculateHabit();

  await habit.save();
}

function sortRecords(records) {
  records.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getTargetRecordFromHabit(habit, targetRecordID) {
  let targetRecord;
  let targetRecordIndex;

  try {
    targetRecord = habit.dailyRecords.find(
      (record) => record._id.toString() === targetRecordID,
    );
    targetRecordIndex = habit.dailyRecords.findIndex(
      (record) => record._id.toString() === targetRecordID,
    );
  } catch (error) {
    throw new BadRequestError(`No record with id: ${targetRecordID}`);
  }

  if (!targetRecord || targetRecordIndex === -1) {
    throw new BadRequestError(`No record with id: ${targetRecordID}`);
  }

  return { targetRecord, targetRecordIndex };
}

function validateAnswer(answer) {
  if (!["yes", "no", "unanswered"].includes(answer)) {
    throw new BadRequestError("Invalid answer");
  }
}

function getLatestRecord(records) {
  if (!records.length) return null;

  return records.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  });
}

function hasRecordForDate(records, targetDate) {
  return records.some((record) => isSameDay(new Date(record.date), targetDate));
}
// ---------------------

export async function addDailyAction(req, res) {
  const { id: habitID } = req.params;
  const { answer } = req.body;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  validateAnswer(answer);

  const today = startOfDay(getNow());

  const todayExists = hasRecordForDate(habit.dailyRecords, today);

  if (!todayExists) {
    const newRecord = {
      didIt: answer,
      date: today.getTime(),
      note: "",
    };
    habit.dailyRecords.push(newRecord);
  } else {
    const latestRecord = getLatestRecord(habit.dailyRecords);
    latestRecord.didIt = answer;
  }

  await habitRecordLogicSortAndCalculateAndSave(habit);
  const latestRecord = getLatestRecord(habit.dailyRecords);

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

  validateAnswer(updatedAnswer);

  const { targetRecord } = getTargetRecordFromHabit(habit, targetRecordID);

  habit.isCustomRecordUpdate = true;
  targetRecord.didIt = updatedAnswer;

  await habitRecordLogicSortAndCalculateAndSave(habit);

  res.status(StatusCodes.OK).json({
    name: habit.name,
    habitID: habit._id,
    targetRecord,
    totalPoints: habit.totalPoints,
    streak: habit.streak,
  });
}

export async function upsertDailyRecordNote(req, res) {
  const { id: habitID } = req.params;
  const { targetRecordID, note } = req.body;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  const normalizedNote = typeof note === "string" ? note.trim() : "";

  if (normalizedNote.length > NOTE_MAX_LENGTH) {
    throw new BadRequestError(
      `Note cannot be longer than ${NOTE_MAX_LENGTH} characters`,
    );
  }

  const { targetRecord } = getTargetRecordFromHabit(habit, targetRecordID);

  targetRecord.note = normalizedNote;
  await habit.save();

  res.status(StatusCodes.OK).json({
    habitID: habit._id,
    targetRecord,
    msg: normalizedNote
      ? "Note saved successfully"
      : "Note removed successfully",
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
  const apiKey = req.headers["x-api-key"];
  const MY_API_KEY = process.env.MY_API_KEY;

  if (apiKey !== MY_API_KEY) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "You are unauthorized to do this",
    });
  }

  const userID = req.user.userID;

  const user = await User.findById(userID);

  const today = startOfDay(getNow());

  if (
    user.lastHabitSchemaManagerRan &&
    isSameDay(user.lastHabitSchemaManagerRan, today)
  ) {
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Skipped schema manager for it ran today already" });
  }

  const habits = await Habit.find({ user: userID });

  if (!habits?.length) {
    console.log("Closing Habit Schema scheduler");
    return res.status(StatusCodes.OK).json({ msg: "No habits to update" });
  }

  // update when it last ran, so that we can reliably skip this when unnecessary
  user.lastHabitSchemaManagerRan = today;
  await user.save();

  const checkPromises = habits.map(async (habit) => {
    const records = habit.dailyRecords;

    sortRecords(records);

    // helper: check if record already exists for a date
    const recordExistsForDate = (targetDate) =>
      hasRecordForDate(records, targetDate);

    const lastRecord = getLatestRecord(records);

    // insert today's record if missing
    if (!recordExistsForDate(today)) {
      records.push({
        didIt: "unanswered",
        points: 0,
        date: today.getTime(),
        note: "",
      });
    }

    // fill missing days
    if (lastRecord) {
      let lastDate = startOfDay(new Date(lastRecord.date));

      while (true) {
        const nextDay = addDays(lastDate, 1);

        if (isSameDay(nextDay, today) || nextDay > today) break;

        if (!recordExistsForDate(nextDay)) {
          records.push({
            didIt: "unanswered",
            points: 0,
            date: nextDay.getTime(),
            note: "",
          });
        }

        lastDate = nextDay;
      }
    }

    await habitRecordLogicSortAndCalculateAndSave(habit);
  });

  await Promise.all(checkPromises);

  return res.status(StatusCodes.OK).json({ msg: "Ran habit schema manager" });
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
      habit.dailyRecords.length > 0 &&
      isAfter(
        new Date(habit.dailyRecords[habit.dailyRecords.length - 1]?.date),
        getNow(),
      )
    ) {
      habit.dailyRecords.pop();
    }

    const lastRecord = getLatestRecord(habit.dailyRecords);

    // Check if today's record already exists
    const todayRecordExists = hasRecordForDate(
      habit.dailyRecords,
      startOfDay(getNow()),
    );

    // If there's no last record or last record isn't today, add a new one
    if (!lastRecord || !todayRecordExists) {
      habit.dailyRecords.push({
        didIt: "unanswered",
        points: 0,
        date: getNow().getTime(),
        note: "",
      });
    }

    await habitRecordLogicSortAndCalculateAndSave(habit);
  });

  // Wait for all checks to complete
  await Promise.all(checkPromises);

  res.status(StatusCodes.OK).json({
    msg: `Successfully prettified every habit by removing wrong forward dates!`,
  });
}
