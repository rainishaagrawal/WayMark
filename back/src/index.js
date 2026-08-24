import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running in [${process.env.NODE_ENV || "development"}] mode on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = (signal) => {
  console.log(`\n⚠️ Received ${signal}. Initiating graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log("🔒 HTTP server closed.");
      try {
        await mongoose.connection.close(false);
        console.log("🔒 MongoDB connection closed.");
        process.exit(0);
      } catch (err) {
        console.error("❌ Error closing MongoDB connection:", err);
        process.exit(1);
      }
    });
    setTimeout(() => {
      console.error("💥 Forced shutdown due to timeout.");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception thrown:", error);
  gracefulShutdown("uncaughtException");
});
