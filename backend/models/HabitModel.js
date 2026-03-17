import mongoose, { Schema, model } from "mongoose";
import Achievement from "./AchievementModel.js";

const NOTE_MAX_LENGTH = 800;

const HabitSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "You need to provide a habit name"],
      maxLength: [100, "Habit name must be within 100 letters"],
    },
    dailyRecords: [
      {
        didIt: {
          type: String,
          enum: ["yes", "no", "unanswered"],
        },
        points: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
        note: {
          type: String,
          trim: true,
          default: "",
          maxlength: [
            NOTE_MAX_LENGTH,
            `Note cannot be longer than ${NOTE_MAX_LENGTH} characters`,
          ],
        },
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
    habitStatus: {
      type: String,
      enum: ["normal", "strong"],
      default: "normal",
    },
  },
  { timestamps: true },
);

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

HabitSchema.methods.recalculateHabit = function () {
  let streak = 0;
  let totalPoints = 0;

  const lastIndex = this.dailyRecords.length - 1;

  for (let i = 0; i < this.dailyRecords.length; i++) {
    const record = this.dailyRecords[i];

    if (record.didIt === "yes") {
      streak += 1;
      record.points = streak;
      totalPoints += record.points;
      continue;
    }

    if (record.didIt === "no") {
      streak = 0;
      record.points = 0;
      continue;
    }

    // unanswered
    record.points = 0;

    const isLatest = i === lastIndex;

    if (!isLatest) {
      // unanswered in the past breaks streak
      streak = 0;
    }
  }

  this.streak = streak;
  this.totalPoints = totalPoints;
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

  habit.habitStatus = "strong";
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

  habit.habitStatus = "normal";
}

export default model("Habit", HabitSchema);
