import mongoose, { Schema, model } from "mongoose";
import Achievement from "./AchievementModel.js";

const HabitSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "You need to provide a habit name"],
    },
    dailyRecords: [
      {
        didIt: {
          type: String,
          enum: ["yes", "no", "unanswered"],
        },
        points: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
      },
    ],
    streak: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCustomRecordUpdate: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Handle relational value updates based on changes to the dailyRecords field
HabitSchema.pre("save", async function (next) {
  if (!this.isModified("dailyRecords")) return next();

  // don't run the daily action logic but do set the "custom status" false
  if (this.isCustomRecordUpdate) {
    this.isCustomRecordUpdate = false;
    return next();
  }

  const latestRecord = this.dailyRecords[this.dailyRecords.length - 1];
  if (!latestRecord) return next();

  switch (latestRecord.didIt) {
    case "yes":
      this.streak = (this.streak || 0) + 1;
      latestRecord.points = this.streak;
      this.totalPoints = (this.totalPoints || 0) + latestRecord.points;
      break;

    case "no":
      this.streak = 0;
      latestRecord.points = 0;
      break;

    case "unanswered":
      break;
  }

  next();
});

HabitSchema.pre("save", async function (next) {
  if (!this.isModified("totalPoints")) return next();

  if (this.totalPoints >= 1000) {
    await handleAchievementLogic(this);
  }
  if (this.totalPoints < 1000) {
    await checkAndRemoveFromAchievements(this);
  }

  next();
});

// Handlers for when user updates daily actions
HabitSchema.methods.sortDailyActionsArray = function (dailyRecords) {
  let yesCount = 1;

  dailyRecords.forEach((currentRecord, index) => {
    if (currentRecord.didIt === "no" || currentRecord.didIt === "unanswered") {
      yesCount = 1;

      console.log("Starting sort operation, getting portion indexes");

      // Get the unsorted portion's start index
      const unsortedPortionStartIndex = index + 1;
      console.log("Target index start: ", unsortedPortionStartIndex);

      // Get the unsorted portion's end index
      const unsortedPortionEndIndex = findUnsortedPortionEndIndex(
        dailyRecords,
        unsortedPortionStartIndex,
      );
      console.log("Target index end: ", unsortedPortionEndIndex);

      // Manipulate the properties of each item in the unsorted portion
      if (unsortedPortionStartIndex !== unsortedPortionEndIndex) {
        console.log("Starting manipulation...");
        let changedPoint = 1;
        for (
          let i = unsortedPortionStartIndex;
          i <= unsortedPortionEndIndex;
          i++
        ) {
          // in here, all of the following records will have yeses as their answer
          const record = dailyRecords[i];
          record.points = changedPoint;
          console.log("Manipulation complete!");

          changedPoint++;
        }
      } else {
        console.log("Same indexes, closing instence");
      }
    } else {
      currentRecord.points = yesCount;
      yesCount++;
    }
  });
};

function findUnsortedPortionEndIndex(dailyRecords, startIndex) {
  for (let i = startIndex; i < dailyRecords.length; i++) {
    const record = dailyRecords[i];
    if (record.didIt === "no" || record.didIt === "unanswered") {
      return i;
    }
  }
  return dailyRecords.length - 1;
}

HabitSchema.methods.calculateStreakAndPoints = async function (habit) {
  const streak = habit.dailyRecords.reduce(
    (streakSoFar, item, index, dailyRecords) => {
      const isLatest =
        dailyRecords[dailyRecords.length - 1]._id.toString() ===
        item._id.toString();

      if (isLatest && item.didIt === "unanswered") return streakSoFar;
      return item.points;
    },
    0,
  );

  const totalPoints = habit.dailyRecords.reduce((totalPointsSoFar, item) => {
    return totalPointsSoFar + item.points;
  }, 0);

  return { streak, totalPoints };
};

// Achievement handler functions
async function handleAchievementLogic(habit) {
  if (!habit.user || !habit._id) {
    return console.error("User or habit information missing for achievement");
  }

  try {
    await Achievement.findOneAndUpdate(
      { user: habit.user, habit: habit._id },
      { $setOnInsert: { user: habit.user, habit: habit._id } },
      { upsert: true },
    );
  } catch (error) {
    return console.error("Error creating achievement:", error.message);
  }
}

async function checkAndRemoveFromAchievements(habit) {
  if (!habit.user || !habit._id) {
    return console.error(
      "User or habit information missing for achievement check",
    );
  }

  try {
    await Achievement.findOneAndDelete({
      user: habit.user,
      habit: habit._id,
    });
  } catch (error) {
    return console.error(
      "Error checking and removing from achievements:",
      error.message,
    );
  }
}

export default model("Habit", HabitSchema);
