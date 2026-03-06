import express from "express";
import { changeStatus, changeStatusMulti, deleteManyUsers, deleteUser, getAllUsers, getUserById, upgradeAdmin } from "../controllers/adminControllers.js";
import protect from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/authAdminMiddleware.js";
const adminRoutes = express.Router();
adminRoutes.get("/", protect, isAdmin,  getAllUsers);
adminRoutes.post("/status",  protect, isAdmin,changeStatus); 
adminRoutes.post("/multiStatus", protect, isAdmin, changeStatusMulti)
adminRoutes.delete("/delete", protect, isAdmin, deleteManyUsers);
adminRoutes.delete("/:userId", protect, isAdmin,deleteUser);
adminRoutes.get("/user/:userId", protect, isAdmin,getUserById); 
adminRoutes.patch("/upgrade", protect, isAdmin,upgradeAdmin); 
export default adminRoutes  
