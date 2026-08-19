import PackingChecklist from "../models/PackingChecklist.js";
import Trip from "../models/Trip.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

export const getTripChecklist = async (tripId, userId) => {
  let checklist = await PackingChecklist.findOne({ trip: tripId, user: userId });
  if (!checklist) return null; // Let controller/frontend decide to show "create checklist" CTA
  return checklist;
};

export const createTripChecklist = async (tripId, userId, initialItems = []) => {
  const trip = await Trip.findOne({ _id: tripId, user: userId });
  if (!trip) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Trip not found");

  const existing = await PackingChecklist.findOne({ trip: tripId, user: userId });
  if (existing) return existing;

  return PackingChecklist.create({
    trip: tripId,
    user: userId,
    items: initialItems.length
      ? initialItems
      : [
          { item: "Passport / ID", category: "Documents", isPacked: false },
          { item: "Phone Charger", category: "Electronics", isPacked: false },
        ],
    isAiGenerated: false,
  });
};

export const listUserChecklists = async (userId) => {
  return PackingChecklist.find({ user: userId }).populate("trip", "title destinationName bannerImage startDate endDate").sort({ createdAt: -1 });
};

export const addChecklistItem = async (tripId, userId, { item, category }) => {
  let checklist = await PackingChecklist.findOne({ trip: tripId, user: userId });
  if (!checklist) {
    checklist = await PackingChecklist.create({ trip: tripId, user: userId, items: [] });
  }
  checklist.items.push({ item, category: category || "Miscellaneous", isPacked: false });
  await checklist.save();
  return checklist;
};

export const toggleChecklistItem = async (checklistId, itemId) => {
  const checklist = await PackingChecklist.findById(checklistId);
  if (!checklist) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Packing checklist not found");
  const item = checklist.items.id(itemId);
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Checklist item not found");
  item.isPacked = !item.isPacked;
  await checklist.save();
  return checklist;
};

export const removeChecklistItem = async (checklistId, itemId) => {
  const checklist = await PackingChecklist.findById(checklistId);
  if (!checklist) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Packing checklist not found");
  checklist.items.id(itemId)?.deleteOne();
  await checklist.save();
  return checklist;
};

export const deleteChecklist = async (checklistId, userId) => {
  const checklist = await PackingChecklist.findOne({ _id: checklistId, user: userId });
  if (!checklist) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Packing checklist not found");
  await checklist.deleteOne();
  return { message: "Packing checklist deleted successfully" };
};
