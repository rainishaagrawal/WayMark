import React, { useState } from 'react';
import { Settings, Check, DollarSign, Search, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency, ALL_CURRENCIES } from '../context/CurrencyContext';

export default function SettingsPage() {
  const { currencyCode, setDefaultCurrency } = useCurrency();
  const [selectedCode, setSelectedCode] = useState(currencyCode);
  const [aiModel, setAiModel] = useState('GPT-4o & Claude 3.5 Sonnet');
  const [search, setSearch] = useState('');

  const filtered = ALL_CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.includes(search)
  );

  const handleSave = () => {
    setDefaultCurrency(selectedCode);
    toast.success(`Default currency set to ${selectedCode}!`);
  };

  const selectedInfo = ALL_CURRENCIES.find((c) => c.code === selectedCode);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-6 glass-card flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2A2A2A] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4AF37]" /> Platform Settings & Preferences
          </h1>
          <p className="text-xs text-[#8B8B8B] mt-0.5">
            Your default currency will be used everywhere — expenses, budgets, and all amounts.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F0C96B] text-black font-semibold text-xs px-4 py-2.5 rounded-xl shadow-glow transition"
        >
          <Check className="w-4 h-4" />
          Save Preferences
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Selector */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-[#2A2A2A]">Default Display Currency</h2>
          </div>
          <p className="text-xs text-[#8B8B8B]">
            All expense amounts and budgets across the app will show in this currency.
          </p>

          {/* Selected preview */}
          {selectedInfo && (
            <div className="flex items-center gap-3 p-3 rounded-xl glass-inset border border-[#D4AF37]/20">
              <span className="text-2xl">{selectedInfo.flag}</span>
              <div>
                <p className="text-[#2A2A2A] text-sm font-bold">
                  {selectedInfo.symbol} {selectedInfo.code}
                </p>
                <p className="text-[#8B8B8B] text-xs">{selectedInfo.name}</p>
              </div>
              <span className="ml-auto text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full font-bold">
                Selected
              </span>
            </div>
          )}

          {/* Search */}
          <div className="flex items-center gap-2 glass-inset rounded-xl px-3">
            <Search className="w-3.5 h-3.5 text-[#8B8B8B] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency by name, code or symbol..."
              className="bg-transparent text-[#2A2A2A] text-xs py-2.5 focus:outline-none flex-1 placeholder:text-[#8B8B8B]/50"
            />
          </div>

          {/* Currency Grid */}
          <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-1 pr-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setSelectedCode(c.code);
                  setDefaultCurrency(c.code);
                  toast.success(`Default currency set to ${c.code} (${c.symbol})!`);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                  selectedCode === c.code
                    ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#2A2A2A]'
                    : 'hover:bg-black/[0.03] border border-transparent text-[#8B8B8B] hover:text-[#2A2A2A]'
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <div className="flex-1">
                  <span className="text-xs font-semibold">{c.code}</span>
                  <span className="text-[10px] text-[#8B8B8B] ml-2">{c.name}</span>
                </div>
                <span className="text-xs font-bold text-[#D4AF37]">{c.symbol}</span>
                {selectedCode === c.code && (
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-[#8B8B8B] text-center py-4">No currency found</p>
            )}
          </div>
        </div>

        {/* AI Model Setting */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-[#2A2A2A]">AI Engine Neural Model</h2>
          </div>
          <p className="text-xs text-[#8B8B8B]">
            Choose which AI model powers your itinerary planning and travel journal generation.
          </p>
          <select
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="w-full glass-inset text-[#2A2A2A] text-xs p-3 rounded-xl focus:outline-none"
          >
            <option>GPT-4o & Claude 3.5 Sonnet (Recommended)</option>
            <option>Gemini 1.5 Pro</option>
            <option>DeepSeek R1 Reasoning</option>
          </select>

          {/* Info card */}
          <div className="p-4 rounded-xl glass-inset space-y-2">
            <p className="text-xs text-[#8B8B8B] font-semibold uppercase tracking-wider">Current Session</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#2A2A2A]/60">Active Model</span>
              <span className="text-[#D4AF37] font-bold">GPT-4o</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#2A2A2A]/60">AI Planner</span>
              <span className="text-[#4ADE80] font-bold">Online</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#2A2A2A]/60">Default Currency</span>
              <span className="text-[#2A2A2A] font-bold">
                {selectedInfo?.flag} {selectedCode} ({selectedInfo?.symbol})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
