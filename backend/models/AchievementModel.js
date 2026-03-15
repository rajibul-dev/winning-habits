import mongoose, { Schema, model } from "mongoose";

const AchievementSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide 'user'"],
    },
    habit: {
      unique: true,
      type: mongoose.Types.ObjectId,
      ref: "Habit",
      required: [true, "Please provide the achieved habit"],
      unique: true,
    },
  },
  { timestamps: true },
);

export default model("Achievement", AchievementSchema);
