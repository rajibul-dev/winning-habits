import scheduler from "node-schedule";
import Habit from "../models/HabitModel.js";

const dailyHabitSchemaManager = scheduler.scheduleJob("0 0 * * *", async () => {
  // Fetch all habits from the database
  const habits = await Habit.find();

  if (habits.length === 0) {
    return;
  }

  // check if yesterday was 'unanswered' in all the habit instences
  const checkPromises = habits.map(async (habit) => {
    // Get the latest entry in dailyRecords, (which is yesterday in this case)
    const latestRecord = habit.dailyRecords[habit.dailyRecords.length - 1];

    // Check if yesterday's entry was 'unanswered'
    if (
      latestRecord &&
      isYesterday(new Date(latestRecord.date)) &&
      latestRecord.didIt === "unanswered"
    ) {
      // Handle the case where yesterday's entry was 'unanswered'
      habit.streak = 0;
      await habit.save();
    }
  });

  // Wait for all checks to complete
  await Promise.all(checkPromises);

  // push an 'unanswered' instence in the dailyRecords field for all of the habits
  const updatePromises = habits.map(async (habit) => {
    habit.dailyRecords.push({
      didIt: "unanswered",
      points: 0,
      date: Date.now,
    });
    await habit.save();
  });

  // Wait for all updates to complete
  await Promise.all(updatePromises);
});

// Helper function to check if a date is yesterday
function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export { isYesterday, dailyHabitSchemaManager };
