import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30">
          <Sparkles className="w-3.5 h-3.5" /> Semantic Vector AI Search
        </div>
        <h1 className="text-3xl font-bold text-[#2A2A2A] tracking-tight">Ask Anything About World Travel</h1>
        <p className="text-xs text-[#8B8B8B] max-w-lg mx-auto">
          Search by mood, budget, dietary needs, or natural language prompts (e.g. "quiet mountain town with Michelin dining in autumn").
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="w-5 h-5 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Kyoto, Santorini, quiet mountain retreat..."
          className="w-full glass-inset text-sm text-[#2A2A2A] placeholder-[#8B8B8B] pl-12 pr-32 py-4 rounded-2xl focus:outline-none focus:border-[#D4AF37]/50 shadow-2xl transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-glow flex items-center gap-1"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
