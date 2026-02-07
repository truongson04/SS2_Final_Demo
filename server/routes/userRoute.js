import express from "express";
import {
  getUserById,
  getUserResumes,
  googleLogin,
  loginUser,
  registerUser,
} from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";
import passport from "passport";
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);
userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);
userRouter.get("/auth/google/callback", googleLogin);

export default userRouter;
