export const destinationsDB = [
  {
    name: "Paris, France",
    tags: ["culture", "romance", "history", "food", "luxury", "art", "photography"],
    reason: "Perfect for lovers of art, history, and world-class culinary experiences.",
    hotels: [
      { name: "Le Meurice", reason: "Luxury stay near the Louvre with classic French architecture", priceLevel: "HIGH" },
      { name: "Hotel Monge", reason: "Charming boutique hotel in the Latin Quarter", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Le Jules Verne", reason: "Iconic dining experience in the Eiffel Tower", cuisine: "French" },
      { name: "Bistrot Paul Bert", reason: "Classic Parisian bistro with amazing steaks", cuisine: "French" }
    ]
  },
  {
    name: "Bali, Indonesia",
    tags: ["nature", "relaxation", "beach", "spirituality", "adventure", "budget"],
    reason: "A tropical paradise offering serene beaches, lush terraces, and rich Hindu culture.",
    hotels: [
      { name: "Ayana Resort", reason: "Cliff-edge luxury overlooking the ocean", priceLevel: "HIGH" },
      { name: "Ubud Village Hotel", reason: "Peaceful retreat surrounded by nature", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Locavore", reason: "Modern, sustainable fine dining in Ubud", cuisine: "Asian Fusion" },
      { name: "Warung Babi Guling", reason: "Famous for traditional Balinese roast pork", cuisine: "Indonesian" }
    ]
  },
  {
    name: "Kyoto, Japan",
    tags: ["culture", "history", "spirituality", "photography", "nature"],
    reason: "Step back in time with ancient temples, beautiful gardens, and traditional tea houses.",
    hotels: [
      { name: "Hoshinoya Kyoto", reason: "Traditional riverside ryokan experience", priceLevel: "HIGH" },
      { name: "Kyoto Granbell Hotel", reason: "Modern comfort with Japanese aesthetics", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Kikunoi", reason: "Michelin-starred traditional Kaiseki dining", cuisine: "Japanese" },
      { name: "Gion Karyo", reason: "Intimate dining experience in the geisha district", cuisine: "Japanese" }
    ]
  },
  {
    name: "New York City, USA",
    tags: ["urban", "food", "nightlife", "culture", "shopping", "art"],
    reason: "The city that never sleeps, packed with iconic sights, Broadway, and global cuisine.",
    hotels: [
      { name: "The Plaza", reason: "Legendary luxury hotel at Central Park", priceLevel: "HIGH" },
      { name: "CitizenM Times Square", reason: "Smart, modern, and perfectly located", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Katzs Delicatessen", reason: "World-famous pastrami sandwiches", cuisine: "American" },
      { name: "Le Bernardin", reason: "World-class seafood fine dining", cuisine: "French/Seafood" }
    ]
  },
  {
    name: "Cape Town, South Africa",
    tags: ["adventure", "nature", "wildlife", "beach", "photography"],
    reason: "Breathtaking landscapes combining mountains, ocean, and incredible wildlife.",
    hotels: [
      { name: "The Silo Hotel", reason: "Architectural marvel with stunning harbor views", priceLevel: "HIGH" },
      { name: "Camp Bay Retreat", reason: "Oceanfront luxury nestled in nature", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "The Test Kitchen", reason: "Innovative global gastronomy", cuisine: "Contemporary" },
      { name: "Kloof Street House", reason: "Eclectic brasserie in a fairy-lit garden", cuisine: "International" }
    ]
  },
  {
    name: "Rome, Italy",
    tags: ["history", "culture", "food", "romance", "architecture"],
    reason: "Wander through ancient ruins while enjoying the best pasta and gelato in the world.",
    hotels: [
      { name: "Hotel Eden", reason: "Historic luxury near the Spanish Steps", priceLevel: "HIGH" },
      { name: "Albergo del Senato", reason: "Unbeatable views of the Pantheon", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Roscioli", reason: "Famous for incredible carbonara and wine", cuisine: "Italian" },
      { name: "La Pergola", reason: "Three Michelin stars with panoramic city views", cuisine: "Italian" }
    ]
  },
  {
    name: "Queenstown, New Zealand",
    tags: ["adventure", "nature", "mountains", "sports", "thrill"],
    reason: "The adventure capital of the world, surrounded by majestic mountains and lakes.",
    hotels: [
      { name: "Matakauri Lodge", reason: "Alpine lakeside luxury", priceLevel: "HIGH" },
      { name: "Kamana Lakehouse", reason: "Highest altitude hotel with sweeping views", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Fergburger", reason: "Iconic and massive gourmet burgers", cuisine: "Burgers" },
      { name: "Amisfield", reason: "Trust-the-chef dining at a beautiful winery", cuisine: "New Zealand" }
    ]
  },
  {
    name: "Dubai, UAE",
    tags: ["luxury", "shopping", "urban", "architecture", "desert"],
    reason: "Experience ultra-modern luxury, massive malls, and futuristic architecture.",
    hotels: [
      { name: "Burj Al Arab", reason: "The iconic sail-shaped luxury hotel", priceLevel: "HIGH" },
      { name: "Rove Downtown", reason: "Fun, affordable stay near the Burj Khalifa", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Pierchic", reason: "Romantic seafood dining over the water", cuisine: "Seafood" },
      { name: "Al Hadheerah", reason: "Traditional Arabian feast in the desert", cuisine: "Middle Eastern" }
    ]
  },
  {
    name: "Machu Picchu, Peru",
    tags: ["history", "adventure", "nature", "hiking", "spirituality"],
    reason: "An awe-inspiring ancient Incan citadel set high in the Andes Mountains.",
    hotels: [
      { name: "Sanctuary Lodge", reason: "The only hotel located right at the ruins", priceLevel: "HIGH" },
      { name: "Inkaterra Machu Picchu Pueblo", reason: "Nature retreat in the cloud forest", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Tampu Restaurant", reason: "Fine dining with views of the Urubamba River", cuisine: "Peruvian" },
      { name: "Cafe Inkaterra", reason: "Cozy spot offering traditional Andean cuisine", cuisine: "Peruvian" }
    ]
  },
  {
    name: "Santorini, Greece",
    tags: ["romance", "beach", "photography", "relaxation", "luxury"],
    reason: "Famous for its stunning sunsets, white-washed houses, and blue-domed churches.",
    hotels: [
      { name: "Canaves Oia", reason: "Cliffside suites with private plunge pools", priceLevel: "HIGH" },
      { name: "Rocabella", reason: "Modern elegance and peaceful caldera views", priceLevel: "MODERATE" }
    ],
    restaurants: [
      { name: "Ambrosia", reason: "Romantic cliffside dining", cuisine: "Greek/Mediterranean" },
      { name: "Ammoudi Fish Tavern", reason: "Fresh seafood right by the water", cuisine: "Seafood" }
    ]
  }
];

