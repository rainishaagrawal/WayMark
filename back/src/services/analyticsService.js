import Trip from "../models/Trip.js";
import Expense from "../models/Expense.js";
import Analytics from "../models/Analytics.js";

/**
 * Analytics Service for user travel stats.
 * Recomputed on-demand (GET /analytics/user) and also triggered internally
 * whenever a trip is completed, so the dashboard graphs start empty for a
 * new user and fill in automatically as trips happen.
 */
export const getUserAnalytics = async (userId) => {
  const [trips, expenses] = await Promise.all([
    Trip.find({ user: userId }).populate("destination"),
    Expense.find({ paidBy: userId }),
  ]);

  const totalTripsCount = trips.length;
  const completedTripsCount = trips.filter((t) => t.status === "COMPLETED").length;
  const totalExpensesAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  const countriesSet = new Set();
  const travelTimeline = [];
  const topDestinationsMap = new Map();

  trips.forEach((t) => {
    if (t.destination?.country) {
      countriesSet.add(t.destination.country);
      const current = topDestinationsMap.get(t.destination.country) || 0;
      topDestinationsMap.set(t.destination.country, current + 1);
    }
    travelTimeline.push({ tripId: t._id, year: new Date(t.startDate).getFullYear(), destinationName: t.title });
  });

  const topDestinations = Array.from(topDestinationsMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 4);

  const currentYear = new Date().getFullYear();
  const monthlySpending = Array(12).fill(0);

  const categoryBreakdown = expenses.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      
      const expDate = new Date(item.date);
      if (expDate.getFullYear() === currentYear) {
        monthlySpending[expDate.getMonth()] += item.amount;
      }
      
      return acc;
    },
    { flights: 0, hotels: 0, food: 0, shopping: 0, transport: 0, activities: 0, miscellaneous: 0 }
  );

  const analytics = await Analytics.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        user: userId,
        countriesVisited: Array.from(countriesSet),
        totalTripsCount,
        completedTripsCount,
        totalExpensesAmount,
        categoryBreakdown,
        travelTimeline,
      },
    },
    { upsert: true, new: true }
  );

  // Return extra dynamic fields not stored in the schema
  return { ...analytics.toObject(), monthlySpending, topDestinations };
};
