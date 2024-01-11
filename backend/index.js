import { config } from "dotenv";
config();
import "express-async-errors";

import express from "express";
const app = express();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import passportConfig from "./utils/passport/config.js";

import connectDB from "./db/connect.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

import authRouter from "./routes/authRoutes.js";

// passport config
passportConfig(passport);

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("dev"));

// session middleware
app.use(
  session({
    secret: "whatever secret",
    resave: false,
    saveUninitialized: true,
  }),
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(`<h1>Winning Habits API</h1>`);
});

app.use("/api/v1/auth", authRouter);

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
