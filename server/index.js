import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
const app = express();
app.use(express.json());
app.use(cors());
// connect to db
await connectDB();
app.get("/", (req, res) => {
  res.send("ok");
});
app.listen("3600", () => {
  console.log("The server is running at http://localhost:3600");
});
