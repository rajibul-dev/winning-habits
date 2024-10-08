import { Router } from "express";
import {
  getAllUsers,
  getAllUsersLength,
  getSingleUser,
  removeAvatar,
  showMe,
  updateAvatar,
  updateUser,
} from "../controllers/userController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentiation.js";

const router = Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/getAllUsersLength").get(authenticateUser, getAllUsersLength);
router.route("/showMe").get(authenticateUser, showMe);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateAvatar").patch(authenticateUser, updateAvatar);
router.route("/removeAvatar").delete(authenticateUser, removeAvatar);
router.route("/:id").get(authenticateUser, getSingleUser);

export default router;
