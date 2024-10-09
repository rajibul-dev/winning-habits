import scheduler from "node-schedule";
import Habit from "../models/HabitModel.js";
import { addDays } from "date-fns";

const dailyHabitSchemaManager = scheduler.scheduleJob(
  "0 0 * * *",
  // for testing:
  // "*/5 * * * * *",
  async () => {
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
        new Date(habit.dailyRecords[habit.dailyRecords.length - 1].date) ||
        null;

      habit.dailyRecords.push({
        didIt: "unanswered",
        points: 0,
        date: addDays(latestRecordDate, 1) || Date.now(),
      });
      await habit.save();
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);
  }
);

export { dailyHabitSchemaManager };
