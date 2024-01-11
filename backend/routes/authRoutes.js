import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  googleOAuth,
  googleOAuthCallback,
  login,
  logout,
  register,
  requestNewVerificationEmail,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/request-new-verification-email", requestNewVerificationEmail);
router.post("/login", login);
router.get("/google", googleOAuth());
router.get("/google/callback", googleOAuthCallback(), function (req, res) {
  res.redirect("/");
});
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

export default router;
