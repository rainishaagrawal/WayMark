import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Search, Loader2, Bookmark, Globe, Sparkles, ArrowRight, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axios';

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async (q) => {
    setLoading(true);
    try {
      const res = await api.get(`/users/wishlist${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setItems(res.data || []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWishlist(query);
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/users/wishlist/item/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Removed from wishlist');
    } catch (e) {
      toast.error(e.message || 'Failed to remove item');
    }
  };

  const uniqueCountries = [...new Set(items.map(i => i.destination?.country).filter(Boolean))].length;
  const uniqueBookmarks = items.length;
  const uniqueDestinations = [...new Set(items.map(i => i.destination?.city).filter(Boolean))].length;

  return (
    <div className="space-y-6 animate-fade-in relative z-10">

      {/* ── Banner ── */}
      <div
        className="relative rounded-[24px] overflow-hidden min-h-[220px] flex items-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* White fade overlay on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />

        <div className="relative z-10 p-8 flex-1">
          {/* Title row */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <Heart className="w-6 h-6 text-[#F87171] fill-[#F87171]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A3626]">Saved Wishlists &amp; Bookmarks</h1>
              <p className="text-xs text-[#1A3626]/60 mt-0.5">Your personal collection of saved destinations and experiences.</p>
            </div>
          </div>

          {/* Search + Filter row */}
          <div className="flex items-center gap-3 mt-5">
            <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your wishlists..."
                className="w-full bg-white/90 backdrop-blur-md text-sm text-[#1A3626] placeholder-[#8B8B8B] pl-11 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white shadow-sm transition-all border border-white/60"
              />
            </form>
            <button className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/60 text-[#1A3626] text-xs font-semibold px-4 py-3 rounded-full shadow-sm hover:bg-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
              Filters
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-5">
            <div className="flex items-center gap-2 text-sm text-[#1A3626]">
              <MapPin className="w-4 h-4 text-[#437A60]" />
              <span className="font-bold">{uniqueDestinations}</span>
              <span className="text-[#1A3626]/60 text-xs">Destinations</span>
            </div>
            <div className="w-px h-4 bg-[#1A3626]/20" />
            <div className="flex items-center gap-2 text-sm text-[#1A3626]">
              <Bookmark className="w-4 h-4 text-[#437A60]" />
              <span className="font-bold">{uniqueBookmarks}</span>
              <span className="text-[#1A3626]/60 text-xs">Bookmarks</span>
            </div>
            <div className="w-px h-4 bg-[#1A3626]/20" />
            <div className="flex items-center gap-2 text-sm text-[#1A3626]">
              <Globe className="w-4 h-4 text-[#437A60]" />
              <span className="font-bold">{uniqueCountries}</span>
              <span className="text-[#1A3626]/60 text-xs">Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#437A60] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-[24px] p-12 text-center flex flex-col items-center justify-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#EBF8F4] flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-[#437A60]" />
          </div>
          <h3 className="text-lg font-bold text-[#1A3626]">Your wishlist is empty</h3>
          <p className="text-sm text-[#8B8B8B] mt-2 mb-6">Save destinations you love from Explore to see them here.</p>
          <button onClick={() => navigate('/explore')} className="bg-[#1A3626] hover:bg-[#1A3626]/90 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md">
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const name = item.destination?.name || item.name;
            const city = item.destination?.city;
            const country = item.destination?.country;
            const continent = item.destination?.continent || 'ASIA';
            const img = item.destination?.images?.[0] || item.image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800';

            return (
              <div key={item._id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md">
                {/* Card image */}
                <div className="relative">
                  <img src={img} alt={name} className="w-full h-52 object-cover" />
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#1A3626] flex items-center justify-center shadow-md hover:bg-[#1A3626]/80 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-white fill-white" />
                  </button>
                </div>

                {/* Card body */}
                <div className="p-5 space-y-3">
                  {/* Tags row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {continent && (
                        <span className="bg-[#FFF8E7] text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {continent.toUpperCase()}
                        </span>
                      )}
                      {(city || country) && (
                        <span className="text-[#8B8B8B] text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#437A60]" />
                          {city}{city && country ? ', ' : ''}{country}
                        </span>
                      )}
                    </div>
                    <button className="text-[#8B8B8B] hover:text-[#1A3626] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name + Saved badge + heart */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-[#1A3626] leading-tight truncate">{name}</h3>
                        <span className="bg-[#EBF8F4] text-[#437A60] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Saved
                        </span>
                      </div>
                      <p className="text-xs text-[#8B8B8B] line-clamp-2">
                        {item.reason || 'Spiritual, scenic and affordable — the ultimate wellness and adventure destination.'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="w-9 h-9 rounded-full bg-[#FFEAE9] flex items-center justify-center text-[#F87171] hover:bg-[#F87171] hover:text-white transition-colors flex-shrink-0"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => navigate('/planner', { state: { destinationName: name } })}
                      className="flex-1 bg-[#f4f4f4] hover:bg-[#EBF8F4] text-[#1A3626] text-xs font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#437A60]" /> Plan Trip with AI
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                    <button className="w-11 h-11 rounded-xl bg-[#f4f4f4] hover:bg-[#EBF8F4] flex items-center justify-center text-[#437A60] transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
