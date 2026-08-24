import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as authService from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
};

export const registerController = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
  return res
    .status(HTTP_STATUS.CREATED)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(HTTP_STATUS.CREATED, { user, accessToken, refreshToken }, "User registered successfully"));
});

export const loginController = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);
  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(HTTP_STATUS.OK, { user, accessToken, refreshToken }, "User logged in successfully"));
});

export const logoutController = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);
  return res
    .status(HTTP_STATUS.OK)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(HTTP_STATUS.OK, {}, "User logged out successfully"));
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const { accessToken, refreshToken } = await authService.refreshAccessToken(incomingRefreshToken);
  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(HTTP_STATUS.OK, { accessToken, refreshToken }, "Access token refreshed successfully"));
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.query.token || req.body.token);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});

export const googleAuthController = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.googleOAuthPlaceholder(req.body);
  return res
    .status(HTTP_STATUS.OK)
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(HTTP_STATUS.OK, { user, accessToken, refreshToken }, "Google authentication successful"));
});
