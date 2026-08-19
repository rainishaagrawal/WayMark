import axios from "axios";
import TravelMemory from "../models/TravelMemory.js";
import MemoryCollection from "../models/MemoryCollection.js";
import TravelDNA from "../models/TravelDNA.js";
import User from "../models/User.js";
import { executeAiPrompt } from "../config/aiConfig.js";
import { buildTravelDnaPrompt } from "../utils/aiPromptHelper.js";
import { uploadFileToCloud } from "./uploadService.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

const unfurlUrlMetadata = async (targetUrl) => {
  try {
    const res = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(targetUrl)}`);
    const data = res.data?.data || {};
    return {
      title: data.title || "",
      description: data.description || "",
      image: data.image?.url || "",
      publisher: data.publisher || "",
    };
  } catch (error) {
    return { title: "", description: "", image: "", publisher: "" };
  }
};

export const createTravelMemory = async (userId, memoryData) => {
  const { type, url, mediaUrl, summary, userThoughts, tags, collectionRef, destinationRef, tripRef, locationName } = memoryData;

  let metadata = memoryData.metadata || {};
  if (url && Object.keys(metadata).length === 0) {
    metadata = await unfurlUrlMetadata(url);
  }

  const memory = await TravelMemory.create({
    user: userId,
    type,
    url,
    mediaUrl: mediaUrl || metadata.image,
    metadata,
    summary: summary || metadata.description || metadata.title,
    userThoughts: userThoughts || "",
    tags,
    collectionRef,
    destinationRef,
    tripRef,
    locationName,
  });

  if (collectionRef) {
    await MemoryCollection.findByIdAndUpdate(collectionRef, { $addToSet: { memories: memory._id } });
  }

  return memory;
};

/**
 * Creates a memory directly from an uploaded image file (multer buffer),
 * pushed to Cloudinary, so the user doesn't have to paste a link every time.
 */
export const createMemoryFromUpload = async (userId, file, { summary, userThoughts, tags, tripRef, locationName }) => {
  const uploaded = await uploadFileToCloud(userId, file);

  return TravelMemory.create({
    user: userId,
    type: "image",
    mediaUrl: uploaded.cloudUrl,
    summary: summary || "",
    userThoughts: userThoughts || "",
    tags: tags || [],
    tripRef: tripRef || undefined,
    locationName: locationName || "",
  });
};

export const getUserMemories = async (userId, filters = {}) => {
  const query = { user: userId };
  if (filters.type) query.type = filters.type;
  if (filters.collectionRef) query.collectionRef = filters.collectionRef;
  if (filters.tripRef) query.tripRef = filters.tripRef;
  if (filters.q) {
    const regex = new RegExp(filters.q, "i");
    query.$or = [{ summary: regex }, { locationName: regex }, { tags: regex }];
  }

  return await TravelMemory.find(query).sort({ createdAt: -1 });
};

export const deleteMemory = async (memoryId, userId) => {
  const memory = await TravelMemory.findOne({ _id: memoryId, user: userId });
  if (!memory) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Memory not found");

  if (memory.collectionRef) {
    await MemoryCollection.findByIdAndUpdate(memory.collectionRef, { $pull: { memories: memory._id } });
  }

  await memory.deleteOne();
  return { message: "Memory deleted successfully" };
};

export const updateMemory = async (memoryId, userId, updateData) => {
  const allowed = ["summary", "userThoughts", "locationName", "tags"];
  const sanitized = {};
  for (const key of allowed) {
    if (updateData[key] !== undefined) sanitized[key] = updateData[key];
  }
  const memory = await TravelMemory.findOneAndUpdate(
    { _id: memoryId, user: userId },
    { $set: sanitized },
    { new: true, runValidators: true }
  );
  if (!memory) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Memory not found");
  return memory;
};

export const createMemoryCollection = async (userId, collectionData) => {
  return await MemoryCollection.create({ user: userId, ...collectionData });
};

export const generateUserTravelDna = async (userId) => {
  const memories = await TravelMemory.find({ user: userId }).limit(20);

  const prompt = buildTravelDnaPrompt(memories);
  const mockFallback = {
    personalityTraits: ["Cultural Explorer", "Foodie"],
    pacePreference: "MODERATE",
    spendingHabit: "BALANCED",
    topInterests: ["History", "Street Food", "Photography"],
    aiGeneratedSummary: "Loves rich historical places and unique culinary experiences.",
    scores: { adventure: 65, culture: 85, relaxation: 50, food: 90 },
  };

  const dnaResult = await executeAiPrompt(prompt, "You are a Travel Profiling AI.", mockFallback);

  const dna = await TravelDNA.findOneAndUpdate(
    { user: userId },
    { $set: { user: userId, ...dnaResult } },
    { upsert: true, new: true }
  );

  await User.findByIdAndUpdate(userId, { travelDNA: dna._id });

  return dna;
};
