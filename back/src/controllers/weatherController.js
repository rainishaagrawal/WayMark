import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as weatherService from "../services/weatherService.js";

export const getCurrentWeatherController = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;
  const weather = await weatherService.getCurrentWeather({ lat, lon });
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, weather, "Current weather retrieved successfully"));
});

export const getWeatherForecastController = asyncHandler(async (req, res) => {
  const { lat, lon, days } = req.query;
  const forecast = await weatherService.getWeatherForecast({ lat, lon, days });
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, forecast, "Weather forecast retrieved successfully"));
});
