import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

/**
 * Notification Service.
 * Note: no more fake/lazy-seeded sample notifications - notifications are only
 * created by real events (registration, AI trip generated, badge awarded, etc.)
 * so a brand-new user genuinely starts at zero.
 */
export const createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

export const getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
};

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ user: userId, isRead: false });
  return { count };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );
  if (!notification) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Notification not found");
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true, readAt: new Date() } });
  return { message: "All notifications marked as read" };
};
