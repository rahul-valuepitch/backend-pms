import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import uploadMiddleware from "../middlewares/multer.middleware.js";
import {
  addProfilePhotoController,
  profileDetailController,
} from "../controllers/resume.controllers.js";

// Router
const router = new Router();

// Upload folders
const photoUpload = uploadMiddleware("photo");

// Routes
router.route("/update-profile").post(verifyUser, profileDetailController);
router
  .route("/update-profile-photo")
  .post(verifyUser, photoUpload.single("photo"), addProfilePhotoController);

export default router;
