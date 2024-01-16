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
  },
  { timestamps: true },
);

// Handle relational value updates based on changes to the dailyRecords field
HabitSchema.pre("save", async function (next) {
  if (!this.isModified("dailyRecords")) return next();

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
