import { Router } from "express";
import { createUserProfileController } from "../controllers/user.controllers.js";

// Router
const router = new Router();

// Routes
router.route("/register").post(createUserProfileController);

export default router;
