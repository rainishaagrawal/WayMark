import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: [true, "Destination reference is required"], index: true },
    name: { type: String, required: [true, "Restaurant name is required"], trim: true },
    category: { type: String, default: "Casual Dining" },
    cuisineType: { type: [String], required: true, default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    priceRange: { type: String, enum: ["BUDGET", "MID_RANGE", "LUXURY"], default: "MID_RANGE" },
    isVegetarianFriendly: { type: Boolean, default: false, index: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({ destination: 1, cuisineType: 1 });
restaurantSchema.index({ destination: 1, rating: -1 });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
