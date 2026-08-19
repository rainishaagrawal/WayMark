import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as hotelService from "../services/hotelService.js";

export const getAllHotelsController = asyncHandler(async (req, res) => {
  const result = await hotelService.getAllHotels(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Hotels retrieved successfully"));
});

export const getHotelByIdController = asyncHandler(async (req, res) => {
  const hotel = await hotelService.getHotelById(req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, hotel, "Hotel details retrieved successfully"));
});
