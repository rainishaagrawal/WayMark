import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Plus, Trash2, Loader2, X, Search, Pencil, Link2, ExternalLink, ChevronDown, Calendar, MapPin, MoreHorizontal, Bookmark, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useTrips } from '../context/TripContext';

// Returns a short, clean trip name for display
const getTripDisplayName = (t) => t?.destinationName || t?.title || 'Untitled Trip';

// Platform detection from URL
const detectPlatform = (url = '') => {
  const u = url.toLowerCase();
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('pinterest.com')) return 'pinterest';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  if (u.includes('facebook.com')) return 'facebook';
  return 'other';
};

const PLATFORM_META = {
  instagram: { label: 'Instagram', color: '#E1306C', bg: 'rgba(225,48,108,0.15)', emoji: '📷' },
  youtube:   { label: 'YouTube',   color: '#FF0000', bg: 'rgba(255,0,0,0.12)',   emoji: '▶️' },
  tiktok:    { label: 'TikTok',    color: '#69C9D0', bg: 'rgba(105,201,208,0.15)', emoji: '🎵' },
  pinterest: { label: 'Pinterest', color: '#E60023', bg: 'rgba(230,0,35,0.12)',  emoji: '📌' },
  twitter:   { label: 'Twitter/X', color: '#1DA1F2', bg: 'rgba(29,161,242,0.12)', emoji: '🐦' },
  facebook:  { label: 'Facebook',  color: '#1877F2', bg: 'rgba(24,119,242,0.12)', emoji: '👍' },
  other:     { label: 'Link',      color: '#D4AF37', bg: 'rgba(252,163,17,0.15)', emoji: '🔗' },
};

// Group links by platform
const groupLinksByPlatform = (links = []) => {
  const groups = {};
  for (const link of links) {
    const p = link.platform || 'other';
    if (!groups[p]) groups[p] = [];
    groups[p].push(link);
  }
  return groups;
};

