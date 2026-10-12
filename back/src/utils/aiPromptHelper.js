export const buildItineraryPrompt = ({ destination, originCity = "", days, currency = "USD", interests = [], foodPref = "ANYTHING", travelStyle = "SOLO" }) => {
  const originClause = originCity ? ` starting from "${originCity}"` : "";
  const interestsList = Array.isArray(interests) && interests.length > 0 ? interests.join(", ") : "Top Attractions & Culture";

  return `
    You are an expert AI Travel Planner for WayMark.
    Generate a comprehensive, realistic ${days}-day travel itinerary for "${destination}"${originClause}.

    Traveler Profile:
    - Destination: ${destination}
    ${originCity ? `- Origin: ${originCity}` : ""}
    - Duration: ${days} Days
    - Interests: ${interestsList}
    - Food Preference: ${foodPref}
    - Travel Style: ${travelStyle}
    - Preferred Currency: ${currency}

    CRITICAL INSTRUCTIONS:
    1. STRICT GEOGRAPHICAL ACCURACY: You MUST ONLY include places, attractions, restaurants, and landmarks physically located in "${destination}". Never include landmarks from other cities or states.
    2. SMART PROXIMITY ROUTING: Group each day's activities by geographic proximity. Morning, afternoon, and evening locations must be close to each other to minimize travel time.
    3. REALISTIC ESTIMATION: Estimate realistic average costs for transport, stay, food, and activities in ${currency}.

    Respond strictly in valid JSON format matching this schema:
    {
      "tripTitle": "Short catchy title (e.g., 'Discovering the Magic of ${destination}')",
      "summary": "2-3 sentence engaging overview covering key highlights, best time to explore, and cultural vibe.",
      "estimatedTotalBudget": 0,
      "safetyTips": ["Practical local travel or safety tip"],
      "packingItems": [
        { "item": "Essential item name", "category": "Clothing" }
      ],
      "transportOptions": [
        {
          "mode": "Flight / Train / Bus / Drive",
          "approxCost": "Estimated return cost in ${currency}",
          "duration": "One-way duration (e.g. 2h 15m)"
        }
      ],
      "days": [
        {
          "dayNumber": 1,
          "title": "Day theme (e.g., 'Day 1: Historic Old Town & Heritage Walk')",
          "morning": [
            { "title": "Real Landmark Name", "description": "Specific reason to visit and what to see", "estimatedCost": 0 }
          ],
          "afternoon": [
            { "title": "Cultural Spot or Local Market", "description": "Local food tasting or market exploration", "estimatedCost": 0 }
          ],
          "evening": [
            { "title": "Scenic Viewpoint / Dinner Spot", "description": "Sunset views, relaxing atmosphere, or local dining", "estimatedCost": 0 }
          ]
        }
      ]
    }
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
