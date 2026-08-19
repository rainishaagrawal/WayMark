import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, TrendingUp, Plane, MapPin as Globe, Briefcase, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import api from '../utils/axios';
import { useCurrency } from '../context/CurrencyContext';

const CATEGORY_LABELS = {
  flights: 'Flights', hotels: 'Hotels', food: 'Food', shopping: 'Shopping',
  transport: 'Transport', activities: 'Activities', miscellaneous: 'Other',
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = {
  flights: '#93C5FD', hotels: '#A78BFA', food: '#FBBF24', shopping: '#F472B6',
  transport: '#34D399', activities: '#60A5FA', miscellaneous: '#9CA3AF'
};
const PIE_COLORS = ['#A78BFA', '#60A5FA', '#93C5FD', '#E5E7EB'];

export default function Analytics() {
  const { formatAmount } = useCurrency();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/user');
      setAnalytics(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const { categoryData, monthlyData, totalDestinations } = useMemo(() => {
    if (!analytics) return { categoryData: [], monthlyData: [], totalDestinations: 0 };
    
    const catData = Object.entries(analytics.categoryBreakdown || {}).map(([key, value]) => ({
      name: CATEGORY_LABELS[key] || key,
      key,
      amount: value
    }));

    const mData = (analytics.monthlySpending || Array(12).fill(0)).map((amount, i) => ({
      name: MONTHS[i],
      amount
    }));

    const totalDest = (analytics.topDestinations || []).reduce((sum, item) => sum + item.count, 0);

    return { categoryData: catData, monthlyData: mData, totalDestinations: totalDest };
  }, [analytics]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  // Ensure topDestinations handles empty properly and computes percentages
  const topDestinations = (analytics?.topDestinations || []).map(dest => ({
    ...dest,
    percentage: totalDestinations > 0 ? Math.round((dest.count / totalDestinations) * 100) : 0
  }));
  if (topDestinations.length === 0) topDestinations.push({ name: 'None', count: 1, percentage: 100 });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div className="relative bg-white rounded-[32px] overflow-hidden min-h-[160px] flex items-center px-6 md:px-10 shadow-sm border border-gray-100">
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none w-1/2 h-full"
             style={{ backgroundImage: 'radial-gradient(circle at right bottom, #60A5FA, transparent 70%)' }} />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-[#60A5FA] flex items-center justify-center shadow-md flex-shrink-0">
              <Activity className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight">
                Travel Analytics & Spending Insights
              </h1>
              <p className="text-sm text-[#8B8B8B] mt-1.5 leading-relaxed">
                Your travel frequency, budget allocation & country coverage — updated as you complete trips.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowOverview(true)}
            className="flex items-center gap-2 bg-[#F5F7F2] hover:bg-[#E5E5E7] text-[#60A5FA] font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all shrink-0">
            <Plane className="w-4 h-4" />
            <span>2024 Overview</span>
          </button>
        </div>
      </div>

      {showOverview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowOverview(false)}>
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-[#60A5FA] rounded-full border-4 border-white flex items-center justify-center">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div className="text-center mt-10 mb-6">
              <h2 className="text-2xl font-bold text-[#1A1A1A]">2024 Year in Review</h2>
              <p className="text-[#8B8B8B] text-sm mt-1">Here is how you travelled this year!</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#FAFAFA] p-4 rounded-[20px] flex justify-between items-center border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#EBF5FF] rounded-xl"><Globe className="w-5 h-5 text-[#60A5FA]" /></div>
                  <span className="font-semibold text-sm">Countries Visited</span>
                </div>
                <span className="font-bold text-lg text-[#1A1A1A]">{analytics?.countriesVisited?.length || 0}</span>
              </div>
              
              <div className="bg-[#FAFAFA] p-4 rounded-[20px] flex justify-between items-center border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl"><Briefcase className="w-5 h-5 text-emerald-500" /></div>
                  <span className="font-semibold text-sm">Trips Taken</span>
                </div>
                <span className="font-bold text-lg text-[#1A1A1A]">{analytics?.totalTripsCount || 0}</span>
              </div>

              <div className="bg-[#FAFAFA] p-4 rounded-[20px] flex justify-between items-center border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-xl"><Activity className="w-5 h-5 text-amber-500" /></div>
                  <span className="font-semibold text-sm">Total Spending</span>
                </div>
                <span className="font-bold text-lg text-[#1A1A1A]">{formatAmount(analytics?.totalExpensesAmount || 0)}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowOverview(false)}
              className="mt-8 w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-3.5 rounded-full transition-colors">
              Close Overview
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Spending by Category */}
          <div className="bg-white rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100 flex flex-col h-[420px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#1A1A1A]">Spending by Category</h3>
              <select className="bg-[#F5F7F2] text-[#8B8B8B] text-xs font-bold px-4 py-2 rounded-full border-none focus:ring-0 cursor-pointer appearance-none">
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="flex-1 w-full relative -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} barSize={24}>
                  <CartesianGrid vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}K` : val} />
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.key] || COLORS.miscellaneous} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex items-center justify-between bg-[#FAFAFA] rounded-[20px] p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#60A5FA]" />
                </div>
                <div>
                  <p className="text-xs text-[#8B8B8B] font-semibold">Total Spent</p>
                  <p className="text-lg font-bold text-[#1A1A1A]">{formatAmount(analytics?.totalExpensesAmount || 0)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#8B8B8B] font-semibold mb-1">vs Last Year</p>
                <p className="text-sm font-bold text-[#34D399] flex items-center justify-end gap-1">
                  +12.5% <TrendingUp className="w-4 h-4" />
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div className="bg-white rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-100 flex flex-col h-[320px]">
             <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A1A1A]">Monthly Spending Trend</h3>
              <select className="bg-[#F5F7F2] text-[#8B8B8B] text-xs font-bold px-4 py-2 rounded-full border-none focus:ring-0 cursor-pointer appearance-none">
                <option>2024</option>
              </select>
            </div>
            <div className="flex-1 w-full relative -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="4 4" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}K` : val} />
                  <Tooltip 
                    cursor={{ stroke: '#60A5FA', strokeWidth: 1, strokeDasharray: '4 4' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1A1A1A', color: 'white' }} 
                    itemStyle={{ color: 'white' }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4, fill: '#60A5FA', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Stats & Donut */}
        <div className="space-y-6">
          
          {/* Lifetime Stats */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1A1A1A] mb-6">Lifetime Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAFAFA] rounded-[24px] p-5 flex flex-col justify-between aspect-square border border-gray-50">
                <p className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider">Total Spent</p>
                <div>
                  <p className="text-xl font-bold text-[#1A1A1A]">{formatAmount(analytics?.totalExpensesAmount || 0)}</p>
                  <TrendingUp className="w-5 h-5 text-[#34D399] mt-2 opacity-80" />
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-[24px] p-5 flex flex-col justify-between aspect-square border border-gray-50">
                <p className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider">Countries Visited</p>
                <div>
                  <p className="text-3xl font-bold text-[#1A1A1A]">{analytics?.countriesVisited?.length || 0}</p>
                  <Globe className="w-6 h-6 text-[#9CA3AF] mt-2 opacity-50" />
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-[24px] p-5 flex flex-col justify-between aspect-square border border-gray-50">
                <p className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider">Total Trips</p>
                <div>
                  <p className="text-3xl font-bold text-[#1A1A1A]">{analytics?.totalTripsCount || 0}</p>
                  <Briefcase className="w-6 h-6 text-[#9CA3AF] mt-2 opacity-50" />
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-[24px] p-5 flex flex-col justify-between aspect-square border border-gray-50">
                <p className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider">Completed Trips</p>
                <div>
                  <p className="text-3xl font-bold text-[#1A1A1A]">{analytics?.completedTripsCount || 0}</p>
                  <CheckCircle2 className="w-6 h-6 text-[#34D399] mt-2 opacity-80" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-bold text-[#1A1A1A] mb-3">Countries</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {(analytics?.countriesVisited || []).slice(0, 3).map(c => (
                   <span key={c} className="bg-[#F5F7F2] text-[#2A2A2A] text-xs font-semibold px-4 py-2 rounded-full">{c}</span>
                ))}
                {(!analytics?.countriesVisited || analytics?.countriesVisited?.length === 0) && (
                  <span className="bg-[#F5F7F2] text-[#8B8B8B] text-xs px-4 py-2 rounded-full">None yet</span>
                )}
              </div>
              <button className="text-[#60A5FA] text-xs font-bold flex items-center hover:underline">
                View all <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Top Destinations */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1A1A1A] mb-6 text-center sm:text-left">Top Destinations</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-[120px] h-[120px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topDestinations} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="count" stroke="none">
                      {topDestinations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {topDestinations.slice(0, 4).map((dest, i) => (
                  <div key={dest.name} className="flex items-center justify-between text-xs w-full">
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="font-semibold text-[#1A1A1A] truncate">{dest.name}</span>
                    </div>
                    <span className="text-[#8B8B8B] font-medium shrink-0">{dest.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-6 text-[#8B8B8B] text-xs font-bold flex items-center hover:text-[#1A1A1A] transition-colors">
              View all destinations <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
}
