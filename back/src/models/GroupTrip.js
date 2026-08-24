import mongoose from "mongoose";

const groupTripSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: [true, "Trip reference is required"], unique: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "Owner/Admin user reference is required"], index: true },
    inviteCode: { type: String, required: [true, "Invite code is required"], unique: true, trim: true, index: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["OPEN", "LOCKED", "COMPLETED"], default: "OPEN", index: true },
  },
  { timestamps: true }
);

export const GroupTrip = mongoose.model("GroupTrip", groupTripSchema);
export default GroupTrip;
