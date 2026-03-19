import { StatusCodes } from "http-status-codes";
import Habit from "../models/HabitModel.js";
import { BadRequestError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import { addDays, isAfter, isSameDay, startOfDay } from "date-fns";
import { getNow } from "../utils/getNow.js";
import Achievement from "../models/AchievementModel.js";

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

async function habitRecordLogicSortAndCalculateAndSave(habit) {
  habit.dailyRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

  habit.recalculateHabit();

  await habit.save();
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

export async function addDailyAction(req, res) {
  const { id: habitID } = req.params;
  const { answer } = req.body;

  const habit = await getHabitById(habitID);

  checkPermissions(req.user, habit.user);

  validateAnswer(answer);

  const today = startOfDay(getNow());

  let latestRecord = habit.dailyRecords[habit.dailyRecords.length - 1];
  if (!latestRecord || !isSameDay(new Date(latestRecord.date), today)) {
    const newRecord = {
      didIt: answer,
      date: today.getTime(),
      note: "",
    };

    const todayExists = habit.dailyRecords.some((record) =>
      isSameDay(new Date(record.date), today),
    );

    if (!todayExists) {
      habit.dailyRecords.push(newRecord);
    }
  } else {
    latestRecord.didIt = answer;
  }

  await habitRecordLogicSortAndCalculateAndSave(habit);
  latestRecord = habit.dailyRecords[habit.dailyRecords.length - 1];

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
  const habits = await Habit.find({ user: userID });

  if (!habits?.length) {
    console.log("Closing Habit Schema scheduler");
    return res.status(StatusCodes.OK).json({ msg: "No habits to update" });
  }

  const today = startOfDay(getNow());

  const checkPromises = habits.map(async (habit) => {
    const records = habit.dailyRecords;

    // helper: check if record already exists for a date
    const recordExistsForDate = (targetDate) =>
      records.some((record) => isSameDay(new Date(record.date), targetDate));

    const lastRecord = records[records.length - 1];

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

        if (nextDay >= today) break;

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

    const lastRecord = habit.dailyRecords[habit.dailyRecords.length - 1];

    // Check if today's record already exists
    const todayRecordExists = habit.dailyRecords.some((record) =>
      isSameDay(new Date(record.date), getNow()),
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
