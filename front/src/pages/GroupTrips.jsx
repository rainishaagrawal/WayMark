import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldCheck, Copy, Trash2, X, Loader2, Plus, MapPin, DollarSign, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useTrips } from '../context/TripContext';

// Returns a short, clean trip name for display
const getTripDisplayName = (t) => t?.destinationName || t?.title || 'Untitled Trip';

export default function GroupTrips() {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [groupTrips, setGroupTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [openGroupMembers, setOpenGroupMembers] = useState([]);
  const [groupTripDetails, setGroupTripDetails] = useState(null);
  const [itineraryExpanded, setItineraryExpanded] = useState(false);

  useEffect(() => {
    fetchGroupTrips();
  }, []);

  const fetchGroupTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/groups/mine');
      setGroupTrips(res.data || []);
    } catch (e) {
      // Silent - just show empty state
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedTripId) {
      toast.error('Please select which trip to share');
      return;
    }
    setCreating(true);
    try {
      await api.post('/groups', { tripId: selectedTripId, description });
      toast.success('Group trip created! Share the invite code with your travel companions.');
      setShowCreateModal(false);
      setSelectedTripId('');
      setDescription('');
      fetchGroupTrips();
    } catch (e) {
      toast.error(e.message || 'Failed to create group trip');
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      await api.post('/groups/invite', { inviteCode: joinCode.trim().toUpperCase() });
      toast.success('Joined group trip successfully!');
      setJoinCode('');
      fetchGroupTrips();
    } catch (e) {
      toast.error(e.message || 'Invalid invite code');
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this group trip? All members will lose access.')) return;
    try {
      await api.delete(`/groups/${id}`);
      toast.success('Group trip deleted');
      fetchGroupTrips();
    } catch (e) {
      toast.error(e.message || 'Failed to delete group trip');
    }
  };

  const openGroupDetail = async (group) => {
    setOpenGroup(group);
    setItineraryExpanded(false);
    setGroupTripDetails(null);
    try {
      const res = await api.get(`/groups/${group._id}`);
      setOpenGroupMembers(res.data.members || []);
    } catch (e) {
      setOpenGroupMembers([]);
    }
    // Also load the trip's full details (itinerary)
    try {
      const tripRes = await api.get(`/trips/${group.trip?._id}`);
      setGroupTripDetails(tripRes.data);
    } catch (e) {
      setGroupTripDetails(null);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Invite code copied to clipboard!');
  };

  const tripsWithoutGroup = trips.filter((t) => !groupTrips.some((g) => g.trip?._id === t._id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative p-6 sm:p-8 bg-[#F9FBF8] rounded-[28px] border border-[#E5E5E7]/50 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle mountain graphic via SVG */}
        <div className="absolute right-0 bottom-0 pointer-events-none">
           <svg width="500" height="150" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 150L60 100L120 120L180 80L250 110L320 60L400 120L500 80V150H0Z" fill="#C9D4C5" opacity="0.3"/>
             <path d="M60 150L120 110L180 130L250 90L330 125L420 70L500 90V150H60Z" fill="#A7BCA1" opacity="0.4"/>
             <path d="M120 150L180 120L250 140L320 100L400 130L500 110V150H120Z" fill="#355E4B" opacity="0.1"/>
             <path d="M0 80 C 60 50, 100 100, 160 85 S 220 40, 300 70 S 400 30, 480 50" stroke="#8B8B8B" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.4"/>
             <circle cx="160" cy="85" r="4" fill="#355E4B" opacity="0.5"/>
             <circle cx="300" cy="70" r="4" fill="#355E4B" opacity="0.5"/>
             <circle cx="480" cy="50" r="4" fill="#355E4B" opacity="0.5"/>
           </svg>
        </div>
        
        {/* Decorative Circle Icon overlaying mountains on far right */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-[#EAF5EA] border border-[#355E4B]/10 flex items-center justify-center opacity-80 md:flex hidden pointer-events-none">
          <Users className="w-8 h-8 text-[#355E4B]" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF6E1] flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-6 h-6 text-[#C9A227]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Group Trip Collaboration</h1>
            <p className="text-[13px] text-[#8B8B8B] mt-1 max-w-sm leading-relaxed">
              Share your trips with travel companions and split expenses together.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter invite code"
              className="bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] px-5 py-3 rounded-full focus:outline-none focus:border-[#355E4B] transition-colors shadow-sm w-full sm:w-48"
            />
            <button
              type="submit"
              disabled={joining}
              className="bg-white hover:bg-[#F5F7F2] border border-[#E5E5E7] text-[#1A1A1A] text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-sm disabled:opacity-50 shrink-0"
            >
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
            </button>
          </form>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md w-full sm:w-auto shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Group Trip</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : groupTrips.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
          <Users className="w-10 h-10 text-[#8B8B8B] mb-3" />
          <h3 className="text-sm font-bold text-[#2A2A2A]">No group trips yet</h3>
          <p className="text-xs text-[#8B8B8B] mt-1 mb-4 max-w-sm">
            Share one of your existing trips with friends and family, or join a group with an invite code.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2.5 rounded-xl shadow-glow"
          >
            Create Your First Group Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupTrips.map((g) => (
            <div key={g._id} onClick={() => openGroupDetail(g)} className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm overflow-hidden cursor-pointer group flex flex-col transition-all hover:shadow-md hover:border-[#D4AF37]/30">
              <div className="relative h-48 w-full p-2">
                <img src={g.trip?.bannerImage} alt={g.trip?.title} className="w-full h-full object-cover rounded-t-[20px] rounded-b-xl group-hover:scale-[1.02] transition-transform duration-500 origin-center" />
              </div>
              <div className="p-5 flex-1 flex flex-col space-y-4">
                
                {/* Header: Title and Members / Role */}
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A] line-clamp-1 mb-2">{getTripDisplayName(g.trip)}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B8B8B] font-medium flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#D4AF37]" /> {g.memberCount} member{g.memberCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[10px] font-bold text-[#C9A227] bg-[#FFF6E1] px-3 py-1 rounded-full uppercase tracking-wider">{g.myRole}</span>
                  </div>
                </div>

                {/* Invite Code Field */}
                <div className="flex items-center justify-between bg-[#F5F7F2] border border-[#E5E5E7]/60 px-4 py-3 rounded-xl mt-auto group-hover:border-[#D4AF37]/30 transition-colors">
                  <span className="text-sm font-mono font-medium text-[#1A1A1A] tracking-wider">{g.inviteCode}</span>
                  <button onClick={(e) => { e.stopPropagation(); copyCode(g.inviteCode); }} className="text-[#8B8B8B] hover:text-[#D4AF37] transition-colors p-1">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Delete Button */}
                {g.myRole === 'ADMIN' && (
                  <button
                    onClick={(e) => handleDelete(e, g._id)}
                    className="w-full flex items-center justify-center gap-2 text-[#E02424] hover:text-[#B91C1C] text-sm font-semibold py-2 transition-colors mt-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Group
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2A2A2A]">Create Group Trip</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#8B8B8B] hover:text-[#2A2A2A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {tripsWithoutGroup.length === 0 ? (
              <p className="text-xs text-[#8B8B8B]">
                All your trips are already shared, or you have no trips yet.{' '}
                <button onClick={() => navigate('/planner')} className="text-[#D4AF37] hover:underline">
                  Plan a new trip
                </button>{' '}
                to share it with a group.
              </p>
            ) : (
              <>
                <div>
                  <label className="text-[10px] text-[#8B8B8B] block font-semibold mb-1 uppercase">Which trip do you want to share?</label>
                  <select
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full glass-inset text-[#2A2A2A] text-xs p-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="">Select a trip...</option>
                    {tripsWithoutGroup.map((t) => (
                      <option key={t._id} value={t._id}>{getTripDisplayName(t)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#8B8B8B] block font-semibold mb-1 uppercase">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full glass-inset text-[#2A2A2A] text-xs p-2.5 rounded-xl h-16 focus:outline-none resize-none"
                    placeholder="e.g. Our summer group trip!"
                  />
                </div>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black font-semibold text-xs py-3 rounded-xl shadow-glow disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create & Get Invite Code'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Group Detail Modal */}
      {openGroup && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2A2A2A]">{getTripDisplayName(openGroup.trip)}</h3>
              <button onClick={() => setOpenGroup(null)} className="text-[#8B8B8B] hover:text-[#2A2A2A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between glass-inset px-3 py-2.5 rounded-xl">
              <div>
                <span className="text-[9px] text-[#8B8B8B] block uppercase font-semibold">Invite Code</span>
                <span className="text-sm font-mono text-[#D4AF37]">{openGroup.inviteCode}</span>
              </div>
              <button onClick={() => copyCode(openGroup.inviteCode)} className="text-[#8B8B8B] hover:text-[#D4AF37]">
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-[10px] text-[#8B8B8B] font-bold uppercase mb-2">Members ({openGroupMembers.length})</h4>
              <div className="space-y-2">
                {openGroupMembers.map((m) => (
                  <div key={m._id} className="flex items-center justify-between p-2.5 rounded-xl glass-inset">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center overflow-hidden">
                        {m.user?.avatar ? (
                          <img src={m.user.avatar} alt={m.user?.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-4 h-4 text-[#D4AF37]" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#2A2A2A]">{m.user?.name}</span>
                    </div>
                    <span className="text-[10px] text-[#D4AF37] font-bold">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline Itinerary preview toggle */}
            {groupTripDetails && (
              <div>
                <button
                  onClick={() => setItineraryExpanded(!itineraryExpanded)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl glass-inset text-xs font-semibold text-[#D4AF37] hover:bg-white/[0.05] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Trip Itinerary ({groupTripDetails.tripDays?.length || 0} Days)
                  </span>
                  {itineraryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {itineraryExpanded && (
                  <div className="mt-2 space-y-3 max-h-60 overflow-y-auto pr-1">
                    {(!groupTripDetails.tripDays || groupTripDetails.tripDays.length === 0) ? (
                      <p className="text-xs text-[#8B8B8B] p-2">{groupTripDetails.notes || 'No day-by-day itinerary yet.'}</p>
                    ) : (
                      groupTripDetails.tripDays.map((day, idx) => (
                        <div key={day._id || idx} className="p-3 rounded-xl glass-inset space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#D4AF37] text-black font-bold text-[10px] flex items-center justify-center">
                              {day.dayNumber || idx + 1}
                            </span>
                            <h5 className="text-xs font-bold text-[#2A2A2A]">Day {day.dayNumber || idx + 1}</h5>
                          </div>
                          <div className="space-y-1 pl-7 text-[11px] text-[#8B8B8B]">
                            {[...(day.morning || []), ...(day.afternoon || []), ...(day.evening || [])].map((act, actIdx) => (
                              <div key={actIdx} className="flex items-start gap-1.5">
                                <Clock className="w-3 h-3 text-[#D4AF37] mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[#2A2A2A] font-medium">{act.title}</span>
                                  {act.description && <p className="text-[10px] text-[#8B8B8B]">{act.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { setOpenGroup(null); navigate(`/trip-details/${openGroup.trip?._id}`); }}
                className="flex items-center justify-center gap-1.5 glass-inset text-[#2A2A2A] text-xs font-semibold py-2.5 rounded-xl"
              >
                <MapPin className="w-3.5 h-3.5" /> Full Itinerary Page
              </button>
              <button
                onClick={() => { setOpenGroup(null); navigate(`/expenses?tripId=${openGroup.trip?._id}`); }}
                className="flex items-center justify-center gap-1.5 bg-[#D4AF37] text-black text-xs font-semibold py-2.5 rounded-xl"
              >
                <DollarSign className="w-3.5 h-3.5" /> Split Expenses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
