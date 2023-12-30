import { config } from "dotenv";
config();

import express from "express";
const app = express();

import connectDB from "./db/connect.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

app.get("/", (req, res) => {
  res.send(`<h1>Winning Habits API</h1>`);
});

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
