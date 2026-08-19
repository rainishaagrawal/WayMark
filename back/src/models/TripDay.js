import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  startTime: { type: String },
  endTime: { type: String },
  estimatedCost: { type: Number, default: 0 },
  locationName: { type: String },
});

const tripDaySchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: [true, "Trip reference is required"], index: true },
    dayNumber: { type: Number, required: [true, "Day number is required"], min: 1 },
    date: { type: Date, required: [true, "Date is required"] },
    morning: [activitySchema],
    afternoon: [activitySchema],
    evening: [activitySchema],
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    restaurant: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

tripDaySchema.index({ trip: 1, dayNumber: 1 }, { unique: true });

export const TripDay = mongoose.model("TripDay", tripDaySchema);
export default TripDay;
