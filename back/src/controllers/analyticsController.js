import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as analyticsService from "../services/analyticsService.js";

export const getUserAnalyticsController = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getUserAnalytics(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, analytics, "User travel analytics retrieved"));
});
