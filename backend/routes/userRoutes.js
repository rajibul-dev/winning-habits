import { Router } from "express";
import {
  getAllUsers,
  getUserCount,
  getUserById,
  getCurrentUser,
  updateCurrentUser,
  updateCurrentUserAvatar,
  deleteCurrentUserAvatar,
  deleteCurrentUser,
  deleteUserById,
} from "../controllers/userController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentiation.js";

const router = Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/count").get(authenticateUser, getUserCount);
router
  .route("/me")
  .get(authenticateUser, getCurrentUser)
  .patch(authenticateUser, updateCurrentUser)
  .delete(authenticateUser, deleteCurrentUser);
router
  .route("/me/avatar")
  .patch(authenticateUser, updateCurrentUserAvatar)
  .delete(authenticateUser, deleteCurrentUserAvatar);
router
  .route("/:id")
  .get(authenticateUser, getUserById)
  .delete(authenticateUser, authorizePermissions("admin"), deleteUserById);

export default router;
