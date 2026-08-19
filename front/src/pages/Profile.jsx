import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { User, MapPin, Award, Dna, Shield, Camera, Edit2, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const INTEREST_OPTIONS = [
  'Culture', 'Adventure', 'Gastronomy', 'Relaxation', 'Nature',
  'Nightlife', 'History', 'Photography', 'Shopping', 'Wellness',
];

export default function Profile() {
  const { user, setUser, refreshUser } = useAuth();
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
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden border border-black/[0.07] bg-gradient-to-r from-[#14213D]/50 via-[#0B1220] to-[#1F1608]/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-4 left-6 flex items-end gap-4">
          <div className="relative">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-2xl border-2 border-[#D4AF37] overflow-hidden bg-white/[0.05] flex items-center justify-center relative group"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-[#D4AF37]" />
              )}
              <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                {uploadingAvatar ? <span className="text-[9px] text-[#2A2A2A]">Uploading...</span> : <Camera className="w-5 h-5 text-[#2A2A2A]" />}
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div className="mb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#2A2A2A]">{user?.name}</h1>
              {completedTrips > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {completedTrips} TRIP{completedTrips !== 1 ? 'S' : ''} COMPLETED
                </span>
              )}
            </div>
            <p className="text-xs text-[#8B8B8B] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {trips.length} trip{trips.length !== 1 ? 's' : ''} planned
            </p>
          </div>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={saving}
          className="absolute top-4 right-4 bg-black/60 hover:bg-white/90 border border-white/[0.1] text-xs font-semibold text-[#2A2A2A] px-3.5 py-2 rounded-xl backdrop-blur-md transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {isEditing ? <Check className="w-4 h-4 text-[#D4AF37]" /> : <Edit2 className="w-4 h-4 text-[#8B8B8B]" />}
          <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Passport'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Passport Details */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D4AF37]" /> Digital Passport
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-semibold uppercase">Full Name</label>
              {isEditing ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full glass-inset text-xs text-[#2A2A2A] p-2 rounded-xl mt-1" />
              ) : (
                <p className="text-sm font-semibold text-[#2A2A2A] mt-0.5">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-semibold uppercase">Email Address</label>
              <p className="text-xs text-[#2A2A2A] font-medium mt-0.5">{user?.email}</p>
            </div>

            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-semibold uppercase">Traveler Bio</label>
              {isEditing ? (
                <textarea value={travelBio} onChange={(e) => setTravelBio(e.target.value)} className="w-full glass-inset text-xs text-[#2A2A2A] p-2 rounded-xl mt-1 h-20 resize-none" />
              ) : (
                <p className="text-xs text-[#8B8B8B] mt-0.5 leading-relaxed">{travelBio || 'No bio added yet.'}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] text-[#8B8B8B] block font-semibold uppercase mb-1.5">Points of Interest</label>
              {isEditing ? (
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                        interests.includes(interest) ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40' : 'glass-inset text-[#8B8B8B]'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(interests.length > 0 ? interests : ['Not set yet']).map((i, idx) => (
                    <span key={idx} className="text-[10px] glass-inset text-[#2A2A2A] px-2.5 py-1 rounded-lg">{i}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Travel DNA & Badges */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider flex items-center gap-2 mb-4">
              <Dna className="w-4 h-4 text-[#D4AF37]" /> Travel DNA Snapshot
            </h3>

            {dna ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl glass-inset">
                  <span className="text-[10px] text-[#8B8B8B] block uppercase font-semibold">Culture</span>
                  <p className="text-sm font-bold text-[#D4AF37] mt-1">{dna.scores?.culture ?? 50}%</p>
                </div>
                <div className="p-4 rounded-xl glass-inset">
                  <span className="text-[10px] text-[#8B8B8B] block uppercase font-semibold">Adventure</span>
                  <p className="text-sm font-bold text-[#2A2A2A] mt-1">{dna.scores?.adventure ?? 50}%</p>
                </div>
                <div className="p-4 rounded-xl glass-inset">
                  <span className="text-[10px] text-[#8B8B8B] block uppercase font-semibold">Food</span>
                  <p className="text-sm font-bold text-[#2A2A2A] mt-1">{dna.scores?.food ?? 50}%</p>
                </div>
                <div className="p-4 rounded-xl glass-inset">
                  <span className="text-[10px] text-[#8B8B8B] block uppercase font-semibold">Spending</span>
                  <p className="text-sm font-bold text-[#355E4B] mt-1">{dna.spendingHabit || 'BALANCED'}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#8B8B8B]">Plan or complete a trip to start building your Travel DNA profile.</p>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#D4AF37]" /> Badges & Milestones
            </h3>
            {badges.length === 0 ? (
              <p className="text-xs text-[#8B8B8B]">Complete your first trip to earn your first badge!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {badges.map((b) => (
                  <span key={b._id} className="px-3 py-2 rounded-xl glass-inset text-xs font-medium text-[#2A2A2A] flex items-center gap-2">
                    {b.icon} {b.title}
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
