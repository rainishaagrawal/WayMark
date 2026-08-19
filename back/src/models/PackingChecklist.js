import mongoose from "mongoose";

const packingItemSchema = new mongoose.Schema({
  item: { type: String, required: [true, "Item name is required"], trim: true },
  category: {
    type: String,
    enum: ["Clothing", "Toiletries", "Electronics", "Documents", "Medication", "Miscellaneous"],
    default: "Miscellaneous",
  },
  isPacked: { type: Boolean, default: false },
});

const packingChecklistSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: [true, "Trip reference is required"], index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    items: [packingItemSchema],
    isAiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packingChecklistSchema.index({ trip: 1, user: 1 }, { unique: true });

export const PackingChecklist = mongoose.model("PackingChecklist", packingChecklistSchema);
export default PackingChecklist;
