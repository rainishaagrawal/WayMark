import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { User, MapPin, Award, Dna, Shield, Camera, Edit2, Check, Landmark, Mountain, Utensils, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const INTEREST_OPTIONS = [
  'Culture', 'Adventure', 'Gastronomy', 'Relaxation', 'Nature',
  'Nightlife', 'History', 'Photography', 'Shopping', 'Wellness',
];

export default function Profile() {
  const { user, setUser } = useAuth();
  const { badges, fetchBadges, trips } = useTrips();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [travelBio, setTravelBio] = useState(user?.travelBio || '');
  const [interests, setInterests] = useState(user?.travelInterests || []);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleInterest = (interest) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch('/users/profile', { name, travelBio, travelInterests: interests });
      setUser(res.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(res.data);
      toast.success('Profile photo updated!');
    } catch (e) {
      toast.error(e.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const completedTrips = trips.filter((t) => t.status === 'COMPLETED').length;
  const dna = user?.travelDNA;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div 
        className="relative h-64 rounded-[32px] overflow-hidden shadow-sm bg-[#2A2A2A] flex items-end p-6 md:p-10"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-[28px] border-4 border-amber-400 overflow-hidden bg-white flex items-center justify-center relative group shadow-xl"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  {uploadingAvatar ? <span className="text-[10px] text-white font-bold">...</span> : <Camera className="w-6 h-6 text-white" />}
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            
            <div className="pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h1>
                {completedTrips > 0 && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-400/30">
                    {completedTrips} TRIPS COMPLETED
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-300 flex items-center gap-1.5 mt-2 font-medium">
                <MapPin className="w-4 h-4 text-amber-400" /> {trips.length} trips planned
              </p>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={saving}
            className="bg-[#2A2A2A] hover:bg-black text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 disabled:opacity-60 mb-2 border border-white/10 shadow-lg"
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Passport'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Passport Details */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" /> DIGITAL PASSPORT
          </h3>

          <div className="space-y-6 text-sm">
            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-bold uppercase tracking-wider mb-1.5">Full Name</label>
              {isEditing ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#FAFAFA] border border-gray-200 text-sm font-semibold text-[#1A1A1A] p-3 rounded-xl focus:outline-none focus:border-amber-400" />
              ) : (
                <p className="text-[15px] font-bold text-[#1A1A1A]">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-bold uppercase tracking-wider mb-1.5">Email Address</label>
              <p className="text-[15px] text-[#1A1A1A] font-medium">{user?.email}</p>
            </div>

            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-bold uppercase tracking-wider mb-1.5">Traveler Bio</label>
              {isEditing ? (
                <textarea value={travelBio} onChange={(e) => setTravelBio(e.target.value)} className="w-full bg-[#FAFAFA] border border-gray-200 text-sm font-medium text-[#1A1A1A] p-3 rounded-xl h-24 resize-none focus:outline-none focus:border-amber-400" />
              ) : (
                <p className="text-[15px] text-[#2A2A2A] leading-relaxed">{travelBio || 'No bio added yet.'}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-bold uppercase tracking-wider mb-2.5">Points of Interest</label>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                        interests.includes(interest) ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-[#FAFAFA] text-[#8B8B8B] border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(interests.length > 0 ? interests : ['Not set yet']).map((i, idx) => (
                    <span key={idx} className="bg-[#F5F7F2] text-[#2A2A2A] text-xs font-semibold px-4 py-2 rounded-full shadow-sm border border-[#F5F7F2]">{i}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Travel DNA & Badges */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2 mb-6">
              <Dna className="w-5 h-5 text-amber-500" /> TRAVEL DNA SNAPSHOT
            </h3>

            {dna ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="bg-[#FAFAFA] border border-gray-50 rounded-[24px] p-5 flex flex-col items-start gap-4">
                  <div className="p-2.5 bg-amber-50 rounded-full shrink-0">
                    <Landmark className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider block mb-1">Culture</span>
                    <p className="text-2xl font-bold text-amber-500">{dna.scores?.culture ?? 50}%</p>
                  </div>
                </div>

                <div className="bg-[#FAFAFA] border border-gray-50 rounded-[24px] p-5 flex flex-col items-start gap-4">
                  <div className="p-2.5 bg-emerald-50 rounded-full shrink-0">
                    <Mountain className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider block mb-1">Adventure</span>
                    <p className="text-2xl font-bold text-emerald-700">{dna.scores?.adventure ?? 50}%</p>
                  </div>
                </div>

                <div className="bg-[#FAFAFA] border border-gray-50 rounded-[24px] p-5 flex flex-col items-start gap-4">
                  <div className="p-2.5 bg-orange-50 rounded-full shrink-0">
                    <Utensils className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider block mb-1">Food</span>
                    <p className="text-2xl font-bold text-orange-600">{dna.scores?.food ?? 50}%</p>
                  </div>
                </div>

                <div className="bg-[#FAFAFA] border border-gray-50 rounded-[24px] p-5 flex flex-col items-start gap-4">
                  <div className="p-2.5 bg-green-50 rounded-full shrink-0">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider block mb-1">Spending</span>
                    <p className="text-[15px] font-bold text-green-700 mt-2 tracking-wide uppercase">{dna.spendingHabit || 'BALANCED'}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-6">
                 <p className="text-sm text-[#8B8B8B]">Plan or complete a trip to start building your Travel DNA profile.</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[160px]">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-amber-500" /> BADGES & MILESTONES
            </h3>
            {badges.length === 0 ? (
              <p className="text-sm text-[#8B8B8B]">Complete your first trip to earn your first badge!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {badges.map((b) => (
                  <span key={b._id} className="px-4 py-2.5 rounded-full bg-[#FAFAFA] border border-gray-100 text-xs font-semibold text-[#1A1A1A] flex items-center gap-2 shadow-sm">
                    <span className="text-lg">{b.icon}</span> {b.title}
                  </span>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

