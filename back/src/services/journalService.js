import TravelJournal from "../models/TravelJournal.js";
import Trip from "../models/Trip.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * Manual CRUD for Travel Journal entries (separate from the AI-generation
 * endpoint in aiService, which the user can also trigger from a trip).
 */
export const listUserJournals = async (userId) => {
  return TravelJournal.find({ user: userId }).populate("trip", "title destinationName bannerImage").sort({ createdAt: -1 });
};

export const getJournalById = async (journalId, userId) => {
  const journal = await TravelJournal.findOne({ _id: journalId, user: userId }).populate("trip", "title destinationName bannerImage");
  if (!journal) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Journal entry not found");
  return journal;
};

export const createManualJournal = async (userId, { tripId, title, summary, highlights, visitedPlaces, coverImage, links, userNotes }) => {
  if (tripId) {
    const trip = await Trip.findOne({ _id: tripId, user: userId });
    if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");
  }

  return TravelJournal.create({
    trip: tripId || undefined,
    user: userId,
    title: title || "My Travel Journal Entry",
    summary,
    highlights: highlights || [],
    visitedPlaces: visitedPlaces || [],
    coverImage: coverImage || "",
    links: links || [],
    userNotes: userNotes || "",
    isAiGenerated: false,
  });
};

export const updateJournal = async (journalId, userId, updateData) => {
  // Only update allowed fields; map tripId → trip correctly
  const allowed = ["title", "summary", "highlights", "coverImage", "visitedPlaces", "links", "userNotes"];
  const sanitized = {};
  for (const key of allowed) {
    if (updateData[key] !== undefined) sanitized[key] = updateData[key];
  }
  if (updateData.tripId !== undefined) {
    sanitized.trip = updateData.tripId || undefined;
  }

  const journal = await TravelJournal.findOneAndUpdate(
    { _id: journalId, user: userId },
    { $set: sanitized },
    { new: true, runValidators: false }
  );
  if (!journal) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Journal entry not found");
  return journal;
};

export const deleteJournal = async (journalId, userId) => {
  const journal = await TravelJournal.findOneAndDelete({ _id: journalId, user: userId });
  if (!journal) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Journal entry not found");
  return { message: "Journal entry deleted successfully" };
};
