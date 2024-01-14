import { config } from "dotenv";
config();
import "express-async-errors";
import "./scheduleJobs/dailyHabitSchemaManager.js";

import express from "express";
const app = express();

import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./db/connect.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

import authRouter from "./routes/authRoutes.js";
import habitRouter from "./routes/habitRoutes.js";

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send(`<h1>Winning Habits API</h1>`);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/habits", habitRouter);

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
