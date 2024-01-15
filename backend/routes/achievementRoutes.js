import { Router } from "express";
import { authenticateUser } from "../middlewares/authentiation.js";
import {
  getMyAchievements,
  getUserAchievements,
} from "../controllers/achievementController.js";

const router = Router();

router.route("/showMe").get(authenticateUser, getMyAchievements);
router.route("/:id").get(authenticateUser, getUserAchievements);

export default router;
