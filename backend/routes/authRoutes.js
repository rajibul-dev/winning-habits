import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  google,
  login,
  logout,
  register,
  requestNewVerificationEmail,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authentiation.js";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/request-new-verification-email", requestNewVerificationEmail);
router.post("/login", login);
router.get("/logout", authenticateUser, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authenticateUser, changePassword);
router.post("/google", google);

export default router;
