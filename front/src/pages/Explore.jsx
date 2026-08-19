import React, { useState, useEffect } from 'react';
import {
  Compass, Search, MapPin, Star, Heart, ArrowUpRight, Sparkles,
  Loader2, X, Clock, Calendar, DollarSign, Sun, Camera,
  ChevronRight, Globe, Utensils, Landmark, Tag, Users
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axios';

// --- AI-generated trip data for each destination ---
const AI_TRIPS = [
  {
    id: 'ai-1',
    name: 'Kyoto, Japan',
    country: 'Japan',
    city: 'Kyoto',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    matchingScore: 97,
    averageRating: 4.9,
    tag: 'Cultural Gem',
    tagIcon: '🏛',
    duration: '7 Days',
    bestSeason: 'March – May',
    budget: '$1,200 – $2,000',
    description: 'Step into a world where ancient temples meet zen gardens. Kyoto enchants with 2,000 shrines, geisha districts, and cherry blossom-lined canals.',
    highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Gion District', 'Nishiki Market', 'Kinkaku-ji Temple'],
    itinerary: [
      { day: 1, title: 'Arrival & Gion Evening', desc: 'Check into a ryokan, explore Gion district and spot maiko at dusk.' },
      { day: 2, title: 'Fushimi Inari & Nishiki', desc: 'Hike the iconic torii gates at sunrise, then browse Nishiki Market.' },
      { day: 3, title: 'Arashiyama & Temples', desc: 'Bamboo grove, Tenryu-ji garden, and a boat ride on Oi River.' },
      { day: 4, title: 'Golden Pavilion & Tea', desc: 'Kinkaku-ji, Ryoan-ji rock garden, and a traditional tea ceremony.' },
      { day: 5, title: 'Day Trip to Nara', desc: 'Feed sacred deer, visit Todai-ji temple housing Japan\'s largest Buddha.' },
    ],
    food: ['Kaiseki (multi-course)', 'Matcha desserts', 'Tofu cuisine', 'Ramen & Soba'],
    reason: 'Perfect for culture lovers — ancient temples, tea ceremonies, and breathtaking sakura views.',
  },
  {
    id: 'ai-2',
    name: 'Santorini, Greece',
    country: 'Greece',
    city: 'Santorini',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    matchingScore: 94,
    averageRating: 4.8,
    tag: 'Romantic Escape',
    tagIcon: '🌅',
    duration: '5 Days',
    bestSeason: 'June – September',
    budget: '$1,800 – $3,500',
    description: 'Iconic white-washed villages cascade down volcanic cliffs above the electric-blue Aegean. Famous for the world\'s most stunning sunsets in Oia.',
    highlights: ['Oia Sunset', 'Red Beach', 'Akrotiri Ruins', 'Caldera Views', 'Wine Tasting'],
    itinerary: [
      { day: 1, title: 'Fira Exploration', desc: 'Arrive, walk the caldera path, enjoy panoramic dinner.' },
      { day: 2, title: 'Oia & Sunset Magic', desc: 'Morning in Oia\'s blue-domed churches, legendary sunset from the castle.' },
      { day: 3, title: 'Beaches & Wineries', desc: 'Red Beach, Black Beach, and visit Santorini\'s volcanic wineries.' },
      { day: 4, title: 'Akrotiri & Boat Trip', desc: 'Ancient Minoan ruins then a catamaran tour around the caldera.' },
    ],
    food: ['Fresh seafood mezze', 'Fava dip', 'Tomatokeftedes', 'Assyrtiko wine'],
    reason: 'Iconic sunsets, volcanic beaches and world-class cuisine make this an unforgettable escape.',
  },
  {
    id: 'ai-3',
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    city: 'Ubud / Seminyak',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    matchingScore: 92,
    averageRating: 4.7,
    tag: 'Wellness Retreat',
    tagIcon: '🌿',
    duration: '10 Days',
    bestSeason: 'April – October',
    budget: '$800 – $1,600',
    description: 'The Island of the Gods offers spiritual healing, lush rice terraces, ancient temples and world-class surf beaches all in one perfect destination.',
    highlights: ['Tegalalang Rice Terraces', 'Tanah Lot Temple', 'Ubud Monkey Forest', 'Seminyak Beach', 'Mount Batur Sunrise'],
    itinerary: [
      { day: 1, title: 'Arrival in Seminyak', desc: 'Beachfront dinner, sunset at Potato Head, explore beach clubs.' },
      { day: 2, title: 'Uluwatu & Kecak Dance', desc: 'Clifftop temple, snorkeling in crystal coves, fire dance at sunset.' },
      { day: 3, title: 'Ubud Arts & Culture', desc: 'Monkey Forest, traditional painting classes, evening gamelan show.' },
      { day: 4, title: 'Rice Terraces & Volcano', desc: 'Tegalalang trek at golden hour, then Batur volcano hike at dawn.' },
      { day: 5, title: 'Spa & Wellness Day', desc: 'Balinese massage, yoga retreat, organic farm-to-table lunch.' },
    ],
    food: ['Nasi Goreng', 'Babi Guling', 'Lawar', 'Fresh coconut smoothies'],
    reason: 'Spiritual, scenic and affordable — Bali is the ultimate wellness and adventure destination.',
  },
  {
    id: 'ai-4',
    name: 'Dubai, UAE',
    country: 'UAE',
    city: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    matchingScore: 88,
    averageRating: 4.7,
    tag: 'Luxury & Modern',
    tagIcon: '✨',
    duration: '5 Days',
    bestSeason: 'November – March',
    budget: '$2,000 – $5,000',
    description: 'A city born from desert sand into a global metropolis. Dubai dazzles with record-breaking skyscrapers, lavish malls, desert safaris and pristine beaches.',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Desert Safari', 'Palm Jumeirah', 'Dubai Creek'],
    itinerary: [
      { day: 1, title: 'Downtown & Burj', desc: 'Burj Khalifa observation deck at sunset, Dubai Fountain show.' },
      { day: 2, title: 'Palm & Marina', desc: 'Palm Jumeirah monorail, Atlantis waterpark, marina yacht cruise.' },
      { day: 3, title: 'Desert Safari', desc: 'Dune bashing, camel ride, Bedouin camp dinner under the stars.' },
      { day: 4, title: 'Old Dubai & Gold Souk', desc: 'Spice Souk, Gold Souk, abra ride across Dubai Creek.' },
    ],
    food: ['Shawarma & Hummus', 'Emirati Harees', 'Luqaimat sweets', 'International fine dining'],
    reason: 'Ultra-modern luxury meets ancient desert culture in the world\'s most ambitious city.',
  },
  {
    id: 'ai-5',
    name: 'Paris, France',
    country: 'France',
    city: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    matchingScore: 91,
    averageRating: 4.8,
    tag: 'Art & History',
    tagIcon: '🎨',
    duration: '6 Days',
    bestSeason: 'April – June',
    budget: '$1,500 – $3,000',
    description: 'The City of Light captivates with unmatched art, cuisine, fashion, and romance. From the Eiffel Tower to hidden Montmartre cafés — Paris is eternally beautiful.',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River Cruise', 'Versailles Palace'],
    itinerary: [
      { day: 1, title: 'Iconic Paris Arrival', desc: 'Eiffel Tower at golden hour, dinner at a classic bistro.' },
      { day: 2, title: 'Louvre & Marais', desc: 'Mona Lisa, Napoleon apartments, then explore Le Marais district.' },
      { day: 3, title: 'Montmartre & Sacré-Cœur', desc: 'Artist quarter, Moulin Rouge, stunning city views from hilltop.' },
      { day: 4, title: 'Day Trip to Versailles', desc: 'Hall of Mirrors, royal gardens and the Grand Trianon estate.' },
      { day: 5, title: 'Seine Cruise & Shopping', desc: 'Morning cruise, Champs-Élysées, and luxury shopping at Galeries Lafayette.' },
    ],
    food: ['Croissants & Crêpes', 'French Onion Soup', 'Escargots', 'Macarons from Ladurée'],
    reason: 'Romance, art, fashion and world-class cuisine — Paris always delivers magic.',
  },
  {
    id: 'ai-6',
    name: 'Maldives',
    country: 'Maldives',
    city: 'North Malé Atoll',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    matchingScore: 85,
    averageRating: 4.9,
    tag: 'Island Paradise',
    tagIcon: '🏝',
    duration: '7 Days',
    bestSeason: 'November – April',
    budget: '$3,000 – $8,000',
    description: 'A necklace of coral islands rising from the Indian Ocean. Overwater bungalows, impossible turquoise lagoons and the world\'s best snorkeling await.',
    highlights: ['Overwater Bungalows', 'Coral Reef Snorkeling', 'Bioluminescent Beach', 'Whale Shark Diving', 'Sunset Dolphin Cruise'],
    itinerary: [
      { day: 1, title: 'Seaplane Arrival', desc: 'Transfer to private island resort, welcome cocktail at water villa.' },
      { day: 2, title: 'Reef Snorkeling', desc: 'House reef exploration, marine biologist guided tour.' },
      { day: 3, title: 'Whale Shark Excursion', desc: 'All-day diving trip to swim alongside gentle giants.' },
      { day: 4, title: 'Spa & Overwater Yoga', desc: 'Sunrise yoga on dock, couples spa, private beach picnic.' },
      { day: 5, title: 'Island Hopping', desc: 'Local island culture, fish market, bioluminescent beach night.' },
    ],
    food: ['Fresh tuna curry', 'Mas huni breakfast', 'Coconut-based dishes', 'Seafood BBQ'],
    reason: 'The ultimate luxury escape — untouched reefs, crystal water and total seclusion.',
  },
];

const TAGS = [
  { tag: 'Cultural Gem', color: '#C9A227', icon: '🏛' },
  { tag: 'Hidden Paradise', color: '#0891B2', icon: '🏝' },
  { tag: 'Adventure Hub', color: '#16A34A', icon: '🧗' },
  { tag: 'Romantic Escape', color: '#E11D48', icon: '🌅' },
  { tag: 'Art & History', color: '#7C3AED', icon: '🎨' },
  { tag: 'Nature Retreat', color: '#15803D', icon: '🌿' },
];

const SEASONS = ['Jan – Mar', 'Mar – May', 'Apr – Jun', 'Jun – Sep', 'Sep – Nov', 'Oct – Dec'];
const BUDGETS = ['$500 – $900', '$800 – $1,400', '$1,000 – $1,800', '$1,200 – $2,500', '$1,800 – $3,500', '$2,500 – $5,000'];
const DURATIONS = ['4 Days', '5 Days', '6 Days', '7 Days', '8 Days', '10 Days'];

const GENERIC_HIGHLIGHTS = [
  ['City Center', 'Local Market', 'Historic Old Town', 'Viewpoint', 'Cultural Museum'],
  ['Waterfront', 'Night Bazaar', 'Ancient Ruins', 'Botanical Gardens', 'Street Food Alley'],
  ['National Park', 'Hilltop Fortress', 'Sacred Temple', 'Artisan Quarter', 'Scenic Overlook'],
];

const GENERIC_FOOD = [
  ['Local street food', 'Traditional stew', 'Fresh grilled fish', 'Spiced rice dish'],
  ['Market snacks', 'Slow-cooked meat', 'Herbed flatbread', 'Sweet pastries'],
  ['Seafood platter', 'Noodle soup', 'Grilled vegetables', 'Local dessert'],
];

const GENERIC_ITINERARY = [
  [
    { title: 'Arrival & City Exploration', desc: 'Check in and take a leisurely stroll through the city center. Enjoy dinner at a local restaurant.' },
    { title: 'Historical & Cultural Day', desc: 'Visit the old town, museums and heritage sites. Afternoon at the local market.' },
    { title: 'Nature & Outdoors', desc: 'Day trip to natural landscapes, viewpoints and scenic walks in the area.' },
    { title: 'Food & Local Life', desc: 'Join a morning cooking class, explore street food alleys and meet locals.' },
    { title: 'Hidden Gems & Departure', desc: 'Discover lesser-known spots, souvenir shopping and farewell dinner.' },
  ],
  [
    { title: 'Welcome & Orientation', desc: 'Arrive, get oriented, and enjoy a sunset walk through the heart of the destination.' },
    { title: 'Cultural Immersion', desc: 'Ancient temples, local ceremonies and traditional arts tour.' },
    { title: 'Adventure & Outdoors', desc: 'Hiking, boat ride or adventure excursion through scenic terrain.' },
    { title: 'Local Markets & Cuisine', desc: 'Morning market visit, cooking demo, and afternoon relaxation at a café.' },
    { title: 'Relaxation & Farewell', desc: 'Spa treatment, last sightseeing, and a memorable final dinner.' },
  ],
];

function enrichDestination(dest) {
  if (dest.itinerary && dest.itinerary.length > 0) return dest;
  const hash = (dest.name || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = (arr) => arr[hash % arr.length];
  const tagInfo = pick(TAGS);
  const itTemplate = pick(GENERIC_ITINERARY);
  return {
    ...dest,
    tag: dest.tag || tagInfo.tag,
    tagIcon: dest.tagIcon || tagInfo.icon,
    duration: dest.duration || pick(DURATIONS),
    bestSeason: dest.bestSeason || pick(SEASONS),
    budget: dest.budget || pick(BUDGETS),
    description: dest.description || dest.reason || `${dest.name} is a captivating destination known for its unique culture, stunning landscapes, and warm hospitality.`,
    highlights: dest.highlights?.length ? dest.highlights : pick(GENERIC_HIGHLIGHTS),
    food: dest.food?.length ? dest.food : pick(GENERIC_FOOD),
    itinerary: itTemplate.map((item, i) => ({ day: i + 1, ...item })),
    averageRating: dest.averageRating || (4.4 + (hash % 6) / 10).toFixed(1),
  };
}

function generateDynamicCard(query) {
  const name = query.trim();
  const parts = name.split(',').map((p) => p.trim());
  const city = parts[0];
  const country = parts[1] || 'International';
  const seed = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const imageSeeds = ['travel,city', 'destination,world', 'landmark,architecture', 'nature,landscape', 'cityscape,night', 'culture,temple'];
  const imageQuery = imageSeeds[seed % imageSeeds.length];
  const image = `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},${imageQuery}`;
  const base = { id: `dynamic-${seed}`, name, city, country, image, matchingScore: null, averageRating: (4.3 + (seed % 7) / 10).toFixed(1), description: `Explore ${name} — a fascinating destination waiting to be discovered.`, highlights: [], itinerary: [], food: [] };
  return enrichDestination(base);
}

// --- Trip Detail Modal ---
function TripDetailModal({ trip, onClose, onWishlist, isSaved }) {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(0);
  if (!trip) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Tag pill */}
          {trip.tag && (
            <span className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center gap-1.5">
              <span>{trip.tagIcon}</span> {trip.tag}
            </span>
          )}

          {/* Title */}
          <div className="absolute bottom-5 left-5 right-16">
            <h2 className="text-xl font-bold text-white">{trip.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-white/80">
                <MapPin className="w-3 h-3" /> {trip.city}, {trip.country}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#D4AF37] font-bold">
                <Star className="w-3 h-3 fill-[#D4AF37]" /> {trip.averageRating}
              </span>
              {trip.matchingScore && (
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                  {trip.matchingScore}% match
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: 'Duration', value: trip.duration },
              { icon: Sun, label: 'Best Season', value: trip.bestSeason },
              { icon: DollarSign, label: 'Est. Budget', value: trip.budget },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#F5F7F2] rounded-2xl p-3 text-center border border-[#E5E5E7]/50">
                <Icon className="w-4 h-4 text-[#355E4B] mx-auto mb-1" />
                <p className="text-[10px] text-[#8B8B8B] uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold text-[#2A2A2A] mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-[#8B8B8B] leading-relaxed">{trip.description}</p>

          {/* Highlights */}
          <div>
            <h3 className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-[#355E4B]" /> Top Highlights
            </h3>
            <div className="flex flex-wrap gap-2">
              {trip.highlights.map((h) => (
                <span key={h} className="text-[11px] bg-[#F5F7F2] text-[#2A2A2A] border border-[#E5E5E7]/60 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[#355E4B]" /> {h}
                </span>
              ))}
            </div>
          </div>

          {/* AI Itinerary */}
          <div>
            <h3 className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> AI-Generated Itinerary
            </h3>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
              {trip.itinerary.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    activeDay === i
                      ? 'bg-[#0F2B24] text-white'
                      : 'bg-[#F5F7F2] text-[#8B8B8B] hover:text-[#2A2A2A] border border-[#E5E5E7]/50'
                  }`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>
            <div className="bg-[#F5F7F2] rounded-2xl p-4 border border-[#E5E5E7]/50">
              <p className="text-xs font-bold text-[#355E4B] mb-1">
                Day {trip.itinerary[activeDay].day} — {trip.itinerary[activeDay].title}
              </p>
              <p className="text-xs text-[#8B8B8B] leading-relaxed">{trip.itinerary[activeDay].desc}</p>
            </div>
          </div>

          {/* Food */}
          <div>
            <h3 className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Utensils className="w-3.5 h-3.5 text-[#C9A227]" /> Must-Try Food
            </h3>
            <div className="flex flex-wrap gap-2">
              {trip.food.map((f) => (
                <span key={f} className="text-[11px] bg-[#FFF6E1] text-[#C9A227] border border-[#D4AF37]/20 px-3 py-1.5 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#E5E5E7]/60">
            <button
              onClick={() => onWishlist(trip)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                isSaved
                  ? 'bg-[#FEF2F2] border-[#FCA5A5]/40 text-[#EF4444]'
                  : 'bg-[#F5F7F2] border-[#E5E5E7]/60 text-[#8B8B8B] hover:border-[#FCA5A5]/40 hover:text-[#EF4444]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#EF4444]' : ''}`} />
              {isSaved ? 'Saved' : 'Save to Wishlist'}
            </button>
            <button
              onClick={() => navigate('/planner', { state: { destinationName: trip.name } })}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0F2B24] hover:bg-[#0A1F1A] text-white font-semibold text-xs py-2.5 rounded-2xl transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Plan This Trip with AI
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Explore Page ---
export default function Explore() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [wishlistNames, setWishlistNames] = useState([]);
  const [apiDestinations, setApiDestinations] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('ai');

  useEffect(() => {
    fetchWishlist();
    fetchPersonalized();
    if (searchParams.get('q')) runSearch(searchParams.get('q'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPersonalized = async () => {
    try {
      const res = await api.get('/recommendations/personalized');
      setApiDestinations(res.data?.recommendedDestinations || []);
    } catch (_) { setApiDestinations([]); }
  };

  const runSearch = async (q) => {
    setLoading(true);
    try {
      const res = await api.get(`/destinations/search?q=${encodeURIComponent(q)}`);
      const backendResults = res.data || [];
      if (backendResults.length > 0) {
        setSearchResults(backendResults);
      } else {
        const localMatches = AI_TRIPS.filter((d) =>
          d.name.toLowerCase().includes(q.toLowerCase()) ||
          d.city.toLowerCase().includes(q.toLowerCase()) ||
          d.country.toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(localMatches.length > 0 ? localMatches : [generateDynamicCard(q)]);
      }
    } catch {
      const localMatches = AI_TRIPS.filter((d) =>
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.city.toLowerCase().includes(q.toLowerCase()) ||
        d.country.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(localMatches.length > 0 ? localMatches : [generateDynamicCard(q)]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/users/wishlist');
      setWishlistNames((res.data || []).map((w) => (w.destination?.name || w.name || '').toLowerCase()));
    } catch (_) {}
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    await runSearch(searchQuery);
  };

  const toggleWishlist = async (item) => {
    try {
      const res = await api.post('/users/wishlist-by-name', {
        name: item.name,
        image: item.image || item.images?.[0],
        reason: item.reason || item.description,
      });
      toast.success(res.data.message);
      fetchWishlist();
    } catch (e) {
      toast.error(e.message || 'Failed to update wishlist');
    }
  };

  const displayList = searchResults !== null
    ? searchResults.map(enrichDestination)
    : activeTab === 'ai'
      ? AI_TRIPS
      : apiDestinations.map(enrichDestination);

  const isSearch = searchResults !== null;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Hero Banner ── */}
      <div
        className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-end"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2B24]/85 via-[#0F2B24]/50 to-transparent" />

        <div className="relative z-10 p-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-md">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 text-[#D4AF37]" />
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              Explore World Destinations
            </h1>
            <p className="text-sm text-white/75 leading-relaxed mb-5">
              Click any destination to view the full AI-generated itinerary, then save to wishlist.
            </p>

            {/* Tab buttons */}
            {!isSearch && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
                    activeTab === 'ai'
                      ? 'bg-[#0F2B24] text-white shadow-md'
                      : 'bg-white/15 backdrop-blur-sm text-white/80 hover:bg-white/25 border border-white/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Curated Trips
                </button>
                <button
                  onClick={() => setActiveTab('personalized')}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
                    activeTab === 'personalized'
                      ? 'bg-[#0F2B24] text-white shadow-md'
                      : 'bg-white/15 backdrop-blur-sm text-white/80 hover:bg-white/25 border border-white/20'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Personalized For You
                </button>
              </div>
            )}
          </div>

          {/* Search box on the right */}
          <form onSubmit={handleSearch} className="w-full md:w-72 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kyoto, Bali, Paris..."
                className="w-full bg-white text-sm text-[#2A2A2A] placeholder-[#ADADAD] pl-11 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#355E4B]/30 shadow-md transition-all"
              />
            </div>
            {isSearch && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                className="mt-2 text-[11px] text-white/70 hover:text-white flex items-center gap-1 pl-2"
              >
                <X className="w-3 h-3" /> Clear search
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ── Search result label ── */}
      {isSearch && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#8B8B8B]">
            Showing results for <span className="text-[#0F2B24] font-bold">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSearchResults(null); }}
            className="text-xs text-[#8B8B8B] hover:text-[#0F2B24] font-medium"
          >
            ← Back to all destinations
          </button>
        </div>
      )}

      {/* ── Destination Cards ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#355E4B] animate-spin" />
            <p className="text-xs text-[#8B8B8B]">Finding destinations…</p>
          </div>
        </div>
      ) : displayList.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#E5E5E7]/60 shadow-sm">
          <Sparkles className="w-8 h-8 text-[#ADADAD] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#2A2A2A]">
            {isSearch ? 'No destinations found' : 'No recommendations yet'}
          </h3>
          <p className="text-xs text-[#8B8B8B] mt-1 max-w-sm mx-auto">
            {isSearch
              ? 'Try a different search term like a city or country name.'
              : 'Plan a trip or update your Travel DNA to unlock personalized recommendations.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayList.map((dest, idx) => {
            const id = dest.id || dest._id || idx;
            const img = dest.image || dest.images?.[0];
            const name = dest.name;
            const isSaved = wishlistNames.includes((name || '').toLowerCase());

            return (
              <div
                key={id}
                onClick={() => setSelectedTrip(enrichDestination(dest))}
                className="group bg-white rounded-3xl border border-[#E5E5E7]/60 overflow-hidden cursor-pointer hover:border-[#355E4B]/20 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Match badge — top left */}
                  {dest.matchingScore && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0F2B24] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {dest.matchingScore}% match
                    </span>
                  )}

                  {/* Wishlist heart — top right */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(dest); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#8B8B8B]'}`} />
                  </button>

                  {/* Category tag — bottom left of image */}
                  {dest.tag && (
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center gap-1.5">
                      <span>{dest.tagIcon || '✈'}</span> {dest.tag}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Name + Rating */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-[#1A1A1A] leading-tight">{name}</h3>
                    {dest.averageRating && (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#C9A227] shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#C9A227]" /> {dest.averageRating}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[12px] text-[#8B8B8B] leading-relaxed line-clamp-2 mb-4 flex-1">
                    {dest.reason || dest.description}
                  </p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E7]/60">
                    <div className="flex items-center gap-3 text-[11px] text-[#8B8B8B]">
                      {dest.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {dest.city}
                        </span>
                      )}
                      {dest.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {dest.duration}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#355E4B] group-hover:gap-1.5 transition-all">
                      View Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onWishlist={(trip) => { toggleWishlist(trip); }}
          isSaved={wishlistNames.includes((selectedTrip?.name || '').toLowerCase())}
        />
      )}
    </div>
  );
}
