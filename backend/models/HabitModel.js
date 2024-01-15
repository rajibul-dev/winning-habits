import mongoose, { Schema, model } from "mongoose";
import Achievement from "./AchievementModel";

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
      // Do nothing for "unanswered" case, just proceed to the next middleware
      break;
  }

  // Check if totalPoints reached 1000
  if (this.totalPoints >= 1000) {
    await handleAchievementLogic(this);
  }

  next();
});

async function handleAchievementLogic(habit) {
  if (!habit.user && !habit._id) {
    return console.error("User or habit information missing for achievement");
  }

  try {
    await Achievement.create({
      user: habit.user,
      habit: habit._id,
    });
  } catch (error) {
    return console.error("Error creating achievement:", error.message);
  }
}

export default model("Habit", HabitSchema);
