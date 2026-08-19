import React, { useState } from 'react';
import { Dna, RefreshCw, Loader2 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export default function TravelDNA() {
  const { user, refreshUser } = useAuth();
  const [recalibrating, setRecalibrating] = useState(false);

  const dna = user?.travelDNA;
  const scores = dna?.scores || { adventure: 50, culture: 50, relaxation: 50, food: 50 };

  const radarData = [
    { subject: 'Culture', A: scores.culture },
    { subject: 'Adventure', A: scores.adventure },
    { subject: 'Relaxation', A: scores.relaxation },
    { subject: 'Gastronomy', A: scores.food },
  ];

  const handleRecalibrate = async () => {
    setRecalibrating(true);
    try {
      await api.get('/memory/travel-dna');
      await refreshUser();
      toast.success('Travel DNA re-calibrated using your saved memories!');
    } catch (e) {
      toast.error(e.message || 'Failed to re-calibrate. Add some memories first.');
    } finally {
      setRecalibrating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 glass-card flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2A2A2A] flex items-center gap-2">
            <Dna className="w-5 h-5 text-[#D4AF37]" /> Dynamic Travel DNA Profile
          </h1>
          <p className="text-xs text-[#8B8B8B] mt-0.5">
            {dna ? 'Your evolving traveler personality, shaped by your trips.' : 'Plan or complete a trip to start building your profile.'}
          </p>
        </div>

        <button
          onClick={handleRecalibrate}
          disabled={recalibrating}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-semibold text-xs px-4 py-2.5 rounded-xl shadow-glow disabled:opacity-60"
        >
          {recalibrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Re-calibrate with Memories</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider mb-4">Affinity Vector Radar</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1E2A44" />
                <PolarAngleAxis dataKey="subject" stroke="#355E4B" tick={{ fontSize: 12 }} />
                <Radar name="Travel DNA" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider">DNA Behavioral Traits</h3>
          {dna ? (
            <div className="space-y-3 text-xs">
              {dna.personalityTraits?.length > 0 && (
                <div className="p-3.5 rounded-xl glass-inset">
                  <span className="font-bold text-[#2A2A2A] block mb-1">Primary Traits</span>
                  <p className="text-[11px] text-[#8B8B8B]">{dna.personalityTraits.join(', ')}</p>
                </div>
              )}
              <div className="p-3.5 rounded-xl glass-inset">
                <span className="font-bold text-[#2A2A2A] block mb-1">Spending Habit: {dna.spendingHabit}</span>
                <p className="text-[11px] text-[#8B8B8B]">Pace preference: {dna.pacePreference}</p>
              </div>
              {dna.topInterests?.length > 0 && (
                <div className="p-3.5 rounded-xl glass-inset">
                  <span className="font-bold text-[#2A2A2A] block mb-1">Top Interests</span>
                  <p className="text-[11px] text-[#8B8B8B]">{dna.topInterests.join(', ')}</p>
                </div>
              )}
              {dna.aiGeneratedSummary && (
                <div className="p-3.5 rounded-xl glass-inset">
                  <p className="text-[11px] text-[#8B8B8B] leading-relaxed italic">"{dna.aiGeneratedSummary}"</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#8B8B8B]">
              Your Travel DNA will fill in automatically as you generate trips with the AI Planner and save travel memories.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
