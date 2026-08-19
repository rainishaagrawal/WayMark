import mongoose from "mongoose";

/**
 * Badge Schema — awarded to users for milestones (trip completions, memories, group trips).
 * New model, supports point: "trip complete karne par badge + notification + profile display".
 */
const badgeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "🏆" },
    awardedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

badgeSchema.index({ user: 1, code: 1 }, { unique: true });

export const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
