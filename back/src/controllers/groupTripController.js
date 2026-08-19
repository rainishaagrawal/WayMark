import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as groupTripService from "../services/groupTripService.js";
import { checkAndAwardGroupBadge } from "../services/badgeService.js";

export const createGroupTripController = asyncHandler(async (req, res) => {
  const groupTrip = await groupTripService.createGroupTrip(req.user._id, req.body);
  checkAndAwardGroupBadge(req.user._id).catch(() => {});
  return res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, groupTrip, "Group trip created successfully"));
});

export const joinGroupTripController = asyncHandler(async (req, res) => {
  const result = await groupTripService.joinGroupTripByCode(req.user._id, req.body.inviteCode);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Joined group trip successfully"));
});

export const getGroupTripByIdController = asyncHandler(async (req, res) => {
  const result = await groupTripService.getGroupTripById(req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Group trip details retrieved"));
});

export const listMyGroupTripsController = asyncHandler(async (req, res) => {
  const groupTrips = await groupTripService.listMyGroupTrips(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, groupTrips, "Your group trips retrieved"));
});

export const deleteGroupTripController = asyncHandler(async (req, res) => {
  const result = await groupTripService.deleteGroupTrip(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});
