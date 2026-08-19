import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Bookmark,
  Dna,
  Zap,
  DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import api from '../utils/axios';
import { useCurrency } from '../context/CurrencyContext';

// Returns a short, clean trip name for display
const getTripDisplayName = (t) => t?.destinationName || t?.title || 'Untitled Trip';

export default function Dashboard() {
  const { user, isNewUser } = useAuth();
  const { trips } = useTrips();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();

  const [memoriesCount, setMemoriesCount] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!isNewUser) {
      api.get('/memory').then((res) => setMemoriesCount((res.data || []).length)).catch(() => {});
      api.get('/analytics/user').then((res) => setAnalytics(res.data)).catch(() => {});
      api.get('/recommendations/personalized').then((res) => setRecommendations(res.data?.recommendedDestinations || [])).catch(() => {});
    }
  }, [isNewUser, trips.length]);

  const dnaScores = user?.travelDNA?.scores;
  const travelDNARadar = [
    { subject: 'Culture', A: dnaScores?.culture ?? 50 },
    { subject: 'Adventure', A: dnaScores?.adventure ?? 50 },
    { subject: 'Relaxation', A: dnaScores?.relaxation ?? 50 },
    { subject: 'Gastronomy', A: dnaScores?.food ?? 50 },
  ];

  const CATEGORY_LABELS = { flights: 'Flights', hotels: 'Hotels', food: 'Food', shopping: 'Shopping', transport: 'Transport', activities: 'Activities', miscellaneous: 'Other' };
  const spendingByCategory = analytics
    ? Object.entries(analytics.categoryBreakdown || {}).map(([key, value]) => ({ category: CATEGORY_LABELS[key] || key, spent: value }))
    : [];

  const totalPlannedBudget = trips.reduce((acc, t) => acc + (t.budget?.totalAmount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div 
        className="p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2B24] via-[#0F2B24]/80 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-widest text-[#0F2B24] uppercase bg-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#355E4B]"></span>
              {isNewUser ? 'ONBOARDING STATE' : 'LIVE DASHBOARD'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isNewUser ? `Welcome to WayMark, ${user?.name || 'Traveler'}! 🚀` : `Good day, ${user?.name}`}
          </h1>
          <p className="text-xs text-white/70 mt-1 max-w-xl">
            {isNewUser
              ? 'Your intelligent travel assistant is ready. Follow the quick setup steps below or prompt AI / manual builder to create your first trip.'
              : 'Here is your real-time travel intelligence, active itineraries, and evolving Travel DNA summary.'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-2 bg-[#FFF6E1] hover:bg-white text-[#C9A227] font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>

      {/* RENDER VIEW ACCORDING TO USER STATE HANDLING SPEC */}
      {isNewUser ? (
        /* NEW USER ONBOARDING & DISCOVERY VIEW */
        <div className="space-y-5">
          {/* Guided Setup Steps */}
          <div className="bg-white rounded-3xl p-7 border border-[#E5E5E7]/60 shadow-sm">
            {/* Section Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF6E1] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#2A2A2A]">Quick Setup Guide for New Travelers</h2>
                  <p className="text-[11px] text-[#8B8B8B] mt-0.5">Complete these 3 steps to calibrate your AI Travel Engine.</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#355E4B] bg-[#EAF5EA] px-2.5 py-1 rounded-full">0 / 3 Done</span>
            </div>

            {/* Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div
                onClick={() => navigate('/travel-dna')}
                className="relative p-5 rounded-2xl bg-[#F5F7F2] hover:bg-[#FFF6E1] border border-[#E5E5E7]/60 hover:border-[#D4AF37]/40 transition-all cursor-pointer group flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF6E1] border border-[#D4AF37]/20 text-[#C9A227] flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform shadow-sm">
                    1
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A] mb-1.5">Set Travel DNA Preferences</h4>
                  <p className="text-[11px] text-[#8B8B8B] leading-relaxed">
                    Tell AI your budget, travel pace, and preferred stay styles.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40"></div>
                  <span className="text-[10px] text-[#8B8B8B] font-medium">~2 min</span>
                </div>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => navigate('/planner')}
                className="relative p-5 rounded-2xl bg-[#F5F7F2] hover:bg-[#FFF6E1] border border-[#E5E5E7]/60 hover:border-[#D4AF37]/40 transition-all cursor-pointer group flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF6E1] border border-[#D4AF37]/20 text-[#C9A227] flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform shadow-sm">
                    2
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A] mb-1.5">Build First Trip (AI or Manual)</h4>
                  <p className="text-[11px] text-[#8B8B8B] leading-relaxed">
                    Enter destination & dates to generate a tailored plan in seconds.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40"></div>
                  <span className="text-[10px] text-[#8B8B8B] font-medium">~5 min</span>
                </div>
              </div>

              {/* Step 3 */}
              <div
                onClick={() => navigate('/explore')}
                className="relative p-5 rounded-2xl bg-[#F5F7F2] hover:bg-[#FFF6E1] border border-[#E5E5E7]/60 hover:border-[#D4AF37]/40 transition-all cursor-pointer group flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF6E1] border border-[#D4AF37]/20 text-[#C9A227] flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform shadow-sm">
                    3
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A] mb-1.5">Explore Curated Spots</h4>
                  <p className="text-[11px] text-[#8B8B8B] leading-relaxed">
                    Bookmark hotels, hidden restaurants & festivals to your wishlist.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40"></div>
                  <span className="text-[10px] text-[#8B8B8B] font-medium">Anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample AI Starters */}
          <div className="bg-white rounded-3xl p-7 border border-[#E5E5E7]/60 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#EAF5EA] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#355E4B]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2A2A2A]">Sample AI Prompt Starters</h3>
                <p className="text-[11px] text-[#8B8B8B] mt-0.5">Click any prompt to launch it in the AI Planner.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                onClick={() => navigate('/planner')}
                className="p-4 rounded-2xl bg-[#F5F7F2] border border-[#E5E5E7]/50 hover:border-[#D4AF37]/40 hover:bg-[#FFF6E1] cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#2A2A2A] leading-snug">"Plan a 7-day culinary tour in Tokyo under $3000"</h4>
                  <p className="text-[11px] text-[#8B8B8B] mt-1">Sushi bars, Michelin ramen & traditional tea houses</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5E5E7]/60 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/40 transition-colors shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
              </div>

              <div
                onClick={() => navigate('/planner')}
                className="p-4 rounded-2xl bg-[#F5F7F2] border border-[#E5E5E7]/50 hover:border-[#D4AF37]/40 hover:bg-[#FFF6E1] cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#2A2A2A] leading-snug">"5-day relaxing Swiss Alps retreat with luxury spa"</h4>
                  <p className="text-[11px] text-[#8B8B8B] mt-1">Glacier Express scenic train & mountain wellness resorts</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5E5E7]/60 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/40 transition-colors shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
              </div>

              <div
                onClick={() => navigate('/planner')}
                className="p-4 rounded-2xl bg-[#F5F7F2] border border-[#E5E5E7]/50 hover:border-[#D4AF37]/40 hover:bg-[#FFF6E1] cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#2A2A2A] leading-snug">"Weekend beach escape in Bali for 2 people"</h4>
                  <p className="text-[11px] text-[#8B8B8B] mt-1">Villas, rice terraces & sunset dinner experiences</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5E5E7]/60 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/40 transition-colors shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
              </div>

              <div
                onClick={() => navigate('/planner')}
                className="p-4 rounded-2xl bg-[#F5F7F2] border border-[#E5E5E7]/50 hover:border-[#D4AF37]/40 hover:bg-[#FFF6E1] cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#2A2A2A] leading-snug">"Budget Euro trip across 5 countries in 14 days"</h4>
                  <p className="text-[11px] text-[#8B8B8B] mt-1">Hostels, rail passes & free museum days across Europe</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-[#E5E5E7]/60 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/40 transition-colors shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C9A227]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* RETURNING USER DYNAMIC PERSONALIZED DASHBOARD */
        <div className="space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-[#E5E5E7]/60 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F7F2] flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#2A2A2A]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8B8B8B] uppercase font-bold tracking-wider">Active Trips</p>
                  <p className="text-3xl font-bold text-[#2A2A2A] mt-0.5">{trips.length}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#355E4B] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#355E4B]"></span> Live & up to date
              </span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-[#E5E5E7]/60 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EAF5EA] flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-[#355E4B]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8B8B8B] uppercase font-bold tracking-wider">Memories Saved</p>
                  <p className="text-3xl font-bold text-[#2A2A2A] mt-0.5">{memoriesCount}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#8B8B8B] font-medium">Across {analytics?.countriesVisited?.length || 0} Countries</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-[#E5E5E7]/60 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F0F2E8] flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#1A1C19]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8B8B8B] uppercase font-bold tracking-wider">Total Planned Budget</p>
                  <p className="text-2xl font-bold text-[#2A2A2A] mt-0.5">{formatAmount(totalPlannedBudget)}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#355E4B] font-semibold">Updated Real-Time</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-[#E5E5E7]/60 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center">
                  <Dna className="w-6 h-6 text-[#4B4E99]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8B8B8B] uppercase font-bold tracking-wider">Travel DNA Score</p>
                  <p className="text-3xl font-bold text-[#C9A227] mt-0.5">{user?.travelDNA?.scores?.culture ?? '—'}{user?.travelDNA ? '%' : ''}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#2A2A2A] font-medium">Curious</span>
            </div>
          </div>

          {/* Active Trips & Travel DNA Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Trips Timeline (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E5E5E7]/60 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider flex items-center gap-2">
                  Active & Created Trips ({trips.length})
                </h3>
                <button
                  onClick={() => navigate('/trips')}
                  className="text-xs text-[#355E4B] hover:underline font-bold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {trips.slice(0, 4).map((trip) => (
                  <div
                    key={trip._id}
                    onClick={() => navigate(`/trip-details/${trip._id}`)}
                    className="p-3 rounded-2xl border border-[#E5E5E7]/40 hover:border-[#E5E5E7] transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={trip.bannerImage}
                        alt={trip.title}
                        className="w-16 h-16 rounded-[14px] object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#2A2A2A] mb-1">{getTripDisplayName(trip)}</h4>
                        <p className="text-[11px] font-medium text-[#8B8B8B] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF6E1] text-[#C9A227] mt-1.5">
                          Budget: {formatAmount(trip.budget?.totalAmount || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto text-right">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                          trip.status === 'COMPLETED'
                            ? 'bg-[#EAF5EA] text-[#355E4B]'
                            : 'bg-[#FFF6E1] text-[#C9A227]'
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel DNA Radar Widget (1 col) */}
            <div className="bg-white rounded-3xl border border-[#E5E5E7]/60 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider">
                    Travel DNA Profile
                  </h3>
                  <button
                    onClick={() => navigate('/travel-dna')}
                    className="text-[10px] text-[#355E4B] font-bold hover:underline"
                  >
                    View Details
                  </button>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={travelDNARadar}>
                      <PolarGrid stroke="#E5E5E7" />
                      <PolarAngleAxis dataKey="subject" stroke="#8B8B8B" tick={{ fontSize: 10 }} />
                      <Radar name="Travel DNA" dataKey="A" stroke="#355E4B" fill="#A7BCA1" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F7F2] mt-2 text-xs flex items-center gap-3 border border-[#E5E5E7]/50">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 text-xl shadow-sm">
                  ^
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-[#2A2A2A] font-medium leading-snug">
                    {user?.travelDNA?.aiGeneratedSummary || 'You love immersive cultural experiences. Keep exploring!'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real Spending by Category */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" /> Spending by Category
                </h3>
                <p className="text-xs text-[#8B8B8B] mt-0.5">Real breakdown of logged expenses across your trips.</p>
              </div>
            </div>

            {spendingByCategory.every((c) => c.spent === 0) || spendingByCategory.length === 0 ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-xs text-[#8B8B8B]">No expenses logged yet. Add some from a trip's Expense Tracker.</p>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingByCategory}>
                    <defs>
                      <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="category" stroke="#355E4B" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#355E4B" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F1A2E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="spent" stroke="#D4AF37" fillOpacity={1} fill="url(#colorSpent)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* AI Recommendations - based on interests & Travel DNA */}
          {recommendations.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Recommended For You
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.slice(0, 3).map((rec, i) => (
                  <div
                    key={i}
                    onClick={() => navigate('/planner', { state: { destinationName: rec.name } })}
                    className="rounded-xl overflow-hidden glass-inset cursor-pointer group"
                  >
                    <div className="relative h-28">
                      <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {rec.matchingScore && (
                        <span className="absolute top-2 right-2 bg-black/60 text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full">
                          {rec.matchingScore}%
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-[#2A2A2A]">{rec.name}</h4>
                      <p className="text-[10px] text-[#8B8B8B] mt-0.5 line-clamp-2">{rec.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/explore')}
                className="text-[10px] text-[#D4AF37] font-semibold hover:underline mt-4 flex items-center gap-1"
              >
                See more in Explore <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
