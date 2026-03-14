import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import resumeRouter from "./routes/resumeRoute.js";
import adminRoutes from "./routes/adminRoute.js";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import aiRouter from "./routes/aiRoute.js";
import {
  googleResister,
  githubRegister,
} from "./controllers/userControllers.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// connect to db
connectDB();
const port = process.env.PORT;
app.use(
  cors({
    origin: ["https://ss-2-final-demo.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.send("The server is running");
});
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRoutes);
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    googleResister,
  ),
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    githubRegister,
  ),
);
export default app;
if (process.env.NODE_ENV === "develop") {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port} `);
  });
}
