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

    CRITICAL BUDGET INSTRUCTION:
    You MUST NEVER abort or reject the user's budget, no matter how low it is. ALWAYS generate the full itinerary.
    1. Calculate a realistic minimum cost for the trip (e.g., Train/Bus for domestic, cheapest Economy Flight for international).
    2. If the user's budget is SIGNIFICANTLY LOWER than this realistic minimum, simply add a friendly warning at the VERY BEGINNING of your "summary" field (e.g., "⚠️ Note: Your budget of ${budget} ${currency} is extremely tight for this destination. A realistic minimum is roughly [Calculate] ${currency}. ").
    3. Regardless of the budget, adjust the suggested activities to be as cheap as possible and generate the complete itinerary. DO NOT throw any errors.

    Generate the itinerary strictly in JSON format matching this schema. Adjust the suggested transport (flight vs train) and activities to fit within their ${budget} ${currency}. All costs MUST be estimated in ${currency}:
    {
      "tripTitle": "String (short, catchy — e.g. 'Exploring Kyoto')",
      "summary": "String",
      "safetyTips": ["String"],
      "packingItems": [{"item": "String", "category": "String"}],
      "estimatedTotalBudget": 0,
      "transportOptions": [
        // YOU MUST PROVIDE MULTIPLE MODES for comparison (e.g., Flight, Train, Bus, Car) if possible.
        {
          "mode": "String (Flight / Train / Bus / Car)",
          "approxCost": "String (MUST be Total Round-Trip / Return cost)",
          "duration": "String (One-way travel time)"
        }
      ],
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
    
    IMPORTANT GEOGRAPHY & ROUTING RULES:
    1. STRICT GEOGRAPHICAL ACCURACY: You MUST ONLY include places, landmarks, and attractions that are physically located in or very near "${destination}". DO NOT hallucinate or include landmarks from other cities, states, or countries (e.g. do not put a Vadodara palace in an Indore itinerary). Double-check the real-world location of every place you suggest.
    2. Make the itinerary genuinely unique to "${destination}" - you MUST include the real, famous, must-visit landmarks of this location.
    3. SMART ROUTING: Group activities for each day by PROXIMITY (minimum distance). Ensure morning, afternoon, and evening locations for a single day are close to each other so the traveler doesn't waste time traveling back and forth across the city.
    4. Ensure the descriptions are detailed and explain WHY the user should visit.
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
