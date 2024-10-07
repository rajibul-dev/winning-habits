import { config } from "dotenv";
config();
import "express-async-errors";
import "./scheduleJobs/dailyHabitSchemaManager.js";

import express from "express";
import cors from "cors";
import path from "path";
const app = express();

import fileUpload from "express-fileupload";
import cloudinaryPackage from "cloudinary";
const cloudinary = cloudinaryPackage.v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./db/connect.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

import authRouter from "./routes/authRoutes.js";
import habitRouter from "./routes/habitRoutes.js";
import achievementRouter from "./routes/achievementRoutes.js";
import userRouter from "./routes/userRoutes.js";

const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(morgan("dev"));
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send(`<h1>Winning Habits API</h1>`);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/habits", habitRouter);
app.use("/api/v1/achievements", achievementRouter);
app.use("/api/v1/users", userRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening to prot ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
