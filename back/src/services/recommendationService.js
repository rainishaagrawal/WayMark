import User from "../models/User.js";
import TravelDNA from "../models/TravelDNA.js";
import Wishlist from "../models/Wishlist.js";
import Trip from "../models/Trip.js";
import { executeAiPrompt } from "../config/aiConfig.js";
import { buildRecommendationPrompt } from "../utils/aiPromptHelper.js";
import { getDestinationImage } from "../utils/destinationImageHelper.js";

export const getPersonalizedRecommendations = async (userId) => {
  const [user, travelDna, wishlist, history] = await Promise.all([
    User.findById(userId).select("-password"),
    TravelDNA.findOne({ user: userId }),
    Wishlist.find({ user: userId }).populate("destination"),
    Trip.find({ user: userId }).limit(10),
  ]);

  // A brand-new user with no interests, no history, and no wishlist yet gets no
  // recommendations until they interact with the app (create a trip, save DNA, etc.)
  const hasSignal = (user?.travelInterests?.length || 0) > 0 || history.length > 0 || wishlist.length > 0 || !!travelDna;
  if (!hasSignal) {
    return { recommendedDestinations: [], recommendedHotels: [], recommendedRestaurants: [] };
  }

  const prompt = buildRecommendationPrompt({
    userProfile: { budget: user?.budgetPreference, interests: user?.travelInterests },
    travelDna,
    wishlist: wishlist.map((w) => w.destination?.name || w.name),
    history: history.map((h) => h.title),
  });

  const mockFallback = {
    recommendedDestinations: [
      { name: "Kyoto, Japan", reason: "Matches your high culture and photography interests", matchingScore: 96 },
      { name: "Santorini, Greece", reason: "Perfect for romantic relaxation and scenic views", matchingScore: 92 },
      { name: "Cusco, Peru", reason: "Great adventure score alignment with historic hiking trails", matchingScore: 88 },
    ],
    recommendedHotels: [{ name: "Grand Heritage Inn", reason: "Top rated boutique hotel near city center", priceLevel: "MODERATE" }],
    recommendedRestaurants: [{ name: "Trattoria Del Arte", reason: "Authentic cuisine matching your foodie preferences", cuisine: "Italian" }],
  };

  const recommendations = await executeAiPrompt(prompt, "You are a Personalized AI Recommendation Engine.", mockFallback);

  // Ensure every recommended destination has an image for the wishlist/explore UI
  if (Array.isArray(recommendations.recommendedDestinations)) {
    recommendations.recommendedDestinations = recommendations.recommendedDestinations.map((d) => ({
      ...d,
      image: d.image || getDestinationImage(d.name || ""),
    }));
  }

  return recommendations;
};

export const getDestinationRecommendations = async (userId, searchParams) => {
  return await getPersonalizedRecommendations(userId);
};
