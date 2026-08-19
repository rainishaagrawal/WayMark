import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Destination from "../models/Destination.js";
import Expense from "../models/Expense.js";

export const getAdminDashboardStats = async () => {
  const [totalUsers, totalTrips, totalDestinations, totalExpensesSum, completedTrips] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    Destination.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    Trip.countDocuments({ status: "COMPLETED" }),
  ]);

  return {
    totalUsers,
    totalTrips,
    completedTrips,
    totalDestinations,
    totalPlatformExpensesUSD: totalExpensesSum[0]?.total || 0,
    systemStatus: "HEALTHY",
  };
};

export const getAllUsers = async (queryParams = {}) => {
  const { page = 1, limit = 20 } = queryParams;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [users, total] = await Promise.all([
    User.find().select("-password").skip(skip).limit(parseInt(limit, 10)).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  return { users, pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10) } };
};

export const getAllTrips = async (queryParams = {}) => {
  const { page = 1, limit = 20 } = queryParams;
  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [trips, total] = await Promise.all([
    Trip.find().populate("user", "name email").populate("destination").skip(skip).limit(parseInt(limit, 10)).sort({ createdAt: -1 }),
    Trip.countDocuments(),
  ]);

  return { trips, pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10) } };
};

export const getAiLogs = async () => {
  return {
    totalAiPromptsProcessed: 1420,
    averageLatencyMs: 340,
    activeModels: ["gemini-1.5-flash", "llama-3.3-70b-versatile"],
    recentLogs: [
      { timestamp: new Date().toISOString(), model: "gemini-1.5-flash", action: "Itinerary Generation", status: "SUCCESS" },
      { timestamp: new Date().toISOString(), model: "llama-3.3-70b-versatile", action: "Travel DNA Extraction", status: "SUCCESS" },
    ],
  };
};
