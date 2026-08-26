export const buildItineraryPrompt = ({ destination, originCity, days, budget, currency, interests, foodPref, travelStyle }) => {
  const budgetContext = originCity && budget 
    ? `\n    - Budget: ${budget} ${currency}\n    - Origin City: ${originCity}`
    : `\n    - Budget Tier: ${budget}`;

  return `
    You are an expert AI Travel Planner for WayMark.
    Generate a detailed ${days}-day travel itinerary for "${destination}".
    User Preferences:${budgetContext}
    - Interests: ${Array.isArray(interests) ? interests.join(", ") : interests}
    - Food Preference: ${foodPref}
    - Travel Style: ${travelStyle}

    CRITICAL BUDGET VALIDATION:
    If the user provided an exact Budget and an Origin City, you MUST validate if the budget is practically possible to cover average RETURN FLIGHTS from ${originCity} to ${destination} PLUS basic accommodation, food, and transport for ${days} days.
    If the budget is impossibly low for this entire trip, ABORT the itinerary generation and return ONLY this JSON format:
    {
      "error": "Your budget of ${budget} ${currency} is too low for a ${days}-day trip to ${destination} from ${originCity}. A realistic minimum is roughly [Calculate Minimum Here] ${currency}."
    }

    Otherwise, if the budget is acceptable or missing, generate the itinerary and respond strictly in JSON format matching this schema:
    {
      "tripTitle": "String (short, catchy — e.g. 'Exploring Kyoto')",
      "summary": "String",
      "safetyTips": ["String"],
      "packingItems": [{"item": "String", "category": "String"}],
      "estimatedTotalBudgetUSD": 0,
      "days": [
        {
          "dayNumber": 1,
          "title": "String",
          "morning": [{"title": "String", "description": "String", "estimatedCost": 0}],
          "afternoon": [{"title": "String", "description": "String", "estimatedCost": 0}],
          "evening": [{"title": "String", "description": "String", "estimatedCost": 0}]
        }
      ]
    }
    
    IMPORTANT: Make the itinerary genuinely unique to "${destination}" - use real, specific, well-known landmarks.
  `;
};

export const buildTravelDnaPrompt = (memories = []) => {
  return `
    Analyze the following user travel memories, saved notes, and tags:
    ${JSON.stringify(memories)}

    Generate an AI Travel DNA Persona Profile.
    Respond strictly in JSON format matching this schema:
    {
      "personalityTraits": ["String"],
      "pacePreference": "SLOW" | "MODERATE" | "FAST_PACED",
      "spendingHabit": "SAVER" | "BALANCED" | "SPENDER" | "LUXURY",
      "topInterests": ["String"],
      "aiGeneratedSummary": "String",
      "scores": {
        "adventure": 0-100,
        "culture": 0-100,
        "relaxation": 0-100,
        "food": 0-100
      }
    }
  `;
};

export const buildRecommendationPrompt = ({ userProfile, travelDna, wishlist, history }) => {
  return `
    You are a Personalized Travel Recommendation AI.
    Analyze the user profile:
    - Travel DNA: ${JSON.stringify(travelDna)}
    - Wishlist: ${JSON.stringify(wishlist)}
    - History: ${JSON.stringify(history)}

    Recommend 3 top destinations, 3 hotels, and 3 restaurants.
    Respond strictly in JSON format matching this schema:
    {
      "recommendedDestinations": [{"name": "String", "reason": "String", "matchingScore": 95, "image": "String"}],
      "recommendedHotels": [{"name": "String", "reason": "String", "priceLevel": "String"}],
      "recommendedRestaurants": [{"name": "String", "reason": "String", "cuisine": "String"}]
    }
  `;
};

export const buildJournalPrompt = (tripDetails) => {
  return `
    Generate a poetic and memorable Travel Journal entry for this trip:
    ${JSON.stringify(tripDetails)}

    Respond strictly in JSON format matching this schema:
    {
      "summary": "String",
      "highlights": ["String"],
      "visitedPlaces": ["String"]
    }
  `;
};
