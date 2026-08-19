import Restaurant from "../models/Restaurant.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

export const getAllRestaurants = async (queryParams = {}) => {
  const { destinationId, cuisineType, isVegetarianFriendly, minRating, page = 1, limit = 10 } = queryParams;
  const query = {};
  if (destinationId) query.destination = destinationId;
  if (cuisineType) query.cuisineType = { $in: [cuisineType] };
  if (isVegetarianFriendly !== undefined) query.isVegetarianFriendly = isVegetarianFriendly === "true";
  if (minRating) query.rating = { $gte: parseFloat(minRating) };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [restaurants, count] = await Promise.all([
    Restaurant.find(query).populate("destination").skip(skip).limit(parseInt(limit, 10)).sort({ rating: -1 }),
    Restaurant.countDocuments(query),
  ]);

  return { restaurants, pagination: { total: count, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: Math.ceil(count / limit) } };
};

export const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findById(id).populate("destination");
  if (!restaurant) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Restaurant not found");
  return restaurant;
};
