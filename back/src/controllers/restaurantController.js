import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as restaurantService from "../services/restaurantService.js";

export const getAllRestaurantsController = asyncHandler(async (req, res) => {
  const result = await restaurantService.getAllRestaurants(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Restaurants retrieved successfully"));
});

export const getRestaurantByIdController = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, restaurant, "Restaurant details retrieved successfully"));
});
