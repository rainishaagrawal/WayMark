import mongoose from "mongoose";
import * as aiService from "./src/services/aiService.js";
import { User } from "./src/models/User.js";
import dotenv from "dotenv";

dotenv.config();

const testPlanTrip = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne();
    if (!user) {
      console.log("No user found");
      return;
    }
    
    console.log("Running generateTripItinerary...");
    const result = await aiService.generateTripItinerary(user._id, {
      destinationName: "Kyoto, Japan",
      startDate: "2026-08-20",
      endDate: "2026-08-25",
      budget: "MODERATE",
      interests: ["Culture"],
      foodPref: "ANYTHING",
      travelStyle: "SOLO",
    });

    console.log("Success! Trip created:", result.trip._id);
  } catch (error) {
    console.error("Error during plan-trip:", error);
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
    if (error.errors) {
      console.error(error.errors);
    }
  } finally {
    await mongoose.disconnect();
  }
};

testPlanTrip();
