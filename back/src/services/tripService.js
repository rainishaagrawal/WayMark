import Trip from "../models/Trip.js";
import TripDay from "../models/TripDay.js";
import { generateDestinationSticker } from "./stickerService.js";
import PackingChecklist from "../models/PackingChecklist.js";
import TravelJournal from "../models/TravelJournal.js";
import GroupTrip from "../models/GroupTrip.js";
import GroupMember from "../models/GroupMember.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";
import { createNotification } from "./notificationService.js";
import { getUserAnalytics } from "./analyticsService.js";
import { nudgeTravelDnaFromTrip } from "./dnaService.js";
import { checkAndAwardTripBadges } from "./badgeService.js";

/**
 * Trip CRUD service - this did not exist in the original backend (only
 * AI/manual trip *creation* existed). Adds list/get/delete/complete/banner-update,
 * which are required for: deleting trips, marking trips complete (which then
 * cascades into Analytics + Travel DNA + Badges updates), and per-trip banners.
 */

export const listUserTrips = async (userId, filters = {}) => {
  const query = { user: userId };
  if (filters.status) query.status = filters.status;

  // Own trips
  const ownTrips = await Trip.find(query).populate("destination").sort({ createdAt: -1 });

  // Trips the user joined via group invite (but doesn't own)
  const groupMemberships = await GroupMember.find({ user: userId, status: "ACCEPTED" }).select("groupTrip");
  const groupTripIds = groupMemberships.map((m) => m.groupTrip);
  const joinedGroupTrips = await GroupTrip.find({ _id: { $in: groupTripIds } }).select("trip");
  const joinedTripIds = joinedGroupTrips.map((g) => g.trip?.toString()).filter(Boolean);

  // Only include trips the user doesn't already own
  const ownTripIds = new Set(ownTrips.map((t) => t._id.toString()));
  const extraTripIds = joinedTripIds.filter((id) => !ownTripIds.has(id));

  let groupJoinedTrips = [];
  if (extraTripIds.length > 0) {
    groupJoinedTrips = await Trip.find({ _id: { $in: extraTripIds } })
      .populate("destination")
      .sort({ createdAt: -1 });
    // Mark them so the frontend knows they are shared group trips
    groupJoinedTrips = groupJoinedTrips.map((t) => ({
      ...t.toObject(),
      isGroupShared: true,
    }));
  }

  return [...ownTrips, ...groupJoinedTrips];
};

export const getTripById = async (tripId, userId) => {
  // First try: user owns the trip
  let trip = await Trip.findOne({ _id: tripId, user: userId }).populate("destination").populate({
    path: "tripDays",
    options: { sort: { dayNumber: 1 } },
  });

  if (!trip) {
    // Second try: user is a member of a group trip that references this trip
    const groupTrip = await GroupTrip.findOne({ trip: tripId });
    if (groupTrip) {
      const membership = await GroupMember.findOne({
        groupTrip: groupTrip._id,
        user: userId,
        status: "ACCEPTED",
      });
      if (membership) {
        trip = await Trip.findById(tripId).populate("destination").populate({
          path: "tripDays",
          options: { sort: { dayNumber: 1 } },
        });
      }
    }
  }

  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");
  return trip;
};

export const deleteTrip = async (tripId, userId) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");

  await Promise.all([
    TripDay.deleteMany({ trip: tripId }),
    PackingChecklist.deleteMany({ trip: tripId, user: userId }),
    TravelJournal.deleteMany({ trip: tripId, user: userId }),
    Expense.deleteMany({ trip: tripId, paidBy: userId }),
  ]);

  // If this trip was shared as a group trip, clean that up too (owner only)
  const groupTrip = await GroupTrip.findOne({ trip: tripId, owner: userId });
  if (groupTrip) {
    await GroupMember.deleteMany({ groupTrip: groupTrip._id });
    await groupTrip.deleteOne();
  }

  await trip.deleteOne();
  return { message: "Trip deleted successfully" };
};

export const updateTripBanner = async (tripId, userId, bannerImage) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: tripId, user: userId },
    { $set: { bannerImage, isCustomBanner: true } },
    { new: true }
  );
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");
  return trip;
};

export const updateTripNotes = async (tripId, userId, notes) => {
  const trip = await Trip.findOneAndUpdate({ _id: tripId, user: userId }, { $set: { notes } }, { new: true });
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");
  return trip;
};

export const updateTripDays = async (tripId, userId, daysData) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");

  // Delete existing TripDays for this trip to replace with new data
  await TripDay.deleteMany({ trip: tripId });

  const tripDays = [];
  for (let i = 0; i < daysData.length; i++) {
    const day = daysData[i];
    const newDay = await TripDay.create({
      trip: tripId,
      dayNumber: i + 1,
      date: day.date || new Date(new Date(trip.startDate).getTime() + i * 24 * 60 * 60 * 1000),
      morning: day.morning || [],
      afternoon: day.afternoon || [],
      evening: day.evening || [],
    });
    tripDays.push(newDay._id);
  }

  trip.tripDays = tripDays;
  await trip.save();

  return await getTripById(tripId, userId);
};

/**
 * Marks a trip as COMPLETED. This is the trigger point for:
 * - Analytics recompute (completed trip count, countries visited, spending)
 * - Travel DNA nudge based on the trip's interests/style
 * - Badge checks + award notifications
 */
export const completeTrip = async (tripId, userId) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");

  if (trip.status === "COMPLETED") {
    return { trip, badgesAwarded: [] };
  }

  trip.status = "COMPLETED";
  trip.completedAt = new Date();

  try {
    const sticker = await generateDestinationSticker(trip.destinationName || trip.title);
    if (sticker && sticker.stickerUrl) {
      trip.stickerUrl = sticker.stickerUrl;
      trip.landmark = sticker.landmark;
    }
  } catch (err) {
    console.error("Sticker generation failed:", err);
  }

  await trip.save();

  // Fire-and-collect side effects
  await nudgeTravelDnaFromTrip(userId, {
    interests: trip.aiMeta?.interests || [],
    travelStyle: trip.aiMeta?.travelStyle,
    budgetTier: trip.aiMeta?.budgetTier,
    weight: 1.5,
  });

  await getUserAnalytics(userId);

  const badgesAwarded = await checkAndAwardTripBadges(userId);

  await createNotification({
    user: userId,
    type: "TRIP",
    title: "Trip Completed 🎉",
    message: `"${trip.title}" is marked as completed. Your Travel DNA and Analytics have been updated!`,
  });

  return { trip, badgesAwarded };
};

/**
 * Marks that the user has created at least one trip - used by the frontend to
 * automatically switch from the New User onboarding view to the Returning User
 * dashboard, instead of a manual toggle.
 */
export const markUserHasCreatedFirstTrip = async (userId) => {
  await User.findByIdAndUpdate(userId, { hasCreatedFirstTrip: true });
};
