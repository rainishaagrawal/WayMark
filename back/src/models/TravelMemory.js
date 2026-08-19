import mongoose from "mongoose";

const travelMemorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    type: {
      type: String,
      enum: ["reel", "youtube", "pinterest", "blog", "image", "note"],
      required: [true, "Memory type is required"],
      index: true,
    },
    url: { type: String, trim: true },
    mediaUrl: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    summary: { type: String, default: "" },
    userThoughts: { type: String, default: "" },
    tripRef: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", index: true },
    destinationRef: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", index: true },
    locationName: { type: String, default: "" },
    tags: { type: [String], default: [], index: true },
    collectionRef: { type: mongoose.Schema.Types.ObjectId, ref: "MemoryCollection", index: true },
  },
  { timestamps: true }
);

travelMemorySchema.index({ user: 1, type: 1 });
travelMemorySchema.index({ user: 1, destinationRef: 1 });

export const TravelMemory = mongoose.model("TravelMemory", travelMemorySchema);
export default TravelMemory;
