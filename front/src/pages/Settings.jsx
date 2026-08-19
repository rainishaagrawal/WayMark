import React, { useState } from 'react';
import { Settings, Check, DollarSign, Search, Cpu, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency, ALL_CURRENCIES } from '../context/CurrencyContext';

export default function SettingsPage() {
  const { currencyCode, setDefaultCurrency } = useCurrency();
  const [selectedCode, setSelectedCode] = useState(currencyCode);
  const [aiModel, setAiModel] = useState('GPT-4o & Claude 3.5 Sonnet (Recommended)');
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
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[24px] bg-amber-50 flex items-center justify-center shrink-0">
            <Settings className="w-8 h-8 text-amber-500" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight">
              Platform Settings & Preferences
            </h1>
            <p className="text-sm text-[#8B8B8B] mt-1.5 leading-relaxed">
              Your default currency will be used everywhere — expenses, budgets, and all amounts.
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#F6C042] hover:bg-[#E5B031] text-black font-bold text-sm px-6 py-3 rounded-full transition-all shrink-0 shadow-sm"
        >
          <Check className="w-4 h-4" strokeWidth={3} />
          <span>Save Preferences</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Currency Selector */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-[17px] font-bold text-[#1A1A1A]">Default Display Currency</h2>
          </div>
          <p className="text-[#8B8B8B] text-sm mb-6">
            All expense amounts and budgets across the app will show in this currency.
          </p>

          {/* Selected Preview */}
          {selectedInfo && (
            <div className="flex items-center gap-4 p-5 rounded-[24px] bg-[#FAFAFA] border border-gray-100 mb-5">
              <span className="text-3xl drop-shadow-sm">{selectedInfo.flag}</span>
              <div>
                <p className="text-[#1A1A1A] text-[15px] font-bold flex items-center gap-2">
                  {selectedInfo.code} <span className="text-lg">{selectedInfo.symbol}</span>
                </p>
                <p className="text-[#8B8B8B] text-xs font-semibold">{selectedInfo.name}</p>
              </div>
              <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                Selected
              </span>
            </div>
          )}

          {/* Search */}
          <div className="flex items-center gap-3 bg-[#FAFAFA] border border-gray-100 focus-within:border-amber-300 rounded-[20px] px-5 py-3.5 mb-5 transition-colors">
            <Search className="w-4 h-4 text-[#8B8B8B] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency by name, code or symbol..."
              className="bg-transparent text-[#1A1A1A] text-sm font-medium w-full focus:outline-none placeholder:text-[#8B8B8B]/70"
            />
          </div>

          {/* Currency Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 -mr-2">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setSelectedCode(c.code);
                  setDefaultCurrency(c.code);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-[20px] transition-all text-left ${
                  selectedCode === c.code
                    ? 'bg-[#FFFCF5] border border-amber-300 shadow-[0_2px_10px_rgba(251,191,36,0.1)]'
                    : 'bg-white border border-transparent hover:bg-[#FAFAFA] hover:border-gray-100'
                }`}
              >
                <span className="text-2xl drop-shadow-sm w-8 text-center">{c.flag}</span>
                <div className="flex-1 flex items-baseline gap-2">
                  <span className={`text-[15px] font-bold ${selectedCode === c.code ? 'text-[#1A1A1A]' : 'text-[#4A4A4A]'}`}>{c.code}</span>
                  <span className="text-xs font-semibold text-[#8B8B8B]">{c.name}</span>
                </div>
                <span className={`text-[15px] font-bold ${selectedCode === c.code ? 'text-amber-500' : 'text-amber-400'}`}>{c.symbol}</span>
                
                {/* Icon placeholder for alignment */}
                <div className="w-5 flex justify-end">
                  {selectedCode === c.code && <Check className="w-4 h-4 text-amber-500" strokeWidth={3} />}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-8 text-center text-[#8B8B8B] text-sm font-medium bg-[#FAFAFA] rounded-[24px]">
                No matching currencies found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Model */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-[17px] font-bold text-[#1A1A1A]">AI Engine Neural Model</h2>
          </div>
          <p className="text-[#8B8B8B] text-sm mb-6">
            Choose which AI model powers your itinerary planning and travel journal generation.
          </p>
          
          <div className="relative mb-6">
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-100 text-[#1A1A1A] font-semibold text-sm p-4 rounded-[20px] focus:outline-none focus:border-amber-300 appearance-none cursor-pointer"
            >
              <option>GPT-4o & Claude 3.5 Sonnet (Recommended)</option>
              <option>Gemini 1.5 Pro</option>
              <option>DeepSeek R1 Reasoning</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8B8B] pointer-events-none" />
          </div>

          {/* Info Card */}
          <div className="p-6 rounded-[24px] bg-[#FAFAFA] border border-gray-50 space-y-4 mb-6">
            <p className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider mb-2">Current Session</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8B8B8B] font-medium">Active Model</span>
              <span className="text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-md">GPT-4o</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8B8B8B] font-medium">AI Planner</span>
              <div className="flex items-center gap-2 font-bold text-emerald-500">
                Online <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8B8B8B] font-medium">Default Currency</span>
              <span className="text-[#1A1A1A] font-bold flex items-center gap-1.5">
                {selectedInfo?.flag} {selectedCode} ({selectedInfo?.symbol})
              </span>
            </div>
          </div>
          
          {/* Bottom Callout */}
          <div className="mt-auto flex items-center justify-between p-5 rounded-[24px] bg-white border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#1A1A1A] mb-1">Smart, fast & personalized</h4>
                <p className="text-xs text-[#8B8B8B] leading-relaxed pr-4">Our AI engine adapts to your travel style and preferences for better recommendations.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors shrink-0" />
          </div>

        </div>
      </div>
    </div>
  );
}
