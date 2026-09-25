import User from "../models/User.js";
import TravelDNA from "../models/TravelDNA.js";
import Wishlist from "../models/Wishlist.js";
import Trip from "../models/Trip.js";
import Destination from "../models/Destination.js";
import { destinationsDB } from "../data/staticRecommendations.js";
import { getDestinationImage } from "../utils/destinationImageHelper.js";

const recommendationCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const getPersonalizedRecommendations = async (userId) => {
  const userIdStr = userId.toString();
  const cached = recommendationCache.get(userIdStr);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  const [user, travelDna, wishlist, history] = await Promise.all([
    User.findById(userId).select("-password"),
    TravelDNA.findOne({ user: userId }),
    Wishlist.find({ user: userId }).populate("destination"),
    Trip.find({ user: userId }).limit(10),
  ]);

  const hasSignal = (user?.travelInterests?.length || 0) > 0 || history.length > 0 || wishlist.length > 0 || !!travelDna;
  
  // Extract user tags for scoring
  let userTags = [];
  if (user?.travelInterests) userTags.push(...user.travelInterests);
  if (travelDna?.topStyles) userTags.push(...travelDna.topStyles);
  if (travelDna?.foodPreference) userTags.push(travelDna.foodPreference);
  
  // Normalize tags for matching
  userTags = userTags.map(t => t.toLowerCase());

  // --- ORGANIC RECOMMENDATION ENGINE ---
  let candidateDestinations = [];
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Look back 30 days for recommendations
    const recentGlobalTrips = await Trip.find({ status: 'PLANNED', createdAt: { $gte: thirtyDaysAgo } })
      .sort({ createdAt: -1 })
      .populate('destination');

    if (recentGlobalTrips.length >= 3) {
      const uniqueDestMap = new Map();
      recentGlobalTrips.forEach(t => {
        if (t.destination && !uniqueDestMap.has(t.destination._id.toString())) {
          const tags = t.aiMeta?.interests || [];
          if (t.aiMeta?.travelStyle) tags.push(t.aiMeta.travelStyle);
          
          uniqueDestMap.set(t.destination._id.toString(), {
            name: t.destination.name,
            tags: tags.map(tag => tag.toLowerCase()),
            reason: t.summary || `Discover the beauty of ${t.destination.name}`,
            hotels: [{ name: 'Recommended Hotel', priceLevel: 'MODERATE' }],
            restaurants: [{ name: 'Local Favorites', cuisine: 'Local' }]
          });
        }
      });
      candidateDestinations = Array.from(uniqueDestMap.values());
    }
  } catch (err) {
    console.warn('Failed to fetch organic trips, falling back to seed data:', err.message);
  }

  // Cold Start Fallback
  if (candidateDestinations.length < 3) {
    candidateDestinations = destinationsDB;
  }
  // --- END ORGANIC ENGINE ---

  // Score each destination
  const scoredDestinations = candidateDestinations
    .filter(dest => {
      // EXCLUDE if user has already visited/planned a trip to this destination
      const hasVisited = history.some(trip => 
        trip.title?.toLowerCase().includes(dest.name.split(',')[0].toLowerCase()) ||
        trip.destination?.name?.toLowerCase().includes(dest.name.split(',')[0].toLowerCase())
      );
      return !hasVisited;
    })
    .map(dest => {
      let score = 0;
      // Base score for trending locations if user has no signal
      if (!hasSignal) score = Math.random() * 50; 
      
      // Match tags
      dest.tags.forEach(tag => {
        if (userTags.some(uTag => uTag.includes(tag) || tag.includes(uTag))) {
          score += 20;
        }
      });

      return { ...dest, score };
    });

  // Sort by score and pick top 3
  scoredDestinations.sort((a, b) => b.score - a.score);
  const top3 = scoredDestinations.slice(0, 3);

  // Format response to match old AI structure
  const recommendations = {
    recommendedDestinations: top3.map(d => ({
      name: d.name,
      reason: d.reason,
      matchingScore: Math.min(Math.round(70 + d.score), 99),
      image: getDestinationImage(d.name)
    })),
    recommendedHotels: top3.map(d => d.hotels[0]),
    recommendedRestaurants: top3.map(d => d.restaurants[0])
  };

  recommendationCache.set(userIdStr, { data: recommendations, timestamp: Date.now() });

  return recommendations;
};

export const getDestinationRecommendations = async (userId, searchParams) => {
  return await getPersonalizedRecommendations(userId);
};
