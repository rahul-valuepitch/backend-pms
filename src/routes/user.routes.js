import { Router } from "express";
import {
  forgotPasswordController,
  forgotPasswordRequestController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  updateProfileController,
} from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

// Router
const router = new Router();

// Routes
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/logout").post(verifyUser, logoutController);
router.route("/forgot-password").post(forgotPasswordController);
router.route("/forgot-password-request").patch(forgotPasswordRequestController);
router.route("/reset-password").patch(verifyUser, resetPasswordController);

router.route("/update").post(verifyUser, updateProfileController);

export default router;
