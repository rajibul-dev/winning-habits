import { Router } from "express";

import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentiation.js";

import {
  createHabit,
  deleteHabit,
  getAllHabits,
  getSingleHabit,
  getUserHabits,
  resetHabitProgress,
  addDailyAction,
  updateSingleHabit,
  updateCustomDateAction,
  handleArchive,
  habitSchemaManager,
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
  .patch(authenticateUser, updateCustomDateAction);

router.route("/:id/reset").put(authenticateUser, resetHabitProgress);

router.route("/:id/archive").post(authenticateUser, handleArchive);

router.route("/habitSchemaManager").post(habitSchemaManager);

export default router;
