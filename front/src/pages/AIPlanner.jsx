import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, PenTool, CheckCircle2, Loader2, ArrowRight, Wallet, Target, Utensils, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AIPlanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshTrips } = useTrips();
  const { refreshUser } = useAuth();
  const { currencyInfo } = useCurrency();
  const [plannerMode, setPlannerMode] = useState('AI');

  const [destinationName, setDestinationName] = useState(location.state?.destinationName || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');
  const [foodPref, setFoodPref] = useState('ANYTHING');
  const [travelStyle, setTravelStyle] = useState('SOLO');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const [manualTitle, setManualTitle] = useState('');
  const [manualDestination, setManualDestination] = useState('');
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');
  const [manualBudget, setManualBudget] = useState('1500');
  const [manualNotes, setManualNotes] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const afterTripCreated = async (trip) => {
    await refreshTrips();
    await refreshUser();
    navigate(`/trip-details/${trip._id}`);
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    if (!destinationName || !startDate || !endDate) {
      toast.error('Please fill in destination and dates');
      return;
    }
    setIsGenerating(true);
    toast.loading('AI is crafting your itinerary...', { id: 'ai_gen' });

    try {
      const res = await api.post('/ai/plan-trip', {
        destinationName,
        startDate,
        endDate,
        budget,
        interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
        foodPref,
        travelStyle,
      });

      setGeneratedResult(res.data);
      toast.success('Your AI itinerary is ready!', { id: 'ai_gen' });
      await afterTripCreated(res.data.trip);
    } catch (err) {
      toast.error(err.message || 'Failed to generate itinerary', { id: 'ai_gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateManual = async (e) => {
    e.preventDefault();
    if (!manualTitle || !manualDestination || !manualStart || !manualEnd) {
      toast.error('Please fill in title, destination and dates');
      return;
    }
    setIsSavingManual(true);
    toast.loading('Saving your trip...', { id: 'manual_trip' });

    try {
      const res = await api.post('/ai/manual-trip', {
        title: manualTitle,
        destinationName: manualDestination,
        startDate: manualStart,
        endDate: manualEnd,
        budgetAmount: manualBudget,
        notes: manualNotes,
      });

      toast.success('Trip created successfully!', { id: 'manual_trip' });
      await afterTripCreated(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to create trip', { id: 'manual_trip' });
    } finally {
      setIsSavingManual(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
  <div className="relative h-[320px] sm:h-[280px] md:h-64 rounded-2xl overflow-hidden shadow-glow mb-6 bg-[#EBF8F4]">
    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" alt="AI Trip Planner Mountains" className="w-full h-full object-cover opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#EBF8F4]/90 via-[#EBF8F4]/80 md:via-[#EBF8F4]/70 to-transparent md:to-transparent" />
    
    <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-start pt-10 sm:justify-center sm:pt-0 w-full md:w-2/3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase bg-white px-3 py-1 rounded-full shadow-sm">
          TRIP BUILDER SUITE
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3626] flex items-center gap-2 mb-2 pr-4">
      {plannerMode === 'AI' ? <Sparkles className="w-8 h-8 text-[#D4AF37]" /> : <PenTool className="w-8 h-8 text-[#D4AF37]" />}
      {plannerMode === 'AI' ? 'AI Neural Trip Planner' : 'Manual Custom Trip Creator'}
    </h1>
    <p className="text-sm text-[#4A4A4A] max-w-md">
      {plannerMode === 'AI' 
        ? 'Generate a multi-day itinerary tailored to your interests, budget and travel style.'
        : 'Manually design your custom travel plan, budget, and dates.'}
    </p>
  </div>

  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-1 md:gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-white/10 scale-90 md:scale-100 origin-bottom-right">
    <button
      onClick={() => setPlannerMode('AI')}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
        plannerMode === 'AI' ? 'bg-[#F0C96B] text-black shadow-glow' : 'text-white/80 hover:text-white'
      }`}
    >
      <Sparkles className="w-4 h-4" />
      <span>AI Automated</span>
    </button>
    <button
      onClick={() => setPlannerMode('MANUAL')}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
        plannerMode === 'MANUAL' ? 'bg-[#F0C96B] text-black shadow-glow' : 'text-white/80 hover:text-white'
      }`}
    >
      <PenTool className="w-4 h-4" />
      <span>Manual Custom</span>
    </button>
  </div>
</div>

      {plannerMode === 'AI' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#1A3626] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#437A60]" /> AI TRIP PARAMETERS
            </h3>

            <form onSubmit={handleGenerateAI} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Destination</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    placeholder="e.g. Kyoto, Japan"
                    className="w-full bg-white border border-black/[0.05] text-[#2A2A2A] pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Start Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#8B8B8B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white border border-black/[0.05] text-[#2A2A2A] pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50 shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">End Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#8B8B8B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white border border-black/[0.05] text-[#2A2A2A] pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50 shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Total Budget ({currencyInfo.symbol})</label>
                <div className="relative">
                  <Wallet className="w-4 h-4 text-[#8B8B8B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-white border border-black/[0.05] text-[#2A2A2A] pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50 shadow-sm appearance-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Interests (comma separated)</label>
                <div className="relative">
                  <Target className="w-4 h-4 text-[#8B8B8B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Culture, Gastronomy, Nature"
                    className="w-full bg-white border border-black/[0.05] text-[#2A2A2A] pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Food Pref</label>
                  <div className="relative">
                    <Utensils className="w-4 h-4 text-[#8B8B8B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select value={foodPref} onChange={(e) => setFoodPref(e.target.value)} className="w-full bg-white border border-black/[0.05] text-[#2A2A2A] pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50 shadow-sm appearance-none">
                      <option value="ANYTHING">Anything</option>
                      <option value="VEGETARIAN">Vegetarian</option>
                      <option value="VEGAN">Vegan</option>
                      <option value="HALAL">Halal</option>
                      <option value="KOSHER">Kosher</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Travel Style</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-[#8B8B8B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} className="w-full bg-white border border-black/[0.05] text-[#2A2A2A] pl-9 pr-3 py-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50 shadow-sm appearance-none">
                      <option value="SOLO">Solo</option>
                      <option value="COUPLE">Couple</option>
                      <option value="FAMILY">Family</option>
                      <option value="FRIENDS">Friends</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-semibold text-xs py-3 rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
              >
{isGenerating ? (
  <>
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>Generating Itinerary...</span>
  </>
) : (
  <>
    <Sparkles className="w-4 h-4" />
    <span>Compile & Save Itinerary</span>
  </>
)}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {generatedResult ? (
              <div className="glass-card p-6 space-y-4 animate-fade-in">
<div className="relative h-48 rounded-xl overflow-hidden">
  <img src={generatedResult.trip.bannerImage} alt={generatedResult.trip.title} className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
  <h3 className="absolute bottom-3 left-4 text-lg font-bold text-white">
    {generatedResult.trip.title}
  </h3>
  <div className="absolute top-3 left-4 flex items-center gap-2">
    <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm text-white">
      {generatedResult.trip.matchPercentage || 'XX%'} Match
    </span>
    <span className="flex items-center text-sm text-yellow-400">
      {/* Simple star rating */}
      {Array.from({ length: Math.round(generatedResult.trip.rating || 4) }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L0 6.91l6.561-.954L10 0l3.439 5.956 6.561.954-4.244 4.635 1.122 6.545z"/></svg>
      ))}
    </span>
  </div>
</div>
{/* Day‑by‑day tab navigation */}
{generatedResult.itinerary?.days && (
  <div className="mt-4">
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {generatedResult.itinerary.days.map((day, idx) => (
        <button
          key={idx}
          onClick={() => setSelectedDay(idx)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${selectedDay === idx ? 'bg-[#355E4B] text-white' : 'bg-white text-[#355E4B]'}`}
        >Day {idx + 1}</button>
      ))}
    </div>
    <div className="mt-2 p-4 glass-card">
      <h4 className="font-semibold text-sm mb-2 text-[#2A2A2A]">{generatedResult.itinerary.days[selectedDay].title}</h4>
      <div className="space-y-3 mt-3">
        {['morning', 'afternoon', 'evening'].map(time => {
          const acts = generatedResult.itinerary.days[selectedDay][time];
          if (!acts || acts.length === 0) return null;
          return (
            <div key={time}>
              <h5 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1">{time}</h5>
              <div className="space-y-2">
                {acts.map((act, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-semibold text-[#1A3626] block">{act.title}</span>
                    <span className="text-[#8B8B8B] block mt-0.5">{act.description}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
                <p className="text-xs text-[#8B8B8B] leading-relaxed">{generatedResult.itinerary?.summary}</p>
                <button
                  onClick={() => navigate(`/trip-details/${generatedResult.trip._id}`)}
                  className="w-full bg-[#D4AF37] text-black text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                >
                  View Full Itinerary <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="glass-card bg-white flex flex-col items-center justify-center min-h-[500px] h-full relative overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center z-10">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 shadow-sm border border-[#D4AF37]/20">
                    <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A3626] mb-3">AI Itinerary Planner</h3>
                  <p className="text-sm text-[#8B8B8B] max-w-sm leading-relaxed">
                    Fill in the parameters and click Compile Itinerary.<br/>Your AI-generated trip will appear on your Dashboard<br/>and Active Trips instantly.
                  </p>
                </div>
                
                {/* Decorative map dotted line */}
                <div className="absolute bottom-16 left-0 right-0 h-24 opacity-30 pointer-events-none">
                  <svg viewBox="0 0 400 100" className="w-full h-full stroke-[#437A60] fill-none" preserveAspectRatio="none">
                    <path d="M 50,70 Q 150,110 250,60 T 350,40" strokeWidth="2" strokeDasharray="6 6" />
                    <circle cx="50" cy="70" r="4" className="fill-white stroke-[#437A60] stroke-2" />
                    <path d="M 50,66 L 46,56 A 8,8 0 1,1 54,56 Z" className="fill-white stroke-[#437A60] stroke-2" />
                    
                    <circle cx="350" cy="40" r="4" className="fill-white stroke-[#437A60] stroke-2" />
                    <path d="M 350,36 L 346,26 A 8,8 0 1,1 354,26 Z" className="fill-white stroke-[#437A60] stroke-2" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto glass-card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#2A2A2A] flex items-center gap-2">
              <PenTool className="w-4 h-4 text-[#D4AF37]" /> Create Trip Manually (No AI)
            </h3>
            <p className="text-xs text-[#8B8B8B] mt-0.5">Define custom dates, budget & notes for your own itinerary.</p>
          </div>

          <form onSubmit={handleCreateManual} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Trip Title</label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="e.g. Autumn Photography Tour in Kyoto"
                className="w-full glass-inset text-[#2A2A2A] p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50"
                required
              />
            </div>

            <div>
              <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Destination Name</label>
              <input
                type="text"
                value={manualDestination}
                onChange={(e) => setManualDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan"
                className="w-full glass-inset text-[#2A2A2A] p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Start Date</label>
                <input type="date" value={manualStart} onChange={(e) => setManualStart(e.target.value)} className="w-full glass-inset text-[#2A2A2A] p-3 rounded-xl focus:outline-none" required />
              </div>
              <div>
                <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">End Date</label>
                <input type="date" value={manualEnd} onChange={(e) => setManualEnd(e.target.value)} className="w-full glass-inset text-[#2A2A2A] p-3 rounded-xl focus:outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Total Planned Budget ({currencyInfo.symbol})</label>
              <input type="number" value={manualBudget} onChange={(e) => setManualBudget(e.target.value)} className="w-full glass-inset text-[#2A2A2A] p-3 rounded-xl focus:outline-none" />
            </div>

            <div>
              <label className="block text-[#8B8B8B] font-semibold mb-1 uppercase text-[10px]">Trip Notes</label>
              <textarea
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="Write your custom plan, hotel reservations, or flight numbers..."
                className="w-full glass-inset text-[#2A2A2A] p-3 rounded-xl h-28 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingManual}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-semibold text-xs py-3.5 rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isSavingManual ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Trip...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Trip</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
