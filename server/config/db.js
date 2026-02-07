import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Database already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "SS2-cv",
      maxPoolSize: 10, // Giới hạn số lượng kết nối tối đa (tránh quá tải)
      serverSelectionTimeoutMS: 5000, // Nếu mất mạng, báo lỗi sau 5s thay vì treo 30s
      socketTimeoutMS: 45000, // Đóng kết nối nếu không hoạt động sau 45s
      family: 4,
    });

    console.log("MongoDB Connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

export default connectDB;
