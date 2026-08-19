import mongoose from "mongoose";

const travelTimelineSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  year: { type: Number, required: true },
  destinationName: { type: String, required: true },
});

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true,
    },
    countriesVisited: { type: [String], default: [] },
    totalTripsCount: { type: Number, default: 0, min: 0 },
    completedTripsCount: { type: Number, default: 0, min: 0 },
    totalExpensesAmount: { type: Number, default: 0, min: 0 },
    categoryBreakdown: {
      flights: { type: Number, default: 0 },
      hotels: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
    },
    travelTimeline: [travelTimelineSchema],
  },
  { timestamps: true }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
