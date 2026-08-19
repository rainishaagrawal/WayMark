import React, { useState } from 'react';
import { Dna, RefreshCw, Loader2, Info, Landmark, Mountain, Palmtree, Utensils, Globe, Scale, Heart } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const CustomTick = (props) => {
  const { payload, x, y, textAnchor, stroke, radius } = props;
  const isTop = y < 100;
  const isBottom = y > 200;
  const isLeft = x < 100;
  const isRight = x > 200;
  
  let Icon = Landmark;
  if (payload.value === 'Adventure') Icon = Mountain;
  if (payload.value === 'Relaxation') Icon = Palmtree;
  if (payload.value === 'Gastronomy') Icon = Utensils;

  return (
    <g className="recharts-layer recharts-polar-angle-axis-tick">
      <text x={x} y={y + (isBottom ? 25 : isTop ? -25 : 0)} textAnchor={textAnchor} fill="#2A2A2A" fontSize="12" fontWeight="600">
        {payload.value}
      </text>
      <foreignObject x={x - 12} y={y + (isBottom ? -10 : isTop ? -55 : -25)} width={24} height={24}>
        <Icon className="w-5 h-5 text-[#355E4B] mx-auto" />
      </foreignObject>
    </g>
  );
};

export default function TravelDNA() {
  const { user, refreshUser } = useAuth();
  const [recalibrating, setRecalibrating] = useState(false);

  const dna = user?.travelDNA;
  const scores = dna?.scores || { adventure: 50, culture: 50, relaxation: 50, food: 50 };

  const radarData = [
    { subject: 'Culture', You: scores.culture, Average: 50 },
    { subject: 'Adventure', You: scores.adventure, Average: 50 },
    { subject: 'Relaxation', You: scores.relaxation, Average: 50 },
    { subject: 'Gastronomy', You: scores.food, Average: 50 },
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
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div 
        className="relative bg-[#FAFAF5] rounded-[32px] overflow-hidden min-h-[160px] flex items-center px-6 md:px-10 border border-gray-100 shadow-sm"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F7F2] via-[#F5F7F2]/90 to-transparent" />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[20px] bg-[#FFF8E7] flex items-center justify-center shadow-sm border border-[#FDE68A]/50 flex-shrink-0">
              <Dna className="w-8 h-8 text-[#D97706]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight">
                Dynamic Travel <span className="text-[#D97706]">DNA</span> Profile
              </h1>
              <p className="text-sm text-[#8B8B8B] mt-1.5 leading-relaxed">
                Your evolving traveler personality, shaped by your trips.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRecalibrate}
            disabled={recalibrating}
            className="flex items-center gap-2 bg-[#E5B849] hover:bg-[#D4A736] text-[#1A3626] font-bold text-sm px-6 py-3.5 rounded-full shadow-sm transition-all disabled:opacity-60 shrink-0"
          >
            {recalibrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Re-calibrate with Memories</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Radar Chart */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider">Affinity Vector Radar</h3>
            <Info className="w-4 h-4 text-[#ADADAD]" />
          </div>
          
          <div className="flex-1 min-h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E5E5E7" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
                <Radar name="Average Traveler" dataKey="Average" stroke="#355E4B" fill="none" strokeDasharray="4 4" strokeWidth={2} />
                <Radar name="You" dataKey="You" stroke="#D97706" fill="#FDE68A" fillOpacity={0.6} strokeWidth={2} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600', color: '#2A2A2A' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Traits */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider">DNA Behavioral Traits</h3>
            <Info className="w-4 h-4 text-[#ADADAD]" />
          </div>

          {dna ? (
            <div className="space-y-4 flex-1">
              
              {/* Item 1 */}
              <div className="bg-[#F5F7F2] rounded-[24px] p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[18px] bg-[#355E4B] flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block text-sm mb-0.5">Primary Traits</span>
                    <p className="text-xs text-[#8B8B8B]">{dna.personalityTraits?.join(', ') || 'Cultural Explorer'}</p>
                  </div>
                </div>
                <div className="bg-[#EAF5EA] text-[#355E4B] px-3 py-1 rounded-full text-xs font-bold border border-[#355E4B]/20">
                  High
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-[#F5F7F2] rounded-[24px] p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[18px] bg-[#D97706] flex items-center justify-center shrink-0">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block text-sm mb-0.5">Spending Habit</span>
                    <p className="text-xs text-[#1A1A1A] font-semibold uppercase">{dna.spendingHabit || 'BALANCED'}</p>
                    <p className="text-[11px] text-[#8B8B8B] mt-0.5">Pace preference: {dna.pacePreference || 'MODERATE'}</p>
                  </div>
                </div>
                <div className="bg-[#FFF8E7] text-[#D97706] px-3 py-1 rounded-full text-xs font-bold border border-[#D97706]/20">
                  Balanced
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-[#F5F7F2] rounded-[24px] p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[18px] bg-[#8B5CF6] flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1A1A1A] block text-sm mb-0.5">Top Interests</span>
                    <p className="text-xs text-[#8B8B8B] truncate max-w-[200px]">
                      {dna.topInterests?.join(', ') || 'History, Street Food, Photography'}
                    </p>
                  </div>
                </div>
                <div className="bg-[#F3E8FF] text-[#8B5CF6] px-3 py-1 rounded-full text-xs font-bold border border-[#8B5CF6]/20">
                  High
                </div>
              </div>

              {/* Quote box */}
              <div className="bg-gradient-to-r from-[#F5F7F2] to-[#EAECE6] rounded-[24px] p-6 mt-6 relative overflow-hidden flex items-center">
                <div className="relative z-10 w-2/3">
                  <p className="text-sm text-[#355E4B] italic font-medium leading-relaxed">
                    "{dna.aiGeneratedSummary || 'Loves rich historical places and unique culinary experiences.'}"
                  </p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 mix-blend-multiply" 
                     style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center left' }}
                />
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-10 bg-[#F5F7F2] rounded-[24px] border border-dashed border-[#E5E5E7]">
              <p className="text-sm text-[#8B8B8B] text-center max-w-xs">
                Your Travel DNA will fill in automatically as you generate trips and save travel memories.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
