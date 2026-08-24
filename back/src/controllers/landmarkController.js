import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import * as landmarkService from "../services/landmarkService.js";

export const detectLandmarkController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Image file is required for landmark detection");
  }
  const result = await landmarkService.detectLandmarkFromImage(req.file.buffer, req.file.mimetype);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Landmark detected and info retrieved successfully"));
});
