import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_URL = "https://router.project-osrm.org/route/v1";

const axiosConfig = { headers: { "User-Agent": "WayMark-Backend/1.0 (contact@WayMark.com)" } };

const mapCache = new Map();
const MAP_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days (Map data rarely changes)

export const getCoordinates = async (query) => {
  if (!query) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Search query is required");
  
  const cacheKey = `coord_${query}`;
  const cached = mapCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < MAP_CACHE_TTL)) return cached.data;

  try {
    const response = await axios.get(NOMINATIM_URL, { ...axiosConfig, params: { q: query, format: "json", limit: 5 } });
    const result = response.data.map((place) => ({
      placeId: place.place_id,
      displayName: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      type: place.type,
      category: place.category,
    }));
    mapCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("❌ Geocoding API Error:", error.message);
    throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Failed to geocode address");
  }
};

export const getNearbyPois = async ({ lat, lon, radius = 5000, category = "tourism" }) => {
  if (!lat || !lon) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Latitude and Longitude are required");
  
  const cacheKey = `pois_${lat}_${lon}_${radius}_${category}`;
  const cached = mapCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < MAP_CACHE_TTL)) return cached.data;

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      ...axiosConfig,
      params: { lat, lon, format: "json", addressdetails: 1 },
    });
    const result = {
      center: { lat: parseFloat(lat), lon: parseFloat(lon) },
      address: response.data.address || {},
      displayName: response.data.display_name,
      radius,
      category,
    };
    mapCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("❌ Nearby POI API Error:", error.message);
    throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Failed to fetch nearby POIs");
  }
};

export const getRoute = async ({ startLat, startLon, endLat, endLon, mode = "driving" }) => {
  if (!startLat || !startLon || !endLat || !endLon) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Start and End coordinates are required");
  
  const cacheKey = `route_${startLat}_${startLon}_${endLat}_${endLon}_${mode}`;
  const cached = mapCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < MAP_CACHE_TTL)) return cached.data;

  try {
    const osrmMode = mode === "walking" ? "foot" : mode === "cycling" ? "bike" : "driving";
    const url = `${OSRM_URL}/${osrmMode}/${startLon},${startLat};${endLon},${endLat}`;
    const response = await axios.get(url, { params: { overview: "full", geometries: "geojson" } });
    const route = response.data?.routes?.[0] || {};
    const result = { distanceMeters: route.distance, durationSeconds: route.duration, geometry: route.geometry };
    mapCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("❌ OSRM Routing Error:", error.message);
    throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Failed to calculate route");
  }
};
