import mongoose from "mongoose";

const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL_MS = 2000;
const DEFAULT_LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/voyageai";

export const connectDB = async (retryCount = 0) => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_LOCAL_MONGO_URI;

  try {
    const connectionInstance = await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `✅ MongoDB Connected Successfully! Host: ${connectionInstance.connection.host} | Database: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.error(`❌ MongoDB Connection Error (Attempt ${retryCount + 1}/${MAX_RETRIES}): ${error.message}`);

    if (retryCount < MAX_RETRIES - 1) {
      const delay = INITIAL_RETRY_INTERVAL_MS * Math.pow(2, retryCount);
      console.log(`🔄 Retrying connection in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectDB(retryCount + 1);
    } else {
      console.error("💥 Max MongoDB connection retries reached. Exiting process.");
      process.exit(1);
    }
  }
};

mongoose.connection.on("error", (err) => {
  console.error(`❌ Critical Mongoose connection error: ${err.message}`);
});

export default connectDB;
