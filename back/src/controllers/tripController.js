import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as tripService from "../services/tripService.js";

export const listTripsController = asyncHandler(async (req, res) => {
  const trips = await tripService.listUserTrips(req.user._id, req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, trips, "Trips retrieved successfully"));
});

export const getTripController = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, trip, "Trip details retrieved successfully"));
});

export const deleteTripController = asyncHandler(async (req, res) => {
  const result = await tripService.deleteTrip(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const updateTripBannerController = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTripBanner(req.params.id, req.user._id, req.body.bannerImage);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, trip, "Trip banner updated successfully"));
});

export const updateTripNotesController = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTripNotes(req.params.id, req.user._id, req.body.notes);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, trip, "Trip notes updated successfully"));
});

export const updateTripDaysController = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTripDays(req.params.id, req.user._id, req.body.tripDays);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, trip, "Trip itinerary updated successfully"));
});

export const completeTripController = asyncHandler(async (req, res) => {
  const result = await tripService.completeTrip(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Trip marked as completed"));
});
