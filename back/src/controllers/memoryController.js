import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import * as memoryService from "../services/memoryService.js";
import { checkAndAwardMemoryBadge } from "../services/badgeService.js";
import TravelMemory from "../models/TravelMemory.js";

export const updateMemoryController = asyncHandler(async (req, res) => {
  const memory = await memoryService.updateMemory(req.params.id, req.user._id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, memory, "Memory updated successfully"));
});

export const createMemoryController = asyncHandler(async (req, res) => {
  const memory = await memoryService.createTravelMemory(req.user._id, req.body);
  const count = await TravelMemory.countDocuments({ user: req.user._id });
  checkAndAwardMemoryBadge(req.user._id, count).catch(() => {});
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, memory, "Travel memory created successfully"));
});

export const uploadMemoryController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Image file is required");
  }
  const memory = await memoryService.createMemoryFromUpload(req.user._id, req.file, req.body);
  const count = await TravelMemory.countDocuments({ user: req.user._id });
  checkAndAwardMemoryBadge(req.user._id, count).catch(() => {});
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, memory, "Memory photo uploaded successfully"));
});

export const getMemoriesController = asyncHandler(async (req, res) => {
  const memories = await memoryService.getUserMemories(req.user._id, req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, memories, "User memories retrieved successfully"));
});

export const deleteMemoryController = asyncHandler(async (req, res) => {
  const result = await memoryService.deleteMemory(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const createCollectionController = asyncHandler(async (req, res) => {
  const collection = await memoryService.createMemoryCollection(req.user._id, req.body);
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, collection, "Memory collection created successfully"));
});

export const getTravelDnaController = asyncHandler(async (req, res) => {
  const dna = await memoryService.generateUserTravelDna(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, dna, "Travel DNA profile updated and retrieved"));
});
