import mongoose from "mongoose";
import dotenv from "dotenv";
import Trip from "./src/models/Trip.js";
import { generateDestinationSticker } from "./src/services/stickerService.js";

dotenv.config();

const sync = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const completedTrips = await Trip.find({ status: "COMPLETED", stickerUrl: { $in: [null, ""] } });
    console.log(`Found ${completedTrips.length} completed trips without stickers.`);

    for (const trip of completedTrips) {
      console.log(`Processing trip: ${trip.title} / ${trip.destinationName}`);
      try {
        const dest = trip.destinationName || trip.title;
        if (!dest) continue;
        
        const sticker = await generateDestinationSticker(dest);
        if (sticker && sticker.stickerUrl) {
          trip.stickerUrl = sticker.stickerUrl;
          trip.landmark = sticker.landmark;
          await trip.save();
          console.log(`Successfully generated sticker for ${dest}`);
        }
      } catch (err) {
        console.error(`Failed to generate for ${trip.title}`, err);
      }
    }

    console.log("Sync complete.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

sync();
