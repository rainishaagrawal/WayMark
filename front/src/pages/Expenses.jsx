import React, { useState, useEffect } from 'react';
import { Receipt, DollarSign, Plus, Trash2, Loader2, X, Users, ArrowUpRight, ArrowDownLeft, CheckCircle2, UserCheck, FileText, PieChart, ListFilter, Sparkles, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useTrips } from '../context/TripContext';
import { useCurrency } from '../context/CurrencyContext';

import { useAuth } from '../context/AuthContext';

// Returns a short, clean trip name for display
const getTripDisplayName = (t) => t?.destinationName || t?.title || 'Untitled Trip';

const CATEGORIES = ['flights', 'hotels', 'food', 'shopping', 'transport', 'activities', 'miscellaneous'];

export default function Expenses() {
  const { trips } = useTrips();
  const { user } = useAuth();
  const { currencyInfo, formatAmount } = useCurrency();
  const [searchParams] = useSearchParams();
  const [selectedTripId, setSelectedTripId] = useState(searchParams.get('tripId') || '');
  const [activeTab, setActiveTab] = useState('members'); // 'members', 'list', 'analytics'
  const [expenses, setExpenses] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [summaryData, setSummaryData] = useState({
    totalSpent: 0,
    memberCount: 1,
    perMemberShare: 0,
    memberBalances: [],
    isGroupTrip: false,
  });
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [paidByUserId, setPaidByUserId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedTripId && trips.length > 0) {
      setSelectedTripId(searchParams.get('tripId') || trips[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trips]);

  useEffect(() => {
    if (selectedTripId) fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTripId]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/expenses/trip/${selectedTripId}`);
      const data = res.data || {};
      setExpenses(data.expenses || []);
      setGroupMembers(data.members || []);
      setCategoryBreakdown(data.categoryBreakdown || {});
      setSummaryData({
        totalSpent: data.totalSpent || 0,
        memberCount: data.memberCount || 1,
        perMemberShare: data.perMemberShare || 0,
        memberBalances: data.memberBalances || [],
        isGroupTrip: data.isGroupTrip || false,
      });

      if (user?._id) {
        setPaidByUserId(user._id);
      }
    } catch (e) {
      setExpenses([]);
      setGroupMembers([]);
      setCategoryBreakdown({});
      setSummaryData({
        totalSpent: 0,
        memberCount: 1,
        perMemberShare: 0,
        memberBalances: [],
        isGroupTrip: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setSaving(true);
    try {
      await api.post('/expenses', {
        tripId: selectedTripId,
        amount: parseFloat(amount),
        category,
        description,
        paidBy: paidByUserId || user?._id,
      });
      toast.success('Expense logged successfully!');
      setShowAddModal(false);
      setAmount('');
      setDescription('');
      fetchExpenses();
    } catch (e) {
      toast.error(e.message || 'Failed to add expense');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense removed');
      fetchExpenses();
    } catch (e) {
      toast.error(e.message || 'Failed to delete expense');
    }
  };

  const selectedTrip = trips.find((t) => t._id === selectedTripId);

  if (trips.length === 0) {
    return (
      <div className="glass-card p-12 text-center flex flex-col items-center justify-center animate-fade-in">
        <Receipt className="w-10 h-10 text-[#8B8B8B] mb-3" />
        <h3 className="text-sm font-bold text-[#2A2A2A]">No trips yet</h3>
        <p className="text-xs text-[#8B8B8B] mt-1">Create or join a trip first, then track expenses for it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Trip Selector & Main Action Bar */}
      <div className="relative p-6 sm:p-8 bg-[#F9FBF8] rounded-[28px] border border-[#E5E5E7]/50 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Subtle mountain graphic via SVG */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-60">
           <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M0 120L50 80L100 100L150 60L200 90L250 50L320 100L400 70V120H0Z" fill="#C9D4C5" opacity="0.3"/>
             <path d="M50 120L100 90L150 110L200 70L270 105L350 60L400 80V120H50Z" fill="#A7BCA1" opacity="0.4"/>
             <path d="M0 60 C 50 40, 80 80, 130 65 S 180 30, 250 55" stroke="#8B8B8B" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.4"/>
             <circle cx="250" cy="55" r="4" fill="#355E4B" opacity="0.5"/>
           </svg>
        </div>

        {/* Left Side */}
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF5EA] flex items-center justify-center shrink-0 shadow-sm border border-[#355E4B]/10">
            <Receipt className="w-7 h-7 text-[#355E4B]" />
          </div>
          <div>
            <span className="text-[10px] text-[#355E4B] font-bold uppercase tracking-wider block mb-1">Expense Management</span>
            <h1 className="text-2xl font-bold text-[#1A3626] mb-1.5">
              {getTripDisplayName(selectedTrip) || 'Select a Trip'}
            </h1>
            {selectedTrip?.destinationName && (
              <p className="text-[13px] text-[#8B8B8B] flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#8B8B8B]" /> {selectedTrip.destinationName}
              </p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="relative z-10 flex items-end gap-4 w-full md:w-auto mt-2 md:mt-0">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-[10px] text-[#8B8B8B] uppercase font-bold mb-1.5 px-1">Select Active Trip</label>
            <div className="relative">
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full sm:w-56 bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:border-[#355E4B] appearance-none shadow-sm font-semibold"
              >
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>
                    {getTripDisplayName(t)} {t.isGroupShared ? '👥' : '👤'}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1A1A1A]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (user?._id) setPaidByUserId(user._id);
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md shrink-0 h-[46px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards for Selected Trip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spent */}
        <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-6 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EAF5EA] flex items-center justify-center shrink-0 border border-[#355E4B]/10">
              <Receipt className="w-6 h-6 text-[#355E4B]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8B8B8B] uppercase font-bold tracking-wider">Total Trip Spent</span>
              <h3 className="text-3xl font-bold text-[#1A3626] mt-1">{formatAmount(summaryData.totalSpent)}</h3>
              <p className="text-xs text-[#8B8B8B] mt-2">All expenses logged for this trip</p>
            </div>
          </div>
        </div>

        {/* Per Person Split */}
        <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-6 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF6E1] flex items-center justify-center shrink-0 border border-[#C9A227]/10">
              <Users className="w-6 h-6 text-[#C9A227]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8B8B8B] uppercase font-bold tracking-wider">Per Person Split ({summaryData.memberCount} member{summaryData.memberCount !== 1 ? 's' : ''})</span>
              <h3 className="text-3xl font-bold text-[#D4AF37] mt-1">{formatAmount(summaryData.perMemberShare)}</h3>
              <p className="text-xs text-[#8B8B8B] mt-2">Equal split per member</p>
            </div>
          </div>
        </div>

        {/* Trip Type */}
        <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-6 flex flex-col justify-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0 border border-[#9333EA]/10">
              <Sparkles className="w-6 h-6 text-[#9333EA]" />
            </div>
            <div>
              <span className="text-[10px] text-[#8B8B8B] uppercase font-bold tracking-wider">Trip Type</span>
              <h3 className="text-lg font-bold text-[#1A1A1A] mt-1">
                {summaryData.isGroupTrip ? 'Group Shared Trip' : 'Personal / Solo Trip'}
              </h3>
              <p className="text-xs text-[#8B8B8B] mt-2">
                {summaryData.isGroupTrip ? 'Collaborative trip expenses' : 'Individual trip tracking'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E5E5E7] pb-4">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeTab === 'members'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black shadow-md'
              : 'bg-white border border-[#E5E5E7] text-[#8B8B8B] hover:text-[#1A1A1A] hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Member-Wise Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeTab === 'list'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black shadow-md'
              : 'bg-white border border-[#E5E5E7] text-[#8B8B8B] hover:text-[#1A1A1A] hover:bg-gray-50'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>All Expenses Feed ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black shadow-md'
              : 'bg-white border border-[#E5E5E7] text-[#8B8B8B] hover:text-[#1A1A1A] hover:bg-gray-50'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Category Breakdown</span>
        </button>
      </div>

      {/* 4. Tab Contents */}
      {loading ? (
        <div className="flex justify-center p-12 glass-card">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : activeTab === 'members' ? (
        /* TAB 1: MEMBER-WISE EXPENSE CARDS + BOTTOM EQUAL SPLIT SLIP */
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider flex items-center gap-2 pl-2">
              <Users className="w-4 h-4 text-[#D4AF37]" /> Logged Expenses Grouped Under Each Member
            </h2>

            {summaryData.memberBalances.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 p-8 text-center text-sm text-[#8B8B8B]">
                No expenses logged for this trip yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {summaryData.memberBalances.map((m) => (
                  <div key={m.user?._id || m.user} className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-6 sm:p-8 space-y-6">
                    {/* Member Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E7] border-dashed">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#F5F7F2] flex items-center justify-center overflow-hidden shrink-0 border border-[#E5E5E7]">
                          {m.user?.avatar ? (
                            <img src={m.user.avatar} alt={m.user?.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-6 h-6 text-[#8B8B8B]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#1A1A1A]">{m.user?.name || 'Member'}</h3>
                            {m.user?._id === user?._id && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFF6E1] text-[#C9A227] tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#8B8B8B] mt-1">
                            Total Spent: <span className="text-[#D4AF37] font-bold">{formatAmount(m.totalPaid)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Member Status Badge */}
                      <div>
                        {m.netBalance > 0 ? (
                          <span className="text-xs font-bold text-[#355E4B] bg-[#EAF5EA] px-4 py-2 rounded-full border border-[#355E4B]/10 shadow-sm">
                            Gets Back {formatAmount(m.netBalance)}
                          </span>
                        ) : m.netBalance < 0 ? (
                          <span className="text-xs font-bold text-[#E02424] bg-[#FCE8E8] px-4 py-2 rounded-full border border-[#E02424]/10 shadow-sm">
                            Owes {formatAmount(Math.abs(m.netBalance))}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-[#355E4B] bg-[#EAF5EA] px-4 py-2 rounded-full shadow-sm">
                            Settled
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Expenses List */}
                    <div className="space-y-3">
                      {(!m.expenses || m.expenses.length === 0) ? (
                        <div className="bg-[#F9FBF8] rounded-[16px] border border-[#E5E5E7]/50 p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                          <div className="w-12 h-12 rounded-full bg-[#EAF5EA] flex items-center justify-center shrink-0">
                            <Receipt className="w-6 h-6 text-[#355E4B]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#1A1A1A]">No expenses added yet</h4>
                            <p className="text-xs text-[#8B8B8B] mt-1">Start adding expenses to see them here.</p>
                          </div>
                        </div>
                      ) : (
                        m.expenses.map((exp) => (
                          <div key={exp._id} className="p-4 rounded-[16px] bg-[#F9FBF8] border border-[#E5E5E7]/50 flex items-center justify-between gap-3 shadow-sm hover:border-[#D4AF37]/30 transition-colors">
                            <div>
                              <h4 className="text-sm font-bold text-[#1A1A1A]">{exp.description || exp.category}</h4>
                              <p className="text-xs text-[#8B8B8B] capitalize mt-1">
                                {exp.category} • {new Date(exp.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-bold text-[#1A1A1A]">{formatAmount(exp.amount)}</span>
                              <button onClick={() => handleDelete(exp._id)} className="text-[#8B8B8B] hover:text-[#E02424] transition-colors p-1.5 bg-white shadow-sm border border-[#E5E5E7] rounded-md">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'list' ? (
        /* TAB 2: CHRONOLOGICAL EXPENSES FEED */
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.07] pb-3">
            <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider">
              All Logged Expenses Feed ({expenses.length})
            </h3>
            <span className="text-xs font-bold text-[#2A2A2A]">Total: {formatAmount(summaryData.totalSpent)}</span>
          </div>

          {expenses.length === 0 ? (
            <p className="text-xs text-[#8B8B8B] text-center py-6">No expenses logged for this trip yet.</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((exp) => (
                <div key={exp._id} className="flex items-center justify-between p-3.5 rounded-xl glass-inset">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2A2A2A]">{exp.description || exp.category}</h4>
                      <p className="text-[10px] text-[#8B8B8B] capitalize">
                        {exp.category} • {new Date(exp.date).toLocaleDateString()}
                        {exp.paidBy && (
                          <span className="ml-2 text-[#D4AF37] font-semibold">
                            • Paid by {exp.paidBy.name || 'Member'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#2A2A2A]">{formatAmount(exp.amount)}</span>
                    <button onClick={() => handleDelete(exp._id)} className="text-[#8B8B8B] hover:text-[#F87171] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB 3: CATEGORY ANALYTICS */
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider border-b border-black/[0.07] pb-3">
            Spending by Category
          </h3>

          {Object.keys(categoryBreakdown).length === 0 ? (
            <p className="text-xs text-[#8B8B8B] text-center py-6">No spending data to analyze yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(categoryBreakdown).map(([cat, amt]) => {
                const percentage = summaryData.totalSpent > 0 ? Math.round((amt / summaryData.totalSpent) * 100) : 0;
                return (
                  <div key={cat} className="p-4 rounded-xl glass-inset space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2A2A2A] capitalize">{cat}</span>
                      <span className="font-bold text-[#D4AF37]">{formatAmount(amt)} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2A2A2A]">Log Expense for {getTripDisplayName(selectedTrip)}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8B8B8B] hover:text-[#2A2A2A]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-[#8B8B8B] block font-semibold mb-1">Who Paid This Expense?</label>
                <select
                  value={paidByUserId}
                  onChange={(e) => setPaidByUserId(e.target.value)}
                  className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none font-semibold"
                >
                  {groupMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} {m._id === user?._id ? '(You)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#8B8B8B] block font-semibold mb-1">Amount ({currencyInfo.symbol})</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="text-[#8B8B8B] block font-semibold mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl capitalize focus:outline-none">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#8B8B8B] block font-semibold mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none"
                  placeholder="e.g. Dinner bill or Hotel booking"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black font-semibold py-2.5 rounded-xl shadow-glow disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Add Expense'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
