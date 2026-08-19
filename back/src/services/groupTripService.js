import GroupTrip from "../models/GroupTrip.js";
import GroupMember from "../models/GroupMember.js";
import Trip from "../models/Trip.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

export const createGroupTrip = async (userId, { tripId, description }) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found or you do not own this trip");

  const existingGroup = await GroupTrip.findOne({ trip: tripId });
  if (existingGroup) throw new ApiError(HTTP_STATUS.CONFLICT, "This trip is already shared as a group trip");

  const inviteCode = "TRIP-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const groupTrip = await GroupTrip.create({
    trip: tripId,
    owner: userId,
    inviteCode,
    description: description || `Group trip for ${trip.title}`,
    status: "OPEN",
  });

  await GroupMember.create({
    groupTrip: groupTrip._id,
    user: userId,
    role: "ADMIN",
    status: "ACCEPTED",
    joinedAt: new Date(),
  });

  return groupTrip;
};

export const joinGroupTripByCode = async (userId, inviteCode) => {
  const groupTrip = await GroupTrip.findOne({ inviteCode });
  if (!groupTrip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid invite code");
  if (groupTrip.status !== "OPEN") throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Group trip is no longer open for new members");

  const existingMember = await GroupMember.findOne({ groupTrip: groupTrip._id, user: userId });
  if (existingMember) throw new ApiError(HTTP_STATUS.CONFLICT, "You are already a member of this group trip");

  const member = await GroupMember.create({
    groupTrip: groupTrip._id,
    user: userId,
    role: "MEMBER",
    status: "ACCEPTED",
    joinedAt: new Date(),
  });

  return { groupTrip, member };
};

export const getGroupTripById = async (groupTripId) => {
  const groupTrip = await GroupTrip.findById(groupTripId).populate("trip").populate("owner", "-password");
  if (!groupTrip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Group trip not found");

  const members = await GroupMember.find({ groupTrip: groupTripId }).populate("user", "-password");
  return { groupTrip, members };
};

/**
 * Lists all group trips the user owns or is a member of.
 */
export const listMyGroupTrips = async (userId) => {
  const memberships = await GroupMember.find({ user: userId, status: "ACCEPTED" }).select("groupTrip role");
  const groupTripIds = memberships.map((m) => m.groupTrip);

  const groupTrips = await GroupTrip.find({ _id: { $in: groupTripIds } })
    .populate("trip")
    .populate("owner", "name email avatar")
    .sort({ createdAt: -1 });

  const memberCounts = await GroupMember.aggregate([
    { $match: { groupTrip: { $in: groupTripIds }, status: "ACCEPTED" } },
    { $group: { _id: "$groupTrip", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(memberCounts.map((m) => [m._id.toString(), m.count]));

  return groupTrips.map((g) => ({
    ...g.toObject(),
    memberCount: countMap[g._id.toString()] || 1,
    myRole: memberships.find((m) => m.groupTrip.toString() === g._id.toString())?.role || "MEMBER",
  }));
};

export const deleteGroupTrip = async (groupTripId, userId) => {
  const groupTrip = await GroupTrip.findOne({ _id: groupTripId, owner: userId });
  if (!groupTrip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Group trip not found or you are not the owner");

  await GroupMember.deleteMany({ groupTrip: groupTripId });
  await groupTrip.deleteOne();

  return { message: "Group trip deleted successfully" };
};
