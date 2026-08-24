import mongoose from "mongoose";

/**
 * Trip Schema for itinerary planning, tracking, and budgeting.
 * Extended with: bannerImage (custom or auto-assigned per destination),
 * isAiGenerated flag, aiMeta (interests/style used to generate it, feeds Travel DNA),
 * and completedAt (set when user marks the trip as completed).
 */
const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    title: { type: String, required: [true, "Trip title is required"], trim: true },
    destinationName: { type: String, trim: true, default: "" },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: false, index: true },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
    budget: {
      totalAmount: { type: Number, default: 0 },
      spentAmount: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    status: { type: String, enum: ["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"], default: "PLANNED", index: true },
    tripDays: [{ type: mongoose.Schema.Types.ObjectId, ref: "TripDay" }],
    notes: { type: String, default: "" },

    // --- Extended fields ---
    bannerImage: { type: String, default: "" },
    isCustomBanner: { type: Boolean, default: false },
    isAiGenerated: { type: Boolean, default: false },
    landmark: { type: String, default: "" },
    stickerUrl: { type: String, default: "" },
    aiMeta: {
      interests: { type: [String], default: [] },
      travelStyle: { type: String, default: "" },
      foodPref: { type: String, default: "" },
      budgetTier: { type: String, default: "" },
    },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tripSchema.virtual("durationInDays").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

tripSchema.index({ user: 1, status: 1 });
tripSchema.index({ user: 1, startDate: -1 });

export const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
