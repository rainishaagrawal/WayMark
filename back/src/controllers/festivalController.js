import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as festivalService from "../services/festivalService.js";

export const getAllFestivalsController = asyncHandler(async (req, res) => {
  const result = await festivalService.getAllFestivals(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Festivals retrieved successfully"));
});

export const searchFestivalsController = asyncHandler(async (req, res) => {
  const result = await festivalService.searchFestivals(req.query.q);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Festival search results retrieved"));
});
