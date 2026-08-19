import Badge from "../models/Badge.js";
import User from "../models/User.js";
import Trip from "../models/Trip.js";
import { createNotification } from "./notificationService.js";
import { BADGE_CODES } from "../constants.js";

const BADGE_DEFINITIONS = {
  [BADGE_CODES.FIRST_TRIP]: { title: "First Journey", description: "Completed your first trip with VoyageAI!", icon: "🏆" },
  [BADGE_CODES.EXPLORER_3]: { title: "Explorer", description: "Completed 3 trips.", icon: "🧭" },
  [BADGE_CODES.GLOBETROTTER_5]: { title: "Globetrotter", description: "Completed 5 trips.", icon: "🌍" },
  [BADGE_CODES.LEGEND_10]: { title: "Travel Legend", description: "Completed 10 trips.", icon: "👑" },
  [BADGE_CODES.MEMORY_KEEPER]: { title: "Memory Keeper", description: "Saved 10 travel memories.", icon: "📸" },
  [BADGE_CODES.GROUP_LEADER]: { title: "Group Leader", description: "Created your first group trip.", icon: "🤝" },
};

const awardBadgeIfNew = async (userId, code) => {
  const already = await Badge.findOne({ user: userId, code });
  if (already) return null;

  const def = BADGE_DEFINITIONS[code];
  if (!def) return null;

  const badge = await Badge.create({ user: userId, code, ...def });

  await createNotification({
    user: userId,
    type: "BADGE",
    title: `New Badge Unlocked ${def.icon}`,
    message: `You've earned the "${def.title}" badge — ${def.description}`,
  });

  return badge;
};

/**
 * Checks trip-completion-count milestones and awards any newly-earned badges.
 * Called after a trip is marked complete.
 */
export const checkAndAwardTripBadges = async (userId) => {
  const completedCount = await Trip.countDocuments({ user: userId, status: "COMPLETED" });
  await User.findByIdAndUpdate(userId, { tripsCompletedCount: completedCount });

  const newlyAwarded = [];
  if (completedCount >= 1) {
    const b = await awardBadgeIfNew(userId, BADGE_CODES.FIRST_TRIP);
    if (b) newlyAwarded.push(b);
  }
  if (completedCount >= 3) {
    const b = await awardBadgeIfNew(userId, BADGE_CODES.EXPLORER_3);
    if (b) newlyAwarded.push(b);
  }
  if (completedCount >= 5) {
    const b = await awardBadgeIfNew(userId, BADGE_CODES.GLOBETROTTER_5);
    if (b) newlyAwarded.push(b);
  }
  if (completedCount >= 10) {
    const b = await awardBadgeIfNew(userId, BADGE_CODES.LEGEND_10);
    if (b) newlyAwarded.push(b);
  }

  return newlyAwarded;
};

export const checkAndAwardMemoryBadge = async (userId, memoryCount) => {
  if (memoryCount >= 10) {
    return awardBadgeIfNew(userId, BADGE_CODES.MEMORY_KEEPER);
  }
  return null;
};

export const checkAndAwardGroupBadge = async (userId) => {
  return awardBadgeIfNew(userId, BADGE_CODES.GROUP_LEADER);
};

export const getUserBadges = async (userId) => {
  return Badge.find({ user: userId }).sort({ awardedAt: -1 });
};
