import React, { useEffect, useState, useRef } from 'react';
import { Calendar, MapPin, CheckCircle2, Clock, Sparkles, Loader2, Camera, DollarSign, PackageCheck, BookOpen, Edit2, Plus, Trash2, Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const formatDateRange = (start, end) => {
  if (!start || !end) return '';
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${new Date(start).toLocaleDateString('en-US', opts)} - ${new Date(end).toLocaleDateString('en-US', opts)}`;
};

// Returns a short, clean trip name for display
const getTripDisplayName = (t) => t?.destinationName || t?.title || 'Untitled Trip';

export default function TripDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getTripById, activeTrip, completeTrip, updateTripBanner, updateTripDays } = useTrips();
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editableDays, setEditableDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getTripById(id);
      setLoading(false);
    };
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const trip = activeTrip && activeTrip._id === id ? activeTrip : null;

  useEffect(() => {
    if (trip?.tripDays) {
      setEditableDays(JSON.parse(JSON.stringify(trip.tripDays)));
    } else {
      setEditableDays([]);
    }
  }, [trip]);

  const toggleEditMode = () => {
    if (isEditing) {
      setEditableDays(JSON.parse(JSON.stringify(trip?.tripDays || [])));
    }
    setIsEditing(!isEditing);
  };

  const handleAddDay = () => {
    setEditableDays([...editableDays, { dayNumber: editableDays.length + 1, date: new Date(), morning: [], afternoon: [], evening: [] }]);
  };

  const handleAddActivity = (dayIndex, timeOfDay) => {
    const updated = [...editableDays];
    if (!updated[dayIndex][timeOfDay]) updated[dayIndex][timeOfDay] = [];
    updated[dayIndex][timeOfDay].push({ title: '', description: '' });
    setEditableDays(updated);
  };

  const handleActivityChange = (dayIndex, timeOfDay, actIndex, field, value) => {
    const updated = [...editableDays];
    updated[dayIndex][timeOfDay][actIndex][field] = value;
    setEditableDays(updated);
  };

  const handleRemoveActivity = (dayIndex, timeOfDay, actIndex) => {
    const updated = [...editableDays];
    updated[dayIndex][timeOfDay].splice(actIndex, 1);
    setEditableDays(updated);
  };

  const handleSaveItinerary = async () => {
    setIsSaving(true);
    await updateTripDays(id, editableDays);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Convert to a data URL so it's a real image the user chose (no external
    // upload dependency needed here since we just persist the URL string).
    const reader = new FileReader();
    reader.onload = async () => {
      await updateTripBanner(id, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleComplete = async () => {
    setCompleting(true);
    await completeTrip(id);
    setCompleting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-sm text-[#2A2A2A]">Trip not found.</p>
        <button onClick={() => navigate('/trips')} className="text-[#D4AF37] text-xs font-semibold mt-2 hover:underline">
          Back to Trips
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="relative h-64 rounded-2xl overflow-hidden border border-black/[0.07]">
        <img src={trip.bannerImage} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold border border-[#D4AF37]/30 uppercase">
              {trip.status}
            </span>
            <h1 className="text-2xl font-bold text-white mt-1 drop-shadow-md">{getTripDisplayName(trip)}</h1>
            <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5 drop-shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {formatDateRange(trip.startDate, trip.endDate)}
            </p>
            {trip.destinationName && (
              <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5 drop-shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {trip.destinationName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black/60 backdrop-blur-md hover:bg-white text-xs font-semibold text-white hover:text-black transition-colors px-3.5 py-2 rounded-xl border border-white/[0.1] flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-[#D4AF37]" /> Change Banner
            </button>
            <button
              onClick={() => navigate('/expenses')}
              className="bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black font-semibold text-xs px-4 py-2 rounded-xl shadow-glow"
            >
              Expense Tracker
            </button>
          </div>
        </div>
      </div>

      {/* Quick action row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button onClick={() => navigate('/packing')} className="glass-card p-4 flex items-center gap-2.5 hover:border-[#D4AF37]/30 !rounded-xl">
          <PackageCheck className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-semibold text-[#2A2A2A]">Packing List</span>
        </button>
        <button onClick={() => navigate('/journal')} className="glass-card p-4 flex items-center gap-2.5 hover:border-[#D4AF37]/30 !rounded-xl">
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-semibold text-[#2A2A2A]">Travel Journal</span>
        </button>
        <button onClick={() => navigate('/expenses')} className="glass-card p-4 flex items-center gap-2.5 hover:border-[#D4AF37]/30 !rounded-xl">
          <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-semibold text-[#2A2A2A]">Expenses</span>
        </button>
      </div>

      {/* Itinerary */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider">Day-by-Day Execution Plan</h3>
          <button onClick={toggleEditMode} className="text-[#D4AF37] hover:bg-[#D4AF37]/10 p-2 rounded-xl transition-colors flex items-center gap-1 text-[10px] font-bold uppercase">
            {isEditing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
          </button>
        </div>

        {(!editableDays || editableDays.length === 0) && !isEditing ? (
          <p className="text-xs text-[#8B8B8B]">
            {trip.notes || 'No day-by-day itinerary yet. Click Edit to create one.'}
          </p>
        ) : (
          <div className="space-y-4">
            {editableDays.map((day, i) => (
              <div key={day._id || i} className="p-4 rounded-xl glass-inset">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-lg bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center shadow-sm">
                    {day.dayNumber || i + 1}
                  </span>
                  <h4 className="text-xs font-bold text-[#2A2A2A]">Day {day.dayNumber || i + 1}</h4>
                </div>
                
                <div className="space-y-4 pl-8">
                  {['morning', 'afternoon', 'evening'].map(timeOfDay => (
                    <div key={timeOfDay}>
                      <h5 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wide mb-2 flex items-center justify-between">
                        {timeOfDay}
                        {isEditing && (
                          <button onClick={() => handleAddActivity(i, timeOfDay)} className="text-[#8B8B8B] hover:text-[#2A2A2A] transition-colors p-1 bg-black/5 rounded-lg">
                            <Plus className="w-3 h-3" />
                          </button>
                        )}
                      </h5>
                      <div className="space-y-2">
                        {(!day[timeOfDay] || day[timeOfDay].length === 0) && !isEditing ? (
                          <p className="text-[11px] text-[#8B8B8B] italic">No activities planned.</p>
                        ) : null}
                        
                        {(day[timeOfDay] || []).map((act, idx) => (
                          <div key={idx} className="flex items-start gap-2 relative group">
                            <Clock className="w-3.5 h-3.5 text-[#D4AF37] mt-1 shrink-0" />
                            {isEditing ? (
                              <div className="flex-1 space-y-2 pr-6">
                                <input
                                  type="text"
                                  value={act.title}
                                  onChange={(e) => handleActivityChange(i, timeOfDay, idx, 'title', e.target.value)}
                                  placeholder="Activity Title"
                                  className="w-full bg-white border border-gray-200 text-[#1A3626] placeholder-[#8B8B8B] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#437A60] focus:ring-1 focus:ring-[#437A60] shadow-sm"
                                />
                                <input
                                  type="text"
                                  value={act.description}
                                  onChange={(e) => handleActivityChange(i, timeOfDay, idx, 'description', e.target.value)}
                                  placeholder="Brief description (optional)"
                                  className="w-full bg-white border border-gray-200 text-[#1A3626] placeholder-[#8B8B8B] text-[11px] px-3 py-2 rounded-lg focus:outline-none focus:border-[#437A60] focus:ring-1 focus:ring-[#437A60] shadow-sm"
                                />
                                <button onClick={() => handleRemoveActivity(i, timeOfDay, idx)} className="absolute top-1 right-0 text-red-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-red-50 p-1.5 rounded-lg">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <span className="text-[#2A2A2A] font-medium text-xs">{act.title}</span>
                                {act.description && <p className="text-[11px] text-[#8B8B8B]">{act.description}</p>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {isEditing && (
              <div className="pt-4 flex items-center justify-between border-t border-black/5 mt-4">
                <button onClick={handleAddDay} className="flex items-center gap-2 text-[11px] font-semibold text-[#355E4B] hover:bg-[#355E4B]/10 px-4 py-2.5 rounded-xl transition-colors">
                  <Plus className="w-4 h-4" /> Add Next Day
                </button>
                <button onClick={handleSaveItinerary} disabled={isSaving} className="bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-semibold text-xs px-6 py-2.5 rounded-xl shadow-glow flex items-center gap-2 disabled:opacity-60 transition-all">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Itinerary
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complete trip CTA */}
      {trip.status !== 'COMPLETED' ? (
        <button
          onClick={handleComplete}
          disabled={completing}
          className="w-full glass-card !rounded-2xl p-5 flex items-center justify-center gap-2 text-[#355E4B] font-semibold text-sm hover:border-[#355E4B]/40 transition-all disabled:opacity-60"
        >
          {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {completing ? 'Completing Trip...' : 'Mark Trip as Completed'}
        </button>
      ) : (
        <div className="glass-card p-5 flex items-center justify-center gap-2 text-[#355E4B] font-semibold text-sm">
          <Sparkles className="w-5 h-5" /> This trip is completed — your Travel DNA & Analytics are updated!
        </div>
      )}
    </div>
  );
}
