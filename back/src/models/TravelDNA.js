import mongoose from "mongoose";

const travelDnaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], unique: true, index: true },
    personalityTraits: { type: [String], default: [] },
    pacePreference: { type: String, enum: ["SLOW", "MODERATE", "FAST_PACED"], default: "MODERATE" },
    spendingHabit: { type: String, enum: ["SAVER", "BALANCED", "SPENDER", "LUXURY"], default: "BALANCED" },
    topInterests: { type: [String], default: [] },
    aiGeneratedSummary: { type: String, default: "" },
    scores: {
      adventure: { type: Number, default: 50, min: 0, max: 100 },
      culture: { type: Number, default: 50, min: 0, max: 100 },
      relaxation: { type: Number, default: 50, min: 0, max: 100 },
      food: { type: Number, default: 50, min: 0, max: 100 },
    },
    tripsAnalyzed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TravelDNA = mongoose.model("TravelDNA", travelDnaSchema);
export default TravelDNA;
