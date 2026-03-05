import express from "express";
import { changeStatus, changeStatusMulti, deleteManyUsers, deleteUser, getAllUsers, getUserById } from "../controllers/adminControllers.js";
const adminRoutes = express.Router();
adminRoutes.get("/", getAllUsers);
adminRoutes.post("/status", changeStatus); 
adminRoutes.post("/multiStatus", changeStatusMulti)
adminRoutes.delete("/delete", deleteManyUsers);
adminRoutes.delete("/:userId", deleteUser);
adminRoutes.get("/user/:userId", getUserById); 
export default adminRoutes  
