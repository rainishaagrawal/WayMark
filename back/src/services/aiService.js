import { executeAiPrompt } from "../config/aiConfig.js";
import { buildItineraryPrompt, buildJournalPrompt } from "../utils/aiPromptHelper.js";
import { getCurrentWeather } from "./weatherService.js";
import { getCoordinates } from "./mapService.js";
import { findOrCreateDestinationByName } from "./destinationService.js";
import { getDestinationImage } from "../utils/destinationImageHelper.js";
import { nudgeTravelDnaFromTrip } from "./dnaService.js";
import { markUserHasCreatedFirstTrip } from "./tripService.js";
import Trip from "../models/Trip.js";
import TripDay from "../models/TripDay.js";
import TravelJournal from "../models/TravelJournal.js";
import PackingChecklist from "../models/PackingChecklist.js";
import { createNotification } from "./notificationService.js";

/**
 * AI Trip Planner Service.
 * Combines weather APIs, map geocoding, and AI to generate multi-day trip plans.
 * Every generated trip gets a destination-specific banner image (unless the
 * user later uploads a custom one) and feeds the Travel DNA engine based on
 * the interests/style used to generate it.
 */
export const generateTripItinerary = async (userId, tripData) => {
  const {
    destinationName,
    startDate,
    endDate,
    budget = "MODERATE",
    interests = [],
    foodPref = "ANYTHING",
    travelStyle = "SOLO",
  } = tripData;

  let coords = null;
  let weatherInfo = null;

  try {
    const coordResults = await getCoordinates(destinationName);
    if (coordResults?.length > 0) {
      coords = { lat: coordResults[0].lat, lon: coordResults[0].lon };
      weatherInfo = await getCurrentWeather(coords);
    }
  } catch (err) {
    console.warn("Weather/Geocoding context skipped:", err.message);
  }

  let destination = null;
  try {
    destination = await findOrCreateDestinationByName(destinationName, {
      lat: coords?.lat,
      lon: coords?.lon,
      category: Array.isArray(interests) ? interests : [interests],
    });
  } catch (destErr) {
    console.warn("Destination auto-resolution skipped:", destErr.message);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
  const numDays = Math.min(Math.max(diffDays, 1), 14);

  const prompt = buildItineraryPrompt({ destination: destinationName, days: numDays, budget, interests, foodPref, travelStyle });

  const mockFallback = {
    tripTitle: `Exploring ${destinationName}`,
    summary: `A customized ${numDays}-day itinerary exploring the best of ${destinationName}, tailored to ${
      Array.isArray(interests) ? interests.join(" & ") : interests
    } interests.`,
    safetyTips: ["Keep emergency contacts handy.", "Use licensed taxis.", "Stay hydrated and watch local weather advisories."],
    packingItems: [
      { item: "Comfortable Walking Shoes", category: "Clothing" },
      { item: "Universal Adapter", category: "Electronics" },
      { item: "Reusable Water Bottle", category: "Miscellaneous" },
    ],
    estimatedTotalBudgetUSD: budget === "LUXURY" ? 4200 : budget === "ULTRA_LUXURY" ? 7500 : budget === "BUDGET" ? 900 : 2200,
    days: Array.from({ length: numDays }, (_, i) => ({
      dayNumber: i + 1,
      title: `Day ${i + 1}: Discovering ${destinationName}`,
      morning: [{ title: `Explore central ${destinationName.split(",")[0]}`, description: "Visit a signature local landmark", estimatedCost: 25 }],
      afternoon: [{ title: "Local market & cultural stop", description: "Savor regional street food and browse local crafts", estimatedCost: 35 }],
      evening: [{ title: "Sunset & dinner", description: "Relax at a scenic spot with a local dinner", estimatedCost: 40 }],
    })),
  };

  const aiResult = await executeAiPrompt(prompt, "You are a professional travel planner. Always tailor content specifically to the named destination.", mockFallback);

  const bannerImage = getDestinationImage(destinationName);

  const parseBudget = (val) => {
    const num = parseInt(String(val).replace(/[^0-9]/g, ""));
    return isNaN(num) ? 1000 : num;
  };

  const normalizeActivities = (activities) => {
    if (!Array.isArray(activities)) return [];
    return activities.map(act => {
      if (typeof act === "string") return { title: act };
      if (typeof act === "object" && act !== null) {
        return {
          title: act.title || act.name || act.activity || "Activity",
          description: act.description || "",
          estimatedCost: parseBudget(act.estimatedCost || 0)
        };
      }
      return { title: "Activity" };
    });
  };

  const trip = await Trip.create({
    user: userId,
    title: aiResult.tripTitle || `Trip to ${destinationName}`,
    destinationName,
    destination: destination?._id || null,
    startDate: start,
    endDate: end,
    budget: { totalAmount: parseBudget(aiResult.estimatedTotalBudgetUSD), spentAmount: 0 },
    status: "PLANNED",
    notes: aiResult.summary || "",
    bannerImage,
    isCustomBanner: false,
    isAiGenerated: true,
    aiMeta: {
      interests: Array.isArray(interests) ? interests : [interests].filter(Boolean),
      travelStyle,
      foodPref,
      budgetTier: budget,
    },
  });

  const createdTripDays = [];
  let daysArray = [];
  if (Array.isArray(aiResult)) {
    daysArray = aiResult;
  } else if (Array.isArray(aiResult.days)) {
    daysArray = aiResult.days;
  }
  for (let i = 0; i < daysArray.length; i++) {
    const day = daysArray[i];
    const dNum = day.dayNumber || (i + 1);
    const tripDay = await TripDay.create({
      trip: trip._id,
      dayNumber: dNum,
      date: new Date(start.getTime() + (dNum - 1) * 86400000),
      morning: normalizeActivities(day.morning),
      afternoon: normalizeActivities(day.afternoon),
      evening: normalizeActivities(day.evening),
    });
    createdTripDays.push(tripDay._id);
  }

  trip.tripDays = createdTripDays;
  await trip.save();

  if (aiResult.packingItems) {
    const validCategories = ["Clothing", "Toiletries", "Electronics", "Documents", "Medication", "Miscellaneous"];
    const normalizedItems = Array.isArray(aiResult.packingItems) ? aiResult.packingItems.map(item => {
      if (typeof item === 'string') return { item, category: "Miscellaneous" };
      if (typeof item === 'object' && item !== null) {
        return {
          item: item.item || item.name || "Packing Item",
          category: validCategories.includes(item.category) ? item.category : "Miscellaneous"
        };
      }
      return { item: "Packing Item", category: "Miscellaneous" };
    }) : [];

    await PackingChecklist.create({ trip: trip._id, user: userId, items: normalizedItems, isAiGenerated: true });
  }

  await markUserHasCreatedFirstTrip(userId);

  // Feed the Travel DNA engine based on what this AI trip was generated for
  nudgeTravelDnaFromTrip(userId, { interests, travelStyle, budgetTier: budget, weight: 1 }).catch((e) =>
    console.error("DNA nudge error:", e)
  );

  try {
    await createNotification({
      user: userId,
      type: "ITINERARY",
      title: "AI Itinerary Ready 🎉",
      message: `Your custom ${numDays}-day AI trip for ${destinationName} is ready to explore.`,
    });
  } catch (e) {}

  const standardizedItinerary = Array.isArray(aiResult) ? { days: aiResult } : aiResult;

  return { trip, itinerary: standardizedItinerary, weather: weatherInfo };
};

/**
 * Manual Trip Creator Service.
 */
export const createManualTrip = async (userId, tripData) => {
  const { title, destinationName, startDate, endDate, budgetAmount, notes, bannerImage } = tripData;

  let destination = null;
  try {
    if (destinationName) destination = await findOrCreateDestinationByName(destinationName);
  } catch (e) {
    console.warn("Destination auto-resolution skipped:", e.message);
  }

  const trip = await Trip.create({
    user: userId,
    title: title || `Trip to ${destinationName || "New Destination"}`,
    destinationName: destinationName || "",
    destination: destination?._id || null,
    startDate: new Date(startDate || Date.now()),
    endDate: new Date(endDate || Date.now() + 7 * 86400000),
    budget: { totalAmount: parseFloat(budgetAmount) || 1000, spentAmount: 0 },
    status: "PLANNED",
    notes: notes || "",
    bannerImage: bannerImage || getDestinationImage(destinationName || ""),
    isCustomBanner: !!bannerImage,
    isAiGenerated: false,
  });

  await markUserHasCreatedFirstTrip(userId);

  try {
    await createNotification({
      user: userId,
      type: "TRIP",
      title: "Trip Created 🗺️",
      message: `Your trip "${trip.title}" has been created.`,
    });
  } catch (e) {}

  return trip;
};

/**
 * AI Travel Journal Generator.
 */
export const generateTravelJournal = async (userId, { tripId }) => {
  const trip = await Trip.findById(tripId).populate("tripDays");
  if (!trip) throw new Error("Trip not found");

  const prompt = buildJournalPrompt({ tripTitle: trip.title, notes: trip.notes, days: trip.tripDays });

  const mockFallback = {
    summary: `A heartwarming journey through ${trip.title}, filled with beautiful sights and rich memories.`,
    highlights: ["Scenic morning walks", "Exquisite local cuisine", "Stunning architecture"],
    visitedPlaces: ["City Center", "Local Market", "Cultural Quarter"],
  };

  const aiResult = await executeAiPrompt(prompt, "You are a travel journalist.", mockFallback);

  const journal = await TravelJournal.create({
    trip: tripId,
    user: userId,
    title: `${trip.title} - Journal`,
    summary: aiResult.summary,
    highlights: aiResult.highlights,
    visitedPlaces: aiResult.visitedPlaces,
    coverImage: trip.bannerImage,
    isAiGenerated: true,
    generatedAt: new Date(),
  });

  return journal;
};

/**
 * AI Chat Assistant for Travel Advice.
 */
export const aiChatAssistant = async (message, context = {}) => {
  const prompt = `User Ask: "${message}". Context: ${JSON.stringify(context)}. Provide helpful, concise travel recommendations in JSON format: {"reply": "String", "suggestions": ["String"]}`;

  const mockFallback = {
    reply: "I am your WayMark assistant! How can I help you plan your next adventure?",
    suggestions: ["Find top hotels", "Check local weather", "Generate a 3-day itinerary"],
  };

  return await executeAiPrompt(prompt, "You are WayMark Chatbot.", mockFallback);
};
