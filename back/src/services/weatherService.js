import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export const getCurrentWeather = async ({ lat, lon }) => {
  if (!lat || !lon) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Latitude and Longitude are required");
  try {
    const response = await axios.get(OPEN_METEO_BASE_URL, {
      params: { latitude: lat, longitude: lon, current_weather: true, hourly: "relativehumidity_2m,rain,windspeed_10m" },
    });
    const data = response.data;
    return {
      temperature: data.current_weather?.temperature,
      windSpeed: data.current_weather?.windspeed,
      windDirection: data.current_weather?.winddirection,
      weatherCode: data.current_weather?.weathercode,
      humidity: data.hourly?.relativehumidity_2m?.[0] || 0,
      rain: data.hourly?.rain?.[0] || 0,
      time: data.current_weather?.time,
    };
  } catch (error) {
    console.error("❌ Weather API Error:", error.message);
    throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Failed to fetch weather data from Open-Meteo");
  }
};

export const getWeatherForecast = async ({ lat, lon, days = 7 }) => {
  if (!lat || !lon) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Latitude and Longitude are required");
  try {
    const response = await axios.get(OPEN_METEO_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: "weathercode,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max",
        timezone: "auto",
        forecast_days: days,
      },
    });
    const daily = response.data?.daily || {};
    const forecast = (daily.time || []).map((date, index) => ({
      date,
      weatherCode: daily.weathercode?.[index],
      tempMax: daily.temperature_2m_max?.[index],
      tempMin: daily.temperature_2m_min?.[index],
      rainSum: daily.rain_sum?.[index],
      windSpeedMax: daily.windspeed_10m_max?.[index],
    }));
    return { forecast };
  } catch (error) {
    console.error("❌ Weather Forecast API Error:", error.message);
    throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Failed to fetch weather forecast data");
  }
};
