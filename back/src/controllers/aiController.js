import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as aiService from "../services/aiService.js";

export const planTripController = asyncHandler(async (req, res) => {
  const result = await aiService.generateTripItinerary(req.user._id, req.body);
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, result, "AI Trip Itinerary generated successfully"));
});

export const generateJournalController = asyncHandler(async (req, res) => {
  const journal = await aiService.generateTravelJournal(req.user._id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, journal, "AI Travel Journal generated successfully"));
});

export const createManualTripController = asyncHandler(async (req, res) => {
  const trip = await aiService.createManualTrip(req.user._id, req.body);
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, trip, "Manual Trip created successfully"));
});

export const aiChatController = asyncHandler(async (req, res) => {
  const response = await aiService.aiChatAssistant(req.body.message, req.body.context);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, response, "AI Assistant response received"));
});
