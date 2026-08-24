import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", index: true },
    // For AI-recommended destinations that don't have a resolved Destination doc yet.
    name: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    reason: { type: String, default: "" },
    notes: { type: String, default: "" },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, destination: 1 }, { unique: true, sparse: true });
wishlistSchema.index({ user: 1, name: 1 });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
