import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import * as userService from "../services/userService.js";

export const getUserProfileController = asyncHandler(async (req, res) => {
  const profile = await userService.getUserProfile(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, profile, "User profile retrieved successfully"));
});

export const updateUserProfileController = asyncHandler(async (req, res) => {
  const updatedProfile = await userService.updateUserProfile(req.user._id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, updatedProfile, "User profile updated successfully"));
});

export const uploadAvatarController = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Image file is required");
  const user = await userService.updateAvatar(req.user._id, req.file);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, user, "Profile photo updated successfully"));
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const result = await userService.changePassword(req.user._id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const deleteAccountController = asyncHandler(async (req, res) => {
  const result = await userService.deleteAccount(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const toggleWishlistController = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;
  const result = await userService.updateWishlist(req.user._id, destinationId);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const toggleWishlistByNameController = asyncHandler(async (req, res) => {
  const result = await userService.updateWishlistByName(req.user._id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const getWishlistController = asyncHandler(async (req, res) => {
  const wishlist = await userService.getUserWishlist(req.user._id, req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, wishlist, "Wishlist retrieved successfully"));
});

export const removeWishlistItemController = asyncHandler(async (req, res) => {
  const result = await userService.removeWishlistItem(req.user._id, req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const updateTravelDNAController = asyncHandler(async (req, res) => {
  const dna = await userService.updateTravelDNA(req.user._id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, dna, "Travel DNA profile updated successfully"));
});
