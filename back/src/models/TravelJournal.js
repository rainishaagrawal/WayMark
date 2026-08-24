import mongoose from "mongoose";

const travelJournalSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: false, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    title: { type: String, default: "" },
    summary: { type: String, required: [true, "Journal summary is required"] },
    highlights: { type: [String], default: [] },
    visitedPlaces: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    memoryRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "TravelMemory" }],
    isAiGenerated: { type: Boolean, default: false },
    generatedAt: { type: Date, default: Date.now },
    links: {
      type: [
        {
          platform: { type: String, default: "other" },
          url: { type: String, trim: true },
          label: { type: String, default: "" },
        },
      ],
      default: [],
    },
    userNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Note: not unique on trip anymore - user may want multiple manual journal
// entries for the same trip in addition to one AI-generated summary.
travelJournalSchema.index({ trip: 1, user: 1 });

export const TravelJournal = mongoose.model("TravelJournal", travelJournalSchema);
export default TravelJournal;
