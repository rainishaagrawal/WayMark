import User from "../models/User.js";
import TravelDNA from "../models/TravelDNA.js";
import Wishlist from "../models/Wishlist.js";
import { uploadFileToCloud } from "./uploadService.js";
import { findOrCreateDestinationByName } from "./destinationService.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).populate("travelDNA").select("-password -refreshToken");
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User profile not found");
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select("-password -refreshToken");
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User profile not found");
  return user;
};

export const updateAvatar = async (userId, file) => {
  if (!file) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Image file is required");
  const uploaded = await uploadFileToCloud(userId, file);
  const user = await User.findByIdAndUpdate(userId, { $set: { avatar: uploaded.cloudUrl } }, { new: true }).select("-password -refreshToken");
  return user;
};

export const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Current password is incorrect");

  user.password = newPassword;
  await user.save();
  return { message: "Password changed successfully" };
};

export const deleteAccount = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { $set: { isActive: false } }, { new: true });
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  return { message: "Account deactivated successfully" };
};

export const updateWishlist = async (userId, destinationId) => {
  const existingItem = await Wishlist.findOne({ user: userId, destination: destinationId });
  if (existingItem) {
    await Wishlist.findByIdAndDelete(existingItem._id);
    return { message: "Removed from wishlist", inWishlist: false };
  } else {
    await Wishlist.create({ user: userId, destination: destinationId });
    return { message: "Added to wishlist", inWishlist: true };
  }
};

/**
 * Toggle wishlist by destination NAME (used for AI-recommended destinations that
 * may not have a resolved Destination document yet) - resolves/creates the
 * Destination doc under the hood so the item persists and can be browsed later.
 */
export const updateWishlistByName = async (userId, { name, image, reason }) => {
  if (!name) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Destination name is required");

  const destination = await findOrCreateDestinationByName(name, { image });

  const existingItem = await Wishlist.findOne({ user: userId, destination: destination._id });
  if (existingItem) {
    await Wishlist.findByIdAndDelete(existingItem._id);
    return { message: "Removed from wishlist", inWishlist: false };
  }

  await Wishlist.create({ user: userId, destination: destination._id, name, image, reason });
  return { message: "Added to wishlist", inWishlist: true };
};

export const getUserWishlist = async (userId, filters = {}) => {
  const query = { user: userId };
  const items = await Wishlist.find(query).populate("destination").sort({ createdAt: -1 });

  if (filters.q) {
    const regex = new RegExp(filters.q, "i");
    return items.filter(
      (w) => regex.test(w.destination?.name || w.name || "") || regex.test(w.destination?.city || "") || regex.test(w.destination?.country || "")
    );
  }

  return items;
};

export const removeWishlistItem = async (userId, wishlistId) => {
  const item = await Wishlist.findOneAndDelete({ _id: wishlistId, user: userId });
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Wishlist item not found");
  return { message: "Removed from wishlist" };
};

export const updateTravelDNA = async (userId, dnaData) => {
  const travelDna = await TravelDNA.findOneAndUpdate(
    { user: userId },
    { $set: { user: userId, ...dnaData } },
    { new: true, upsert: true, runValidators: true }
  );
  await User.findByIdAndUpdate(userId, { travelDNA: travelDna._id });
  return travelDna;
};
