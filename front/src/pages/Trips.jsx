import React, { useState } from 'react';
import { MapPin, Calendar, Plus, ArrowUpRight, CheckCircle2, Trash2, Loader2, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useCurrency } from '../context/CurrencyContext';

const formatDateRange = (start, end) => {
  if (!start || !end) return '';
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${new Date(start).toLocaleDateString('en-US', opts)} - ${new Date(end).toLocaleDateString('en-US', opts)}`;
};

// Returns a short, clean trip name for display
const getTripDisplayName = (t) => t.destinationName || t.title || 'Untitled Trip';

export default function Trips() {
  const navigate = useNavigate();
  const { trips, tripsLoading, deleteTrip, completeTrip } = useTrips();
  const { formatAmount } = useCurrency();
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this trip? This will also remove its packing list, journal entries and expenses.')) return;
    setProcessingId(tripId);
    await deleteTrip(tripId);
    setProcessingId(null);
  };

  const handleComplete = async (e, tripId) => {
    e.stopPropagation();
    setProcessingId(tripId);
    await completeTrip(tripId);
    setProcessingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative p-6 sm:p-8 bg-[#F9FBF8] rounded-[28px] border border-[#E5E5E7]/50 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle mountain graphic via SVG */}
        <div className="absolute right-0 bottom-0 pointer-events-none">
           <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 120L50 80L100 100L150 60L200 90L250 50L320 100L400 70V120H0Z" fill="#C9D4C5" opacity="0.3"/>
             <path d="M50 120L100 90L150 110L200 70L270 105L350 60L400 80V120H50Z" fill="#A7BCA1" opacity="0.4"/>
             <path d="M100 120L150 100L200 115L250 80L320 110L400 90V120H100Z" fill="#355E4B" opacity="0.1"/>
             <path d="M0 60 C 50 40, 80 80, 130 65 S 180 30, 250 55" stroke="#8B8B8B" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.4"/>
             <circle cx="250" cy="55" r="4" fill="#355E4B" opacity="0.5"/>
           </svg>
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF6E1] flex items-center justify-center shrink-0 shadow-sm">
            <MapPin className="w-6 h-6 text-[#C9A227]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              My Active & Created Trips ({trips.length})
            </h1>
            <p className="text-[13px] text-[#8B8B8B] mt-1 max-w-sm">Manage itineraries, budgets, and complete trips to grow your Travel DNA.</p>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#ADADAD] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trips..."
              className="w-full bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-[#355E4B] transition-colors shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#1A1A1A] transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Trip</span>
          </button>
        </div>
      </div>

      {tripsLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <MapPin className="w-10 h-10 text-[#8B8B8B] mb-3" />
          <h3 className="text-sm font-bold text-[#1A1A1A]">No trips yet</h3>
          <p className="text-xs text-[#8B8B8B] mt-1 mb-4 max-w-sm">Start planning with AI or build one manually to see it here.</p>
          <button
            onClick={() => navigate('/planner')}
            className="bg-[#D4AF37] hover:brightness-110 text-black text-xs font-semibold px-5 py-2.5 rounded-xl shadow-glow transition-all"
          >
            Plan Your First Trip
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {searchQuery && (
            <p className="text-xs text-[#8B8B8B] px-1">
              Showing results for <span className="text-[#1A1A1A] font-semibold">"{searchQuery}"</span>
              {' — '}{trips.filter(t => getTripDisplayName(t).toLowerCase().includes(searchQuery.toLowerCase()) || t.destination?.toLowerCase().includes(searchQuery.toLowerCase())).length} found
            </p>
          )}
          {/* No results state */}
          {searchQuery && trips.filter(t =>
            t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.destination?.toLowerCase().includes(searchQuery.toLowerCase())
          ).length === 0 ? (
            <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-10 text-center flex flex-col items-center justify-center">
              <Search className="w-8 h-8 text-[#E5E5E7] mb-3" />
              <h3 className="text-sm font-bold text-[#1A1A1A]">No trips found for "{searchQuery}"</h3>
              <p className="text-xs text-[#8B8B8B] mt-1 mb-4">Try a different name or plan a new trip to this destination.</p>
              <button onClick={() => navigate('/planner')} className="bg-[#D4AF37] hover:brightness-110 text-black text-xs font-semibold px-5 py-2.5 rounded-xl shadow-glow transition-all">
                Plan a Trip
              </button>
            </div>
          ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips
            .filter((t) =>
              !searchQuery ||
              getTripDisplayName(t).toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.destination?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((t) => (
            <div
              key={t._id}
              onClick={() => navigate(`/trip-details/${t._id}`)}
              className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm overflow-hidden cursor-pointer group flex flex-col transition-all hover:shadow-md hover:border-[#D4AF37]/30"
            >
              <div className="relative h-48 w-full">
                <img src={t.bannerImage} alt={t.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 origin-center" />
                <span
                  className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full ${
                    t.status === 'COMPLETED'
                      ? 'bg-[#EAF5EA] text-[#355E4B]'
                      : 'bg-black/70 text-[#D4AF37] backdrop-blur-sm'
                  }`}
                >
                  {t.status}
                </span>
                {t.isAiGenerated && (
                  <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full bg-[#1A3626]/80 text-[#EAF5EA] backdrop-blur-sm">
                    AI GENERATED
                  </span>
                )}
                {t.isGroupShared && !t.isAiGenerated && (
                  <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full bg-black/70 text-[#A78BFA] backdrop-blur-sm">
                    GROUP SHARED
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[#1A1A1A] line-clamp-1">{getTripDisplayName(t)}</h3>
                <p className="text-sm text-[#8B8B8B] flex items-center gap-1.5 mt-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" /> {formatDateRange(t.startDate, t.endDate)}
                </p>
                
                <div className="mt-4 pt-4 border-t border-[#E5E5E7] flex items-center justify-between text-sm mb-5">
                  <span className="text-[#8B8B8B]">
                    Budget: <strong className="text-[#1A1A1A]">{formatAmount(t.budget?.totalAmount || 0)}</strong>
                  </span>
                  <span className="text-[#D4AF37] font-bold flex items-center gap-1 group-hover:underline">
                    Details <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  {t.status !== 'COMPLETED' ? (
                    <button
                      onClick={(e) => handleComplete(e, t._id)}
                      disabled={processingId === t._id}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#EAF5EA] hover:bg-[#D5EAD5] text-[#1A1A1A] text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#355E4B]" /> Complete
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 bg-[#F5F7F2] text-[#8B8B8B] text-sm font-semibold py-3 rounded-xl border border-[#E5E5E7]/50">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </div>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, t._id)}
                    disabled={processingId === t._id}
                    className="flex items-center justify-center bg-[#FCE8E8] hover:bg-[#F9D6D6] text-[#E02424] py-3 px-4 rounded-xl transition-colors disabled:opacity-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
          )}
        </div>
      )}
    </div>
  );
}
