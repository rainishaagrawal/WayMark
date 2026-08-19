import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/axios';
import { useCurrency } from '../context/CurrencyContext';

const CATEGORY_LABELS = {
  flights: 'Flights', hotels: 'Hotels', food: 'Food', shopping: 'Shopping',
  transport: 'Transport', activities: 'Activities', miscellaneous: 'Other',
};

export default function Analytics() {
  const { formatAmount } = useCurrency();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/user');
      setAnalytics(res.data);
    } catch (e) {
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  const categoryData = analytics
    ? Object.entries(analytics.categoryBreakdown || {}).map(([key, value]) => ({ name: CATEGORY_LABELS[key] || key, amount: value }))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 glass-card">
        <h1 className="text-xl font-bold text-[#2A2A2A] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#D4AF37]" /> Travel Analytics & Spending Insights
        </h1>
        <p className="text-xs text-[#8B8B8B] mt-0.5">Your travel frequency, budget allocation & country coverage — updated as you complete trips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider mb-4">Spending by Category</h3>
          {categoryData.every((c) => c.amount === 0) ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-xs text-[#8B8B8B] text-center">No expenses logged yet.<br />Add expenses to your trips to see this chart fill in.</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#355E4B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#355E4B" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F1A2E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Bar dataKey="amount" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider">Lifetime Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl glass-inset">
              <span className="text-[10px] text-[#8B8B8B] uppercase block">Total Spent</span>
              <p className="text-xl font-bold text-[#2A2A2A] mt-1">{formatAmount(analytics?.totalExpensesAmount || 0)}</p>
            </div>
            <div className="p-4 rounded-xl glass-inset">
              <span className="text-[10px] text-[#8B8B8B] uppercase block">Countries Visited</span>
              <p className="text-xl font-bold text-[#D4AF37] mt-1">{analytics?.countriesVisited?.length || 0}</p>
            </div>
            <div className="p-4 rounded-xl glass-inset">
              <span className="text-[10px] text-[#8B8B8B] uppercase block">Total Trips</span>
              <p className="text-xl font-bold text-[#2A2A2A] mt-1">{analytics?.totalTripsCount || 0}</p>
            </div>
            <div className="p-4 rounded-xl glass-inset">
              <span className="text-[10px] text-[#8B8B8B] uppercase block">Completed Trips</span>
              <p className="text-xl font-bold text-[#355E4B] mt-1">{analytics?.completedTripsCount || 0}</p>
            </div>
          </div>
          {analytics?.countriesVisited?.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] text-[#8B8B8B] uppercase block mb-2">Countries</span>
              <div className="flex flex-wrap gap-1.5">
                {analytics.countriesVisited.map((c, i) => (
                  <span key={i} className="text-[10px] glass-inset text-[#2A2A2A] px-2.5 py-1 rounded-lg">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
