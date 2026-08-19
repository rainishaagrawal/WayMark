import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: [true, "Destination reference is required"], index: true },
    name: { type: String, required: [true, "Hotel name is required"], trim: true },
    priceRange: { type: String, enum: ["BUDGET", "MID_RANGE", "LUXURY", "BOUTIQUE"], default: "MID_RANGE" },
    pricePerNight: { type: Number, required: true, min: 0 },
    category: { type: String, default: "Hotel" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    distanceToCityCenterKm: { type: Number, default: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

hotelSchema.index({ location: "2dsphere" });
hotelSchema.index({ destination: 1, rating: -1 });
hotelSchema.index({ destination: 1, priceRange: 1 });

export const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
