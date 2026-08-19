import Hotel from "../models/Hotel.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

export const getAllHotels = async (queryParams = {}) => {
  const { destinationId, priceRange, minRating, page = 1, limit = 10 } = queryParams;
  const query = {};
  if (destinationId) query.destination = destinationId;
  if (priceRange) query.priceRange = priceRange;
  if (minRating) query.rating = { $gte: parseFloat(minRating) };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [hotels, count] = await Promise.all([
    Hotel.find(query).populate("destination").skip(skip).limit(parseInt(limit, 10)).sort({ rating: -1 }),
    Hotel.countDocuments(query),
  ]);

  return { hotels, pagination: { total: count, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: Math.ceil(count / limit) } };
};

export const getHotelById = async (id) => {
  const hotel = await Hotel.findById(id).populate("destination");
  if (!hotel) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Hotel not found");
  return hotel;
};
