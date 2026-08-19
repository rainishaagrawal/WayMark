import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    type: {
      type: String,
      enum: [
        "trip_reminder",
        "packing_reminder",
        "festival_alert",
        "weather_alert",
        "ai_suggestion",
        "SYSTEM",
        "TRIP",
        "ITINERARY",
        "PRICE_ALERT",
        "BADGE",
        "GROUP",
      ],
      required: [true, "Notification type is required"],
      index: true,
    },
    title: { type: String, required: [true, "Notification title is required"], trim: true },
    message: { type: String, required: [true, "Notification message is required"] },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
