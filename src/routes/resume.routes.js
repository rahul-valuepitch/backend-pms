import { Router } from "express";
import { isAuthorized, verifyUser } from "../middlewares/auth.middleware.js";
import uploadMiddleware from "../middlewares/multer.middleware.js";
import {
  createResumeController,
  deleteResumeController,
  getResumeDetailController,
  getUserResumesController,
  updateResumeController,
} from "../controllers/resume.controllers.js";

// Router
const router = new Router();

// Upload folders

// Routes
router.route("/").get(verifyUser, getUserResumesController);
router.route("/").post(verifyUser, createResumeController);
router
  .route("/:_id")
  .get(verifyUser, isAuthorized("Resume"), getResumeDetailController);
router
  .route("/:_id")
  .delete(verifyUser, isAuthorized("Resume"), deleteResumeController);
router
  .route("/:_id")
  .patch(verifyUser, isAuthorized("Resume"), updateResumeController);

export default router;
