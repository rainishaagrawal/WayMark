import mongoose from "mongoose";

const memoryCollectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    title: { type: String, required: [true, "Collection title is required"], trim: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    memories: [{ type: mongoose.Schema.Types.ObjectId, ref: "TravelMemory" }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

memoryCollectionSchema.index({ user: 1, title: 1 });

export const MemoryCollection = mongoose.model("MemoryCollection", memoryCollectionSchema);
export default MemoryCollection;
