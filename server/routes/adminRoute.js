import express from "express";
import { changeStatus, changeStatusMulti, deleteManyUsers, deleteUser, getAllUsers, getDashboardStats, getUserById, upgradeAdmin, getAllResumes, toggleResumeLock, getResumeByIdAdmin } from "../controllers/adminControllers.js";
import protect from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/authAdminMiddleware.js";

const adminRoutes = express.Router();

// Dashboard stats
adminRoutes.get("/dashboard", protect, isAdmin, getDashboardStats);

adminRoutes.get("/", protect, isAdmin, getAllUsers);
adminRoutes.post("/status", protect, isAdmin, changeStatus); 
adminRoutes.post("/multiStatus", protect, isAdmin, changeStatusMulti)
adminRoutes.delete("/delete", protect, isAdmin, deleteManyUsers);
adminRoutes.delete("/:userId", protect, isAdmin, deleteUser);
adminRoutes.get("/user/:userId", protect, isAdmin, getUserById); 
adminRoutes.patch("/upgrade", protect, isAdmin, upgradeAdmin); 

// Resume Management
adminRoutes.get("/resumes", protect, isAdmin, getAllResumes);
adminRoutes.get("/resumes/:resumeId", protect, isAdmin, getResumeByIdAdmin);
adminRoutes.post("/resumes/lock", protect, isAdmin, toggleResumeLock);

export default adminRoutes;
