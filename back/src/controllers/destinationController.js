import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as destinationService from "../services/destinationService.js";

export const getAllDestinationsController = asyncHandler(async (req, res) => {
  const result = await destinationService.getAllDestinations(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Destinations retrieved successfully"));
});

export const getDestinationByIdController = asyncHandler(async (req, res) => {
  const destination = await destinationService.getDestinationById(req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, destination, "Destination details retrieved successfully"));
});

export const searchDestinationsController = asyncHandler(async (req, res) => {
  const destinations = await destinationService.searchDestinations(req.query.q);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, destinations, "Destination search results retrieved"));
});
