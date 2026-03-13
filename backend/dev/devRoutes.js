import { addDays } from "date-fns";
import { Router } from "express";
import { getNow } from "../utils/getNow.js";

const router = Router();

// Block access outside development
router.use((req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ msg: "Not found" });
  }
  next();
});

router.post("/time/set-time", (req, res) => {
  global.devTimeOverride = req.body.date;
  res.json({ msg: "Time updated" });
});

router.post("/time/previous-day", (req, res) => {
  global.devTimeOverride = addDays(getNow(), -1);
  res.json({ msg: "Time updated" });
});

router.post("/time/next-day", (req, res) => {
  global.devTimeOverride = addDays(getNow(), 1);
  res.json({ msg: "Time updated" });
});

router.post("/time/next-week", (req, res) => {
  global.devTimeOverride = addDays(getNow(), 7);
  res.json({ msg: "Time updated" });
});

router.post("/time/next-month", (req, res) => {
  global.devTimeOverride = addDays(getNow(), 30);
  res.json({ msg: "Time updated" });
});

router.post("/time/next-year", (req, res) => {
  global.devTimeOverride = addDays(getNow(), 365);
  res.json({ msg: "Time updated" });
});

router.post("/time/reset", (req, res) => {
  global.devTimeOverride = null;
  res.json({ msg: "Time reset" });
});

export default router;
