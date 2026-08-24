import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as mapService from "../services/mapService.js";

export const getCoordinatesController = asyncHandler(async (req, res) => {
  const coordinates = await mapService.getCoordinates(req.query.q);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, coordinates, "Geocoding results retrieved"));
});

export const getNearbyPoisController = asyncHandler(async (req, res) => {
  const { lat, lon, radius, category } = req.query;
  const pois = await mapService.getNearbyPois({ lat, lon, radius, category });
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, pois, "Nearby POIs retrieved successfully"));
});

export const getRouteController = asyncHandler(async (req, res) => {
  const { startLat, startLon, endLat, endLon, mode } = req.query;
  const route = await mapService.getRoute({ startLat, startLon, endLat, endLon, mode });
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, route, "Route calculated successfully"));
});
