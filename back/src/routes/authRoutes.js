import { Router } from "express";
import { validate } from "../middlewares/validationMiddleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../utils/validators.js";
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  googleAuthController,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);
router.get("/verify-email", verifyEmailController);
router.post("/google", googleAuthController);
router.post("/logout", verifyJWT, logoutController);

export default router;
