import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as recommendationService from "../services/recommendationService.js";

export const getPersonalizedRecommendationsController = asyncHandler(async (req, res) => {
  const recommendations = await recommendationService.getPersonalizedRecommendations(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, recommendations, "Personalized recommendations retrieved"));
});

export const getDestinationRecommendationsController = asyncHandler(async (req, res) => {
  const recommendations = await recommendationService.getDestinationRecommendations(req.user._id, req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, recommendations, "Destination recommendations retrieved"));
});
