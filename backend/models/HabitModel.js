import mongoose, { Schema, model } from "mongoose";

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
          enum: ["yes", "no", "answered"],
        },
        points: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    streak: Number,
    totalPoints: Number,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Handle relational value updates based on changes to the dailyRecords field
HabitSchema.pre("save", function (next) {
  if (this.isModified("dailyRecords")) {
    const latestRecord = this.dailyRecords[this.dailyRecords.length - 1];

    // if we choose 'yes' in the habit
    if (latestRecord && latestRecord.didIt === "yes") {
      this.streak = (this.streak || 0) + 1;
      latestRecord.points = this.streak;
      this.totalPoints = (this.totalPoints || 0) + latestRecord.points;
    } else {
      // if the answer was 'no', or 'unanswered' in the habit
      this.streak = 0;
      latestRecord.points = this.streak;
    }
  }

  next();
});

export default model("Habit", HabitSchema);
