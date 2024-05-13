import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  updateProfileController,
} from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

// Router
const router = new Router();

// Routes
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/logout").post(verifyUser, logoutController);
router.route("/update").post(verifyUser, updateProfileController);

export default router;
