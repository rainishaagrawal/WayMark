import mongoose from "mongoose";
import { User } from "./src/models/User.js";
import * as authService from "./src/services/authService.js";
import dotenv from "dotenv";

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Register a new user
    const email = "test" + Date.now() + "@test.com";
    const password = "password123";
    console.log("Registering user:", email);
    
    await authService.registerUser({
      name: "Test User",
      email,
      password,
    });

    console.log("User registered. Now trying to login...");
    const loginResult = await authService.loginUser({
      email,
      password,
    });

    console.log("Login successful!", loginResult.user.email);
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await mongoose.disconnect();
  }
};

testLogin();
