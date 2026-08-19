import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], default: "Point", required: true },
  coordinates: { type: [Number], required: true },
});

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Destination name is required"], trim: true, index: true },
    city: { type: String, required: [true, "City is required"], trim: true, index: true },
    country: { type: String, required: [true, "Country is required"], trim: true, index: true },
    location: { type: pointSchema, required: true },
    description: { type: String, required: [true, "Description is required"] },
    bestTimeToVisit: { type: [String], default: [] },
    localFood: { type: [String], default: [] },
    safetyTips: { type: [String], default: [] },
    budgetInfo: {
      currency: { type: String, default: "USD" },
      averageDailyBudget: { type: Number, default: 0 },
      priceLevel: { type: String, enum: ["BUDGET", "MODERATE", "EXPENSIVE", "LUXURY"], default: "MODERATE" },
    },
    images: { type: [String], default: [] },
    averageRating: { type: Number, default: 0, min: 0, max: 5, index: true },
    totalReviews: { type: Number, default: 0 },
    category: { type: [String], default: [] },
  },
  { timestamps: true }
);

destinationSchema.index({ location: "2dsphere" });
destinationSchema.index({ country: 1, city: 1, name: 1 });
destinationSchema.index({ category: 1, averageRating: -1 });

export const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;
