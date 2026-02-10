import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Database already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "SS2-cv",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log("MongoDB Connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

export default connectDB;
