import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Loader2, Globe, Music, Utensils, Sun, Heart, X } from 'lucide-react';
import api from '../utils/axios';

const CATEGORIES = [
  { label: 'All Events', value: '', icon: Globe },
  { label: 'Cultural', value: 'CULTURAL', icon: Globe },
  { label: 'Music', value: 'MUSIC', icon: Music },
  { label: 'Seasonal', value: 'SEASONAL', icon: Sun },
  { label: 'Religious', value: 'RELIGIOUS', icon: Heart },
  { label: 'Food & Drink', value: 'FOOD', icon: Utensils },
];

const CATEGORY_COLORS = {
  CULTURAL: 'bg-amber-100 text-amber-700',
  MUSIC:    'bg-purple-100 text-purple-700',
  SEASONAL: 'bg-blue-100 text-blue-700',
  RELIGIOUS:'bg-rose-100 text-rose-700',
  FOOD:     'bg-orange-100 text-orange-700',
};

export default function Festivals() {
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async (q) => {
    setLoading(true);
    try {
      const endpoint = q
        ? `/festivals/search?q=${encodeURIComponent(q)}`
        : '/festivals';
      const res = await api.get(endpoint);
      setFestivals(res.data?.festivals || []);
    } catch (e) {
      setFestivals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFestivals(query);
  };

  const displayed = activeCategory
    ? festivals.filter((f) => f.category === activeCategory)
    : festivals;

  return (
    <>
      <div className="space-y-6 animate-fade-in">

        {/* ── Hero Banner ── */}
        <div
          className="relative rounded-[24px] overflow-hidden min-h-[220px] flex items-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=2000")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />

          <div className="relative z-10 p-8 max-w-xl">
            <h1 className="text-3xl font-bold text-[#1A3626] leading-tight">
              Global Festivals &amp;<br />Cultural Events
            </h1>
            <p className="text-sm text-[#1A3626]/60 mt-2 mb-6 max-w-xs">
              Explore world-renowned festivals and align your trip timing for peak cultural immersion.
            </p>
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search festivals or places..."
                  className="w-full bg-white/90 backdrop-blur-md text-sm text-[#1A3626] placeholder-[#8B8B8B] pl-11 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/60 shadow-sm border border-white/60 transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1A3626] hover:bg-[#1A3626]/90 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-[#1A3626] text-white border-[#1A3626] shadow-md'
                    : 'bg-white text-[#1A3626] border-gray-200 hover:border-[#437A60] hover:bg-[#EBF8F4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Festival Cards ── */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 text-[#437A60] animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center shadow-sm border border-gray-100">
            <p className="text-sm text-[#8B8B8B]">No festivals found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayed.map((fest) => (
              <div
                key={fest._id}
                className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => setSelectedFestival(fest)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={fest.image || fest.destination?.images?.[0]}
                    alt={fest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {fest.category && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${CATEGORY_COLORS[fest.category] || 'bg-gray-100 text-gray-600'}`}>
                      {fest.category}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-[#1A3626] leading-tight">{fest.name}</h3>
                  {fest.destination && (
                    <p className="text-xs text-[#8B8B8B] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#437A60] flex-shrink-0" />
                      {fest.destination.city}, {fest.destination.country}
                    </p>
                  )}
                  <p className="text-xs text-[#8B8B8B] flex items-center gap-1">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    {new Date(fest.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' – '}
                    {new Date(fest.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-[#8B8B8B] leading-relaxed line-clamp-2">{fest.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer Stats Banner ── */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f8faf9] flex items-center justify-center border border-gray-100">
              <Globe className="w-7 h-7 text-[#437A60]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A3626]">Curated from around the world</p>
              <p className="text-xs text-[#8B8B8B]">Handpicked cultural events to make your journey more meaningful and memorable.</p>
            </div>
          </div>
          <div className="flex items-center gap-8 flex-shrink-0">
            {[['120+', 'Countries'], ['850+', 'Festivals'], ['35+', 'Categories'], ['4.9★', 'Traveler Rating']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-[#1A3626]">{val}</p>
                <p className="text-[10px] text-[#8B8B8B]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedFestival && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setSelectedFestival(null)}
        >
          <div
            className="bg-white rounded-[24px] p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFestival(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#8B8B8B] hover:text-[#1A3626] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-bold text-[#1A3626] mb-4 pr-10">{selectedFestival.name}</h2>
            <img
              src={selectedFestival.image || selectedFestival.destination?.images?.[0]}
              alt={selectedFestival.name}
              className="w-full h-56 object-cover rounded-[16px] mb-5 shadow-sm"
            />
            <p className="text-sm text-[#8B8B8B] mb-5 leading-relaxed">{selectedFestival.description}</p>
            <div className="flex flex-col gap-3 bg-[#f8faf9] p-4 rounded-[16px] border border-gray-100">
              {selectedFestival.destination && (
                <p className="text-sm text-[#1A3626] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#437A60]" />
                  <span className="font-medium">{selectedFestival.destination.city}, {selectedFestival.destination.country}</span>
                </p>
              )}
              <p className="text-sm text-[#1A3626] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8B8B8B]" />
                <span className="font-medium">
                  {new Date(selectedFestival.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' – '}
                  {new Date(selectedFestival.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
