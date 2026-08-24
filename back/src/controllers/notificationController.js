import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants.js";
import * as notificationService from "../services/notificationService.js";

export const getUserNotificationsController = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, notifications, "User notifications retrieved"));
});

export const getUnreadCountController = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Unread notification count retrieved"));
});

export const markNotificationReadController = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, notification, "Notification marked as read"));
});

export const markAllReadController = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, result.message));
});
