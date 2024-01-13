import { Router } from "express";

import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentiation.js";

import {
  addDailyAction,
  createHabit,
  deleteHabit,
  getAllHabits,
  getSingleHabit,
  getUserHabits,
  resetHabitProgress,
  updateDailyAction,
  updateSingleHabit,
} from "../controllers/habitController.js";

const router = Router();

router
  .route("/")
  .get(authenticateUser, getUserHabits)
  .post(authenticateUser, createHabit);

router
  .route("/getAllHabits")
  .get(authenticateUser, authorizePermissions("admin"), getAllHabits);

router
  .route("/:id")
  .get(authenticateUser, getSingleHabit)
  .patch(authenticateUser, updateSingleHabit)
  .delete(authenticateUser, deleteHabit);

router
  .route("/:id/action")
  .post(authenticateUser, addDailyAction)
  .patch(updateDailyAction);

router.route("/:id/reset").put(authenticateUser, resetHabitProgress);

export default router;
