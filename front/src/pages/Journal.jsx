import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Plus, Trash2, Loader2, X, Search, Pencil, Link2, ExternalLink, ChevronDown } from 'lucide-react';
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
  instagram: { label: 'Instagram', color: '#E1306C', bg: 'rgba(225,48,108,0.15)', emoji: '📸' },
  youtube:   { label: 'YouTube',   color: '#FF0000', bg: 'rgba(255,0,0,0.12)',   emoji: '▶️' },
  tiktok:    { label: 'TikTok',    color: '#69C9D0', bg: 'rgba(105,201,208,0.15)', emoji: '🎵' },
  pinterest: { label: 'Pinterest', color: '#E60023', bg: 'rgba(230,0,35,0.12)',  emoji: '📌' },
  twitter:   { label: 'Twitter/X', color: '#1DA1F2', bg: 'rgba(29,161,242,0.12)', emoji: '🐦' },
  facebook:  { label: 'Facebook',  color: '#1877F2', bg: 'rgba(24,119,242,0.12)', emoji: '👥' },
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

// ─── Link Input Component ──────────────────────────────────────────────
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
          className="flex-1 glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none placeholder-[#8B8B8B] text-xs"
        />
        <button
          type="button"
          onClick={addLink}
          className="px-3 py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] text-xs font-semibold hover:bg-[#D4AF37]/30 transition-all"
        >
          Add
        </button>
      </div>
      <input
        type="text"
        value={inputLabel}
        onChange={(e) => setInputLabel(e.target.value)}
        placeholder="Optional label (e.g. 'Sunset reel')"
        className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none placeholder-[#8B8B8B] text-xs"
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

// ─── Journal Entry Card ────────────────────────────────────────────────
function JournalCard({ entry, onDelete, onEdit }) {
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState(entry.userNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const grouped = groupLinksByPlatform(entry.links);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await api.patch(`/journal/${entry._id}`, { userNotes: notesText });
      toast.success('Notes saved!');
      setShowNotes(false);
    } catch {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm overflow-hidden flex flex-col">
      {/* Cover image at top */}
      {entry.coverImage && (
        <div className="relative h-52 w-full">
          <img src={entry.coverImage} alt={entry.title} className="w-full h-full object-cover" />
          {entry.isAiGenerated && (
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#1A3626]/80 text-[#EAF5EA] px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI ENHANCED
            </span>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col space-y-4 flex-1">
        {/* Date + Actions row */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#355E4B] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#355E4B]/20 border border-[#355E4B]/30 inline-block" />
            {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <div className="flex items-center gap-2">
            {entry.isAiGenerated && !entry.coverImage && (
              <span className="text-[10px] font-bold bg-[#EAF5EA] text-[#355E4B] px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI ENHANCED
              </span>
            )}
            <button onClick={() => onEdit(entry)} className="text-[#8B8B8B] hover:text-[#1A1A1A] transition-colors p-1" title="Edit entry">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(entry._id)} className="text-[#8B8B8B] hover:text-[#E02424] transition-colors p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Summary */}
        <div>
          <h3 className="text-base font-bold text-[#1A1A1A] leading-snug">{entry.title}</h3>
          <p className="text-sm text-[#8B8B8B] leading-relaxed mt-2 line-clamp-3">{entry.summary}</p>
        </div>

        {/* Highlights as pills */}
        {entry.highlights?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.highlights.map((h, i) => (
              <span key={i} className="text-xs bg-[#F5F7F2] border border-[#E5E5E7]/60 text-[#8B8B8B] px-3 py-1 rounded-full">{h}</span>
            ))}
          </div>
        )}

        {/* Platform Links */}
        {Object.keys(grouped).length > 0 && (
          <div className="pt-2 border-t border-[#E5E5E7]/60 space-y-2">
            <p className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider flex items-center gap-1">
              <Link2 className="w-3 h-3" /> Platform Links
            </p>
            {Object.entries(grouped).map(([platform, pLinks]) => {
              const meta = PLATFORM_META[platform] || PLATFORM_META.other;
              return (
                <div key={platform} className="flex flex-wrap gap-2">
                  {pLinks.map((lnk, i) => (
                    <a
                      key={i}
                      href={lnk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: meta.bg, border: `1px solid ${meta.color}40`, color: meta.color }}
                      className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full hover:brightness-110 transition-all"
                    >
                      {meta.emoji} {meta.label}
                    </a>
                  ))}
                  {pLinks.map((lnk, i) => (
                    <a
                      key={`view-${i}`}
                      href={lnk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#355E4B] hover:underline border border-[#355E4B]/20 bg-[#EAF5EA] px-4 py-2 rounded-full"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* AI User Notes */}
        {entry.isAiGenerated && (
          <div className="pt-2 border-t border-[#E5E5E7]/60">
            {entry.userNotes && !showNotes ? (
              <div className="space-y-1">
                <p className="text-[10px] text-[#8B8B8B] font-bold uppercase tracking-wider">✍️ My Notes</p>
                <p className="text-xs text-[#8B8B8B] italic leading-relaxed">"{entry.userNotes}"</p>
                <button onClick={() => setShowNotes(true)} className="text-[10px] text-[#D4AF37] hover:underline mt-0.5">Edit notes</button>
              </div>
            ) : showNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Add your personal thoughts..."
                  className="w-full bg-[#F9FBF8] border border-[#E5E5E7]/60 text-sm text-[#1A1A1A] p-3 rounded-xl h-20 resize-none focus:outline-none focus:border-[#355E4B]"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveNotes} disabled={savingNotes} className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black text-sm font-semibold py-2 rounded-xl disabled:opacity-60">
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                  <button onClick={() => setShowNotes(false)} className="px-4 py-2 bg-[#F5F7F2] border border-[#E5E5E7] text-[#8B8B8B] text-sm rounded-xl">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowNotes(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline">
                <Pencil className="w-3 h-3" /> Add My Notes
              </button>
            )}
          </div>
        )}

        {/* Shared from note */}
        {entry.sharedFrom && (
          <p className="text-xs text-[#D4AF37] flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Added by Friends to Jake's Diary
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Create/Edit Modal ─────────────────────────────────────────────────
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
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#2A2A2A]">
            {isEdit ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h3>
          <button onClick={onClose} className="text-[#8B8B8B] hover:text-[#2A2A2A]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {trips.length > 0 && (
            <div>
              <label className="text-[#8B8B8B] block font-semibold mb-1">Link to Trip (optional)</label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none"
              >
                <option value="">None</option>
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>{getTripDisplayName(t)}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-[#8B8B8B] block font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none"
              placeholder="e.g. Sunset over Arashiyama"
            />
          </div>

          <div>
            <label className="text-[#8B8B8B] block font-semibold mb-1">Your Story</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl h-28 focus:outline-none resize-none"
              required
              placeholder="Likho apna safar..."
            />
          </div>

          <div>
            <label className="text-[#8B8B8B] block font-semibold mb-1">Highlights (comma separated)</label>
            <input
              type="text"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl focus:outline-none"
              placeholder="e.g. Bamboo forest, Local ramen"
            />
          </div>

          {/* Platform Links */}
          <LinkAdder links={links} setLinks={setLinks} />

          {/* User notes (always shown in modal for flexibility) */}
          <div>
            <label className="text-[#8B8B8B] block font-semibold mb-1">Personal Notes / Additions</label>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="w-full glass-inset text-[#2A2A2A] p-2.5 rounded-xl h-16 focus:outline-none resize-none"
              placeholder="Kuch extra add karna? Apna experience, feelings..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] text-black font-semibold py-2.5 rounded-xl shadow-glow disabled:opacity-60"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Entry' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Journal Component ────────────────────────────────────────────
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative bg-[#F9FBF8] rounded-[28px] border border-[#E5E5E7]/50 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7">
        {/* Mountain SVG */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-50">
          <svg width="300" height="100" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L40 70L80 85L130 50L180 75L230 40L300 60V100H0Z" fill="#C9D4C5" opacity="0.3"/>
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF5EA] flex items-center justify-center shrink-0 shadow-sm border border-[#355E4B]/10">
            <BookOpen className="w-7 h-7 text-[#355E4B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3626] flex items-center gap-2">
              AI Neural Travel Journal <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </h1>
            <p className="text-[13px] text-[#8B8B8B] mt-1 max-w-sm">
              Write your own stories, add photos, tags, or let AI generate a journal from a trip.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 flex-wrap">
          {/* AI Generate Dropdown */}
          {trips.length > 0 && (
            <div className="relative">
              <select
                onChange={(e) => e.target.value && handleGenerateAi(e.target.value)}
                disabled={generatingAi}
                defaultValue=""
                className="bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] pl-4 pr-10 py-3 rounded-full focus:outline-none appearance-none shadow-sm font-semibold disabled:opacity-50"
              >
                <option value="" disabled>
                  {generatingAi ? '✨ Generating...' : '✨ AI Generated for Trips'}
                </option>
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>{getTripDisplayName(t)}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#8B8B8B] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#ADADAD] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              className="bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-[#355E4B] transition-colors shadow-sm w-48"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => { setEditEntry(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
          <BookOpen className="w-10 h-10 text-[#8B8B8B] mb-3" />
          <h3 className="text-sm font-bold text-[#2A2A2A]">No journal entries yet</h3>
          <p className="text-xs text-[#8B8B8B] mt-1">Write your first entry or generate one from a trip with AI.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-10 text-center flex flex-col items-center justify-center">
          <BookOpen className="w-8 h-8 text-[#8B8B8B] mb-3 opacity-50" />
          <h3 className="text-sm font-bold text-[#2A2A2A]">No entries found for "{searchQuery}"</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Create / Edit Modal */}
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
