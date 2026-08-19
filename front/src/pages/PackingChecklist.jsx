import React, { useState, useEffect } from 'react';
import { PackageCheck, CheckCircle2, Circle, Plus, Trash2, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useTrips } from '../context/TripContext';

const getTripDisplayName = (t) => t?.destinationName || t?.title || 'Untitled Trip';
const CATEGORIES = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Medication', 'Miscellaneous'];

const CATEGORY_COLORS = {
  Clothing:      { bg: '#1A3626', text: '#EAF5EA' },
  Toiletries:    { bg: '#D4AF37', text: '#1A1A1A' },
  Electronics:   { bg: '#1A3626', text: '#EAF5EA' },
  Documents:     { bg: '#3B5998', text: '#fff' },
  Medication:    { bg: '#E02424', text: '#fff' },
  Miscellaneous: { bg: '#1A3626', text: '#EAF5EA' },
};

export default function PackingChecklist() {
  const { trips } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState('');
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Miscellaneous');

  useEffect(() => {
    if (!selectedTripId && trips.length > 0) setSelectedTripId(trips[0]._id);
  }, [trips]);

  useEffect(() => {
    if (selectedTripId) fetchChecklist();
  }, [selectedTripId]);

  const fetchChecklist = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/packing/${selectedTripId}`);
      setChecklist(res.data);
    } catch (e) {
      setChecklist(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChecklist = async () => {
    setCreating(true);
    try {
      const res = await api.post('/packing', { tripId: selectedTripId, items: [] });
      setChecklist(res.data);
      toast.success('Packing checklist created!');
    } catch (e) {
      toast.error(e.message || 'Failed to create checklist');
    } finally {
      setCreating(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const res = await api.post('/packing/item', { tripId: selectedTripId, item: newItem, category: newCategory });
      setChecklist(res.data);
      setNewItem('');
      toast.success('Item added!');
    } catch (e) {
      toast.error(e.message || 'Failed to add item');
    }
  };

  const toggleItem = async (itemId) => {
    try {
      const res = await api.patch('/packing/item', { checklistId: checklist._id, itemId });
      setChecklist(res.data);
    } catch (e) {
      toast.error('Failed to update item');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete('/packing/item', { data: { checklistId: checklist._id, itemId } });
      setChecklist(res.data);
    } catch (e) {
      toast.error('Failed to remove item');
    }
  };

  const deleteChecklist = async () => {
    if (!window.confirm('Delete this entire packing list?')) return;
    try {
      await api.delete(`/packing/${checklist._id}`);
      setChecklist(null);
      toast.success('Packing list deleted');
    } catch (e) {
      toast.error(e.message || 'Failed to delete checklist');
    }
  };

  const selectedTrip = trips.find((t) => t._id === selectedTripId);
  const packedCount = (checklist?.items || []).filter(i => i.isPacked).length;
  const totalCount = (checklist?.items || []).length;

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-12 text-center flex flex-col items-center justify-center animate-fade-in">
        <PackageCheck className="w-10 h-10 text-[#8B8B8B] mb-3" />
        <h3 className="text-sm font-bold text-[#1A1A1A]">No trips yet</h3>
        <p className="text-xs text-[#8B8B8B] mt-1">Create a trip first, then build a packing checklist for it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="relative bg-[#F9FBF8] rounded-[28px] border border-[#E5E5E7]/50 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7">
        {/* Luggage illustration placeholder via SVG */}
        <div className="absolute right-36 bottom-0 pointer-events-none opacity-70 hidden md:block">
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="30" width="100" height="75" rx="12" fill="#D6E4D8" stroke="#A7BCA1" strokeWidth="2"/>
            <rect x="80" y="18" width="60" height="16" rx="8" fill="#C4D9C7" stroke="#A7BCA1" strokeWidth="2"/>
            <rect x="72" y="55" width="76" height="3" rx="1.5" fill="#A7BCA1"/>
            <circle cx="80" cy="107" r="8" fill="#A7BCA1"/>
            <circle cx="140" cy="107" r="8" fill="#A7BCA1"/>
            <circle cx="43" cy="65" r="18" fill="#EBF8F4" stroke="#C9D4C5" strokeWidth="2"/>
            <circle cx="43" cy="65" r="10" fill="#355E4B" opacity="0.3"/>
            <path d="M38 65 L41 68 L49 60" stroke="#355E4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute right-0 bottom-0 pointer-events-none">
          <svg width="300" height="100" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L40 70L80 85L130 50L180 75L230 40L300 60V100H0Z" fill="#C9D4C5" opacity="0.25"/>
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF5EA] flex items-center justify-center shrink-0 shadow-sm border border-[#355E4B]/10">
            <PackageCheck className="w-7 h-7 text-[#355E4B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3626]">Packing Checklist</h1>
            <p className="text-[13px] text-[#8B8B8B] mt-1">Build a complete packing list for each trip.</p>
          </div>
        </div>

        {/* Trip selector */}
        <div className="relative z-10 w-full md:w-auto">
          <div className="relative">
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full md:w-72 bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:border-[#355E4B] appearance-none shadow-sm font-semibold"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>{getTripDisplayName(t)}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#1A1A1A] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : !checklist ? (
        <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <PackageCheck className="w-10 h-10 text-[#8B8B8B] mb-3" />
          <h3 className="text-sm font-bold text-[#1A1A1A]">No packing list yet for {getTripDisplayName(selectedTrip)}</h3>
          <p className="text-xs text-[#8B8B8B] mt-1 mb-5">Start a fresh checklist for this trip.</p>
          <button
            onClick={handleCreateChecklist}
            disabled={creating}
            className="bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-bold text-sm px-6 py-3 rounded-full shadow-md transition-all disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Add Packing List'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-6 md:p-8 space-y-6">
          {/* List Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">
                {getTripDisplayName(selectedTrip)}
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#C9A227] bg-[#FFF6E1] px-3 py-1 rounded-full">
                {totalCount} <Sparkles className="w-3 h-3" />
              </span>
            </div>
            <button
              onClick={deleteChecklist}
              className="flex items-center gap-1.5 text-[#E02424] hover:text-[#B91C1C] text-sm font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete List
            </button>
          </div>

          {/* Progress bar */}
          {totalCount > 0 && (
            <div>
              <div className="flex justify-between text-xs text-[#8B8B8B] mb-2">
                <span>{packedCount} of {totalCount} packed</span>
                <span>{Math.round((packedCount / totalCount) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#F5F7F2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#355E4B] to-[#437A60] rounded-full transition-all duration-500"
                  style={{ width: `${(packedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="flex gap-3 items-center">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add an item..."
              className="flex-1 bg-[#F9FBF8] border border-[#E5E5E7]/60 text-sm text-[#1A1A1A] placeholder-[#C4C4C4] px-5 py-3 rounded-xl focus:outline-none focus:border-[#355E4B] transition-colors"
            />
            <div className="relative">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] pl-4 pr-9 py-3 rounded-xl focus:outline-none appearance-none font-medium shadow-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#8B8B8B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black rounded-xl shadow-md shrink-0 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          {/* Items List */}
          <div className="space-y-3">
            {(checklist.items || []).length === 0 ? (
              <p className="text-sm text-[#8B8B8B] text-center py-6">No items yet — add your first one above.</p>
            ) : (
              checklist.items.map((it) => {
                const catStyle = CATEGORY_COLORS[it.category] || CATEGORY_COLORS.Miscellaneous;
                return (
                  <div
                    key={it._id}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
                      it.isPacked
                        ? 'bg-[#F9FBF8] border-[#E5E5E7]/50'
                        : 'bg-white border-[#E5E5E7]/60 shadow-sm hover:border-[#D4AF37]/30'
                    }`}
                  >
                    <div onClick={() => toggleItem(it._id)} className="flex items-center gap-4 cursor-pointer flex-1">
                      {it.isPacked ? (
                        <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#C4C4C4] shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${it.isPacked ? 'line-through text-[#8B8B8B]' : 'text-[#1A1A1A]'}`}>
                        {it.item}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        style={{ background: catStyle.bg, color: catStyle.text }}
                        className="text-[11px] font-bold px-3 py-1 rounded-lg"
                      >
                        {it.category}
                      </span>
                      <button
                        onClick={() => removeItem(it._id)}
                        className="text-[#E02424] hover:text-[#B91C1C] transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
