import mongoose, { Schema, model } from "mongoose";

const HabitSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "You need to provide a habit name"],
    },
    dailyRecords: [
      {
        didIt: Boolean,
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

HabitSchema.pre("save", function (next) {
  if (this.isModified("dailyRecords")) {
    const latestRecord = this.dailyRecords[this.dailyRecords.length - 1];

    if (latestRecord && latestRecord.didIt) {
      this.streak = (this.streak || 0) + 1;
      this.totalPoints = (this.totalPoints || 0) + latestRecord.points;
    } else {
      this.streak = 0;
    }
  }

  next();
});

export default model("Habit", HabitSchema);
