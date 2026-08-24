import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as adminService from "../services/adminService.js";

export const getDashboardStatsController = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminDashboardStats();
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, stats, "Admin dashboard statistics retrieved"));
});

export const getAllUsersAdminController = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, users, "All registered users retrieved"));
});

export const getAllTripsAdminController = asyncHandler(async (req, res) => {
  const trips = await adminService.getAllTrips(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, trips, "All platform trips retrieved"));
});

export const getAiLogsAdminController = asyncHandler(async (req, res) => {
  const logs = await adminService.getAiLogs();
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, logs, "AI system usage logs retrieved"));
});
