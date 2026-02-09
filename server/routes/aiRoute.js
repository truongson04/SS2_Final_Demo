import express, { Router } from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  analysisResume,
  enhanceJobDescription,
  enhanceProfessionalSummary,
  enhanceProjectDescription,
  interviewGenerate,
  uploadResume,
} from "../controllers/aiControllers.js";
const aiRouter = express.Router();
aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/enhance-pro-desc", protect, enhanceProjectDescription);
aiRouter.post("/interview", protect, interviewGenerate);
aiRouter.post("/analysis",protect, analysisResume)
export default aiRouter;
