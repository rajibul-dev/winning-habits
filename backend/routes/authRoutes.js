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
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.post("/oauth/google", google);
router.post("/email/verify", verifyEmail);
router.post("/email/resend-verification", requestNewVerificationEmail);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);
router.patch("/password", authenticateUser, changePassword);

export default router;
