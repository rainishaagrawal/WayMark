import TravelDNA from "../models/TravelDNA.js";
import User from "../models/User.js";

/**
 * Lightweight, deterministic Travel DNA nudger driven by real trip activity
 * (as opposed to memoryService.generateUserTravelDna which is AI-driven from
 * saved memories). Called whenever the user generates or completes a trip,
 * so "Travel DNA" starts empty/default for a new user and gradually shifts
 * based on what they actually plan and complete - point 20 of the spec.
 */

const INTEREST_SCORE_MAP = {
  culture: { culture: 12 },
  cultural: { culture: 12 },
  history: { culture: 10 },
  historical: { culture: 10 },
  adventure: { adventure: 14 },
  hiking: { adventure: 12 },
  nature: { adventure: 8, relaxation: 4 },
  gastronomy: { food: 14 },
  food: { food: 12 },
  culinary: { food: 12 },
  relaxation: { relaxation: 14 },
  wellness: { relaxation: 12 },
  spa: { relaxation: 10 },
  beach: { relaxation: 8 },
  luxury: { relaxation: 4, food: 4 },
  nightlife: { adventure: 6 },
  photography: { culture: 6, adventure: 4 },
};

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

export const nudgeTravelDnaFromTrip = async (userId, { interests = [], travelStyle, budgetTier, weight = 1 } = {}) => {
  const existing = await TravelDNA.findOne({ user: userId });

  const baseScores = existing?.scores || { adventure: 50, culture: 50, relaxation: 50, food: 50 };
  const scores = { ...baseScores };
  const topInterestsSet = new Set(existing?.topInterests || []);

  const normalizedInterests = (Array.isArray(interests) ? interests : [interests])
    .filter(Boolean)
    .map((i) => String(i).toLowerCase().trim());

  normalizedInterests.forEach((interest) => {
    topInterestsSet.add(interest.charAt(0).toUpperCase() + interest.slice(1));
    const matchKey = Object.keys(INTEREST_SCORE_MAP).find((k) => interest.includes(k));
    if (matchKey) {
      const deltas = INTEREST_SCORE_MAP[matchKey];
      Object.entries(deltas).forEach(([axis, delta]) => {
        scores[axis] = clamp((scores[axis] ?? 50) + delta * weight);
      });
    }
  });

  let spendingHabit = existing?.spendingHabit || "BALANCED";
  if (budgetTier === "LUXURY" || budgetTier === "ULTRA_LUXURY") spendingHabit = "LUXURY";
  else if (budgetTier === "BUDGET") spendingHabit = "SAVER";

  const personalityTraits = new Set(existing?.personalityTraits || []);
  if (scores.culture >= 75) personalityTraits.add("Cultural Explorer");
  if (scores.adventure >= 75) personalityTraits.add("Thrill Seeker");
  if (scores.food >= 75) personalityTraits.add("Foodie");
  if (scores.relaxation >= 75) personalityTraits.add("Relaxation Seeker");

  const dna = await TravelDNA.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        user: userId,
        scores,
        spendingHabit,
        topInterests: Array.from(topInterestsSet).slice(0, 10),
        personalityTraits: Array.from(personalityTraits).slice(0, 6),
        aiGeneratedSummary:
          existing?.aiGeneratedSummary ||
          `Building your travel personality based on ${normalizedInterests.length ? normalizedInterests.join(", ") : "your trips"}.`,
      },
      $inc: { tripsAnalyzed: 1 },
    },
    { upsert: true, new: true }
  );

  await User.findByIdAndUpdate(userId, { travelDNA: dna._id });
  return dna;
};