// ==========================================
// Link Input Component
// ==========================================
function LinkAdder({ links, setLinks }) {
  const [inputUrl, setInputUrl] = useState('');
  const [inputLabel, setInputLabel] = useState('');

  const addLink = () => {
    const url = inputUrl.trim();
    if (!url) return;
    try { new URL(url); } catch { toast.error('Valid URL daalo (e.g. https://...)'); return; }
    const platform = detectPlatform(url);
    setLinks((prev) => [...prev, { platform, url, label: inputLabel.trim() }]);
    setInputUrl('');
    setInputLabel('');
  };

  const removeLink = (idx) => setLinks((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <label className="text-[#8B8B8B] block font-semibold mb-1">Platform Links (Instagram, YouTube, TikTok...)</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
          placeholder="https://instagram.com/p/..."
          className="flex-1 bg-[#FAFAFA] border border-gray-100 text-[#1A1A1A] p-2.5 rounded-xl focus:outline-none placeholder-[#8B8B8B] text-xs"
        />
        <button
          type="button"
          onClick={addLink}
          className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 text-xs font-semibold hover:bg-amber-100 transition-all"
        >
          Add
        </button>
      </div>
      <input
        type="text"
        value={inputLabel}
        onChange={(e) => setInputLabel(e.target.value)}
        placeholder="Optional label (e.g. 'Sunset reel')"
        className="w-full bg-[#FAFAFA] border border-gray-100 text-[#1A1A1A] p-2.5 rounded-xl focus:outline-none placeholder-[#8B8B8B] text-xs"
      />

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {links.map((lnk, i) => {
            const meta = PLATFORM_META[lnk.platform] || PLATFORM_META.other;
            return (
              <span
                key={i}
                style={{ background: meta.bg, border: `1px solid ${meta.color}40`, color: meta.color }}
                className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full"
              >
                {meta.emoji} {lnk.label || meta.label}
                <button type="button" onClick={() => removeLink(i)} className="ml-0.5 opacity-60 hover:opacity-100">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Journal Entry Card
// ==========================================
function JournalCard({ entry, onDelete, onEdit }) {
  const grouped = groupLinksByPlatform(entry.links);
  const locationText = entry.trip?.destinationName || 'World Explorer';

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      
      {/* Cover Image */}
      <div className="relative h-[220px] w-full bg-[#F5F8F6]">
        {entry.coverImage ? (
          <img src={entry.coverImage} alt={entry.title} className="w-full h-full object-cover" />
        ) : (
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800" alt="placeholder" className="w-full h-full object-cover opacity-80" />
        )}
        
        {entry.isAiGenerated && (
          <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#1A3626]/80 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI ENHANCED
          </span>
        )}
        
        <span className="absolute bottom-4 right-4 text-[10px] font-bold bg-black/60 text-white backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
          <ImageIcon className="w-3 h-3" /> {(entry.highlights?.length || 0) + 12} PHOTOS
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        
        {/* Date + Actions */}
        <div className="flex justify-between items-center text-[#4A4A4A] text-sm font-semibold mb-4">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#437A60]" /> 
            {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <div className="flex gap-3 text-[#A0A0A0]">
            <button onClick={() => onEdit(entry)} className="hover:text-[#1A1A1A] transition-colors"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => onDelete(entry._id)} className="hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button className="hover:text-[#1A1A1A] transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Title & Summary */}
        <div className="mb-4 flex-1">
          <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-snug">{entry.title}</h3>
          <p className="text-[13px] text-[#8B8B8B] mt-2.5 leading-relaxed line-clamp-3">{entry.summary}</p>
        </div>

        {/* Links section */}
        {Object.keys(grouped).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {Object.entries(grouped).map(([platform, pLinks]) => {
              const meta = PLATFORM_META[platform] || PLATFORM_META.other;
              return pLinks.map((lnk, i) => (
                <a key={`${platform}-${i}`} href={lnk.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-[#FAFAFA] border border-gray-100 hover:bg-gray-50 text-[#4A4A4A]">
                  {meta.emoji} Link
                </a>
              ));
            })}
          </div>
        )}

        {/* Location / Bottom */}
        <div className="pt-2 flex justify-between items-center">
          <span className="flex items-center gap-1.5 bg-[#F4F9F6] text-[#2A5C43] font-bold text-[11px] px-3.5 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5" /> {locationText}
          </span>
          <button className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-[#FAFAFA] text-[#8B8B8B] transition-colors shadow-sm">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// Create/Edit Modal
// ==========================================
function JournalModal({ isEdit, entry, trips, onClose, onSave }) {
  const [selectedTripId, setSelectedTripId] = useState(entry?.trip?._id || entry?.trip || '');
  const [title, setTitle] = useState(entry?.title || '');
  const [summary, setSummary] = useState(entry?.summary || '');
  const [highlights, setHighlights] = useState(entry?.highlights?.join(', ') || '');
  const [links, setLinks] = useState(entry?.links || []);
  const [userNotes, setUserNotes] = useState(entry?.userNotes || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!summary.trim()) { toast.error('Story/summary zaroor daalo'); return; }
    setSaving(true);
    const payload = {
      tripId: selectedTripId || undefined,
      title: title || 'My Travel Journal Entry',
      summary,
      highlights: highlights.split(',').map((h) => h.trim()).filter(Boolean),
      links,
      userNotes,
    };
    try {
      if (isEdit) {
        await api.patch(`/journal/${entry._id}`, payload);
        toast.success('Journal entry updated!');
      } else {
        await api.post('/journal', payload);
        toast.success('Journal entry created!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save journal entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#1A1A1A]">
            {isEdit ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {trips.length > 0 && (
            <div>
              <label className="text-[#8B8B8B] block font-bold text-[11px] uppercase tracking-wider mb-1.5">Link to Trip (optional)</label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-gray-100 text-[#1A1A1A] p-3 rounded-xl focus:outline-none focus:border-amber-300 font-medium"
              >
                <option value="">None</option>
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>{getTripDisplayName(t)}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-[#8B8B8B] block font-bold text-[11px] uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-100 text-[#1A1A1A] p-3 rounded-xl focus:outline-none focus:border-amber-300 font-medium"
              placeholder="e.g. Sunset over Arashiyama"
            />
          </div>

          <div>
            <label className="text-[#8B8B8B] block font-bold text-[11px] uppercase tracking-wider mb-1.5">Your Story</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-100 text-[#1A1A1A] p-3 rounded-xl h-32 focus:outline-none focus:border-amber-300 resize-none font-medium leading-relaxed"
              required
              placeholder="Write about your journey..."
            />
          </div>

          <div>
            <label className="text-[#8B8B8B] block font-bold text-[11px] uppercase tracking-wider mb-1.5">Highlights (comma separated)</label>
            <input
              type="text"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-gray-100 text-[#1A1A1A] p-3 rounded-xl focus:outline-none focus:border-amber-300 font-medium"
              placeholder="e.g. Bamboo forest, Local ramen"
            />
          </div>

          <LinkAdder links={links} setLinks={setLinks} />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#1A3626] text-white font-bold text-[15px] py-4 rounded-full mt-4 shadow-md hover:bg-[#112419] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Entry' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// Main Journal Component
// ==========================================
export default function Journal() {
  const { trips } = useTrips();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchJournals(); }, []);

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/journal');
      setEntries(res.data || []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAi = async (tripId) => {
    if (!tripId) { toast.error('Select a trip first'); return; }
    setGeneratingAi(true);
    toast.loading('AI is writing your travel journal...', { id: 'journal_gen' });
    try {
      await api.post('/ai/generate-journal', { tripId });
      toast.success('AI Journal entry generated!', { id: 'journal_gen' });
      fetchJournals();
    } catch (e) {
      toast.error(e.message || 'Failed to generate journal', { id: 'journal_gen' });
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this journal entry?')) return;
    try {
      await api.delete(`/journal/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      toast.success('Journal entry deleted');
    } catch (e) {
      toast.error(e.message || 'Failed to delete entry');
    }
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditEntry(null);
  };

  const filtered = entries.filter(
    (e) =>
      !searchQuery ||
      e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-[#E9F3ED] to-[#F2F8F5] rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-8 md:px-10 min-h-[160px] shadow-sm border border-gray-100">
        
        {/* Subtle Decorative Background */}
        <div className="absolute right-0 bottom-0 pointer-events-none w-[60%] h-full opacity-50">
          <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 150 Q100 100 200 130 T400 80 T500 100 V150 H0 Z" fill="#D2E2D6" opacity="0.4"/>
            <path d="M50 150 Q150 110 250 140 T450 70 T500 90 V150 H50 Z" fill="#C1D7C7" opacity="0.4"/>
            <path stroke="#1A3626" strokeWidth="1.5" strokeDasharray="4 6" d="M150 140 Q250 90 350 110 T480 30" opacity="0.3" fill="none"/>
            <path d="M480 30 L465 35 L475 20 Z" fill="#1A3626" opacity="0.3"/>
          </svg>
        </div>

        {/* Left Side Info */}
        <div className="relative z-10 flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-[20px] bg-[#D4E8DC] border border-[#1A3626]/10 flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-8 h-8 text-[#1A3626]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#1A3626] tracking-tight flex items-center gap-2">
              AI Neural Travel Journal <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-sm text-[#4A5D53] mt-1.5 font-medium max-w-[400px] leading-relaxed">
              Write your own stories, add photos, tags, or let AI generate a journal from a trip.
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto items-end">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* AI Generate Dropdown */}
            {trips.length > 0 && (
              <div className="relative bg-white rounded-full shadow-sm border border-gray-100 flex items-center px-4 py-2 hover:border-gray-200 transition-colors cursor-pointer">
                <Sparkles className="w-4 h-4 text-[#1A3626] shrink-0 mr-2" />
                <select
                  onChange={(e) => e.target.value && handleGenerateAi(e.target.value)}
                  disabled={generatingAi}
                  defaultValue=""
                  className="bg-transparent text-[13px] text-[#1A3626] font-bold focus:outline-none appearance-none disabled:opacity-50 pr-6"
                >
                  <option value="" disabled>
                    {generatingAi ? 'Generating...' : 'AI Generated for Trips'}
                  </option>
                  {trips.map((t) => (
                    <option key={t._id} value={t._id}>{getTripDisplayName(t)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#1A3626] absolute right-3 pointer-events-none" />
              </div>
            )}

            {/* Search Input */}
            <div className="relative bg-white rounded-full shadow-sm border border-gray-100 px-4 py-2 flex items-center w-48">
              <Search className="w-4 h-4 text-[#8B8B8B] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-[13px] text-[#1A1A1A] placeholder:text-[#8B8B8B] w-full"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setEditEntry(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1A3626] hover:bg-[#112419] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all shadow-md mr-auto md:mr-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Grid of Journals */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-[#1A3626] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <BookOpen className="w-12 h-12 text-[#E5E5E7] mx-auto mb-4" />
          <p className="text-sm font-medium text-[#8B8B8B]">
            {searchQuery ? 'No journals match your search.' : "You haven't written any journals yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((entry) => (
            <JournalCard
              key={entry._id}
              entry={entry}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showModal && (
        <JournalModal
          isEdit={!!editEntry}
          entry={editEntry}
          trips={trips}
          onClose={handleCloseModal}
          onSave={fetchJournals}
        />
      )}
    </div>
  );
}
