import { Router } from "express";
import {
  createTemplateController,
  deleteTemplateController,
  getAllTemplatesController,
  getTemplateDetailController,
  updateTemplateController,
} from "../controllers/templates.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

// Router
const router = new Router();

// Routes
router.route("/").get(getAllTemplatesController);
router.route("/:_id").get(getTemplateDetailController);
router.route("/").post(verifyUser, createTemplateController);
router.route("/:_id").patch(verifyUser, updateTemplateController);
router.route("/:_id").delete(verifyUser, deleteTemplateController);

export default router;
