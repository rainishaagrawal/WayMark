import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    groupTrip: { type: mongoose.Schema.Types.ObjectId, ref: "GroupTrip", required: [true, "GroupTrip reference is required"], index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
    status: { type: String, enum: ["INVITED", "ACCEPTED", "DECLINED"], default: "INVITED", index: true },
    joinedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

groupMemberSchema.index({ groupTrip: 1, user: 1 }, { unique: true });

export const GroupMember = mongoose.model("GroupMember", groupMemberSchema);
export default GroupMember;
