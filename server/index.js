import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import resumeRouter from "./routes/resumeRoute.js";

import aiRouter from "./routes/aiRoute.js";

const app = express();
app.use(express.json());
app.use(cors());
// connect to db
await connectDB();
const port = process.env.PORT;
app.use(
  cors({
    origin: ["https://ss-2-final-demo.vercel.app/", "http://localhost:5173"], // Chỉ cho phép domain Vue của bạn và localhost
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Nếu có dùng cookies/session
  }),
);
app.get("/", (req, res) => {
  res.send("ok");
});
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// app.listen(port, () => {
//   console.log(`The server is running at http://localhost:${port}`);
// });
export default app;
