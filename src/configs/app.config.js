import express from "express";
import cookieParser from "cookie-parser";

import userRouter from "../routes/user.routes.js";
import templateRouter from "../routes/templates.routes.js";
import resumeRouter from "../routes/resume.routes.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/template", templateRouter);
app.use("/api/resume", resumeRouter);

// Test Route
app.get("/api", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

export default app;
