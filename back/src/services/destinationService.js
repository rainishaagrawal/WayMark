import Destination from "../models/Destination.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";
import { getDestinationImage } from "../utils/destinationImageHelper.js";

export const getAllDestinations = async (queryParams = {}) => {
  const { page = 1, limit = 10, category, country, minRating } = queryParams;

  const query = {};
  if (category) query.category = { $in: [category] };
  if (country) query.country = new RegExp(country, "i");
  if (minRating) query.averageRating = { $gte: parseFloat(minRating) };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [destinations, count] = await Promise.all([
    Destination.find(query).skip(skip).limit(parseInt(limit, 10)).sort({ averageRating: -1 }),
    Destination.countDocuments(query),
  ]);

  return {
    destinations,
    pagination: { total: count, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: Math.ceil(count / limit) },
  };
};

export const getDestinationById = async (id) => {
  const destination = await Destination.findById(id);
  if (!destination) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Destination not found");
  return destination;
};

export const searchDestinations = async (keyword) => {
  if (!keyword) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Search keyword is required");
  const regex = new RegExp(keyword, "i");
  const destinations = await Destination.find({
    $or: [{ name: regex }, { city: regex }, { country: regex }, { description: regex }],
  }).limit(20);
  return destinations;
};

/**
 * Finds an existing Destination document by fuzzy name match, or creates a new
 * lightweight one on the fly. Used by AI trip generation and wishlist-by-name
 * so every AI-recommended place resolves to a real, reusable Destination doc.
 */
export const findOrCreateDestinationByName = async (destinationName, { lat, lon, category = [], image } = {}) => {
  if (!destinationName) return null;

  const cityName = destinationName.split(",")[0].trim();
  let existing = await Destination.findOne({
    $or: [{ name: new RegExp(`^${cityName}$`, "i") }, { city: new RegExp(`^${cityName}$`, "i") }],
  });

  if (existing) return existing;

  const resolvedImage = image || getDestinationImage(destinationName);

  return Destination.create({
    name: destinationName,
    city: cityName,
    country: destinationName.split(",")[1]?.trim() || "International",
    location: { type: "Point", coordinates: [lon || 0, lat || 0] },
    description: `Explore ${destinationName}, curated by WayMark.`,
    category: Array.isArray(category) ? category : [category].filter(Boolean),
    images: [resolvedImage],
  });
};
