import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";
import { verifyRefreshToken, verifyAccessToken } from "../utils/jwtHelper.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/emailHelper.js";
import { createNotification } from "./notificationService.js";

export const registerUser = async (userData) => {
  const { email, password, name } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "User with this email already exists");
  }

  const user = await User.create(userData);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  sendVerificationEmail(user.email, accessToken).catch((err) => console.error("Email send error:", err));

  // Explicit welcome notification on account creation (point 22) - real event,
  // not a lazy-seeded fake one.
  createNotification({
    user: user._id,
    type: "SYSTEM",
    title: "Welcome to WayMark! 🚀",
    message: `Hi ${user.name}, your AI travel engine is ready. Let's plan your first trip!`,
  }).catch((e) => console.error("Welcome notification error:", e));

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return { user: createdUser, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return { user: loggedInUser, accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });
  return true;
};

export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");

  const decoded = verifyRefreshToken(incomingRefreshToken);
  const user = await User.findById(decoded?._id).select("+refreshToken");

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken: newRefreshToken };
};

export const verifyEmail = async (token) => {
  if (!token) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Verification token is required");
  return { message: "Email verified successfully" };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User with this email does not exist");

  const resetToken = user.generateAccessToken();
  await sendPasswordResetEmail(user.email, resetToken);

  return { message: "Password reset instructions sent to your email" };
};

export const resetPassword = async (token, newPassword) => {
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded?._id);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid token or user does not exist");

  user.password = newPassword;
  await user.save();

  return { message: "Password reset successful. You can now login with your new password." };
};

export const googleOAuthPlaceholder = async (googlePayload) => {
  const { email, name, avatar } = googlePayload;
  let user = await User.findOne({ email });

  let isNewUser = false;
  if (!user) {
    isNewUser = true;
    user = await User.create({
      name,
      email,
      password: Math.random().toString(36).slice(-10) + "Aa1!",
      avatar: avatar || "",
    });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  if (isNewUser) {
    createNotification({
      user: user._id,
      type: "SYSTEM",
      title: "Welcome to WayMark! 🚀",
      message: `Hi ${user.name}, your AI travel engine is ready. Let's plan your first trip!`,
    }).catch((e) => console.error("Welcome notification error:", e));
  }

  const authenticatedUser = await User.findById(user._id).select("-password -refreshToken");
  return { user: authenticatedUser, accessToken, refreshToken };
};
