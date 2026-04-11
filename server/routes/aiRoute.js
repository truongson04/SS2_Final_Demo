import express, { Router } from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  analysisResume,
  chatWithAi,
  enhanceJobDescription,
  enhanceProfessionalSummary,
  enhanceProjectDescription,
  uploadResume,
  quickChat,
  getInterviewHistory,
  getInterviewSession,
  deleteInterviewSession,
} from "../controllers/aiControllers.js";
const aiRouter = express.Router();
aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/enhance-pro-desc", protect, enhanceProjectDescription);
aiRouter.post("/analysis", protect, analysisResume)
aiRouter.post("/chat", protect, chatWithAi)
aiRouter.post("/quick-chat", protect, quickChat)
aiRouter.get("/interview/history", protect, getInterviewHistory)
aiRouter.get("/interview/session/:sessionId", protect, getInterviewSession)
aiRouter.delete("/interview/session/:sessionId", protect, deleteInterviewSession)
export default aiRouter;
