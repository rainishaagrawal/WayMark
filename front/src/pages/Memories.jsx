import ConfirmModal from '../components/ConfirmModal';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, Loader2, Trash2, Share2, X, Upload, Search, Pencil, MapPin, Calendar, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';
import { useTrips } from '../context/TripContext';

const getTripDisplayName = (t) => t?.destinationName || t?.title || 'Untitled Trip';

// â”€â”€â”€ Edit Memory Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function EditMemoryModal({ memory, trips, onClose, onSave }) {
  const [summary, setSummary] = useState(memory.summary || '');
  const [locationName, setLocationName] = useState(memory.locationName || '');
  const [userThoughts, setUserThoughts] = useState(memory.userThoughts || '');
  const [tripRef, setTripRef] = useState(memory.tripRef?._id || memory.tripRef || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/memory/${memory._id}`, { summary, locationName, userThoughts });
      toast.success('Memory updated!');
      onSave();
      onClose();
    } catch {
      toast.error('Failed to update memory');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 pb-2 shrink-0">
          <h3 className="text-base font-bold text-[#1A3626]">Edit Memory</h3>
          <button onClick={onClose} className="text-[#8B8B8B] hover:text-[#1A3626] transition-colors p-1 bg-gray-50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-4 text-sm">
            {/* Preview */}
            {memory.mediaUrl && (
              <img
                src={memory.mediaUrl}
                alt="Memory"
                className="w-full h-40 object-cover rounded-[16px]"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#8B8B8B] block font-semibold mb-1.5 text-xs">Memory Title</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-gray-100 text-[#1A3626] p-3 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#437A60]/20"
                  placeholder="e.g. Sunset over the bamboo forest"
                />
              </div>

              <div>
                <label className="text-[#8B8B8B] block font-semibold mb-1.5 text-xs">Location</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-gray-100 text-[#1A3626] p-3 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#437A60]/20"
                  placeholder="e.g. Kyoto, Japan"
                />
              </div>

              <div>
                <label className="text-[#8B8B8B] block font-semibold mb-1.5 text-xs">Your Thoughts</label>
                <textarea
                  value={userThoughts}
                  onChange={(e) => setUserThoughts(e.target.value)}
                  className="w-full bg-[#f8faf9] border border-gray-100 text-[#1A3626] p-3 rounded-[16px] h-24 focus:outline-none focus:ring-2 focus:ring-[#437A60]/20 resize-none"
                  placeholder="What made this moment special?"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#E5B849] hover:bg-[#D4A736] text-[#1A3626] font-bold py-3.5 rounded-[16px] shadow-sm transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Update Memory'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ SVG Banner Graphic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BannerGraphic = () => (
  <svg className="absolute right-0 bottom-0 h-full w-[600px] object-cover pointer-events-none hidden md:block" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="280" cy="70" r="12" fill="#FCD34D" opacity="0.8" />
    
    {/* Back Mountains */}
    <path d="M300 180 L400 60 L500 180 Z" fill="#E2E8F0" />
    <path d="M400 60 L450 120 L350 120 Z" fill="#F8FAFC" />
    <path d="M420 180 L500 90 L580 180 Z" fill="#CBD5E1" />
    <path d="M500 90 L530 130 L470 130 Z" fill="#F1F5F9" />
    
    {/* Pine Trees Back */}
    <path d="M250 170 L260 120 L270 170 Z" fill="#0F766E" />
    <path d="M255 140 L260 100 L265 140 Z" fill="#0F766E" />
    <path d="M320 170 L330 110 L340 170 Z" fill="#0F766E" opacity="0.8"/>
    <path d="M325 130 L330 90 L335 130 Z" fill="#0F766E" opacity="0.8"/>
    
    {/* Water */}
    <path d="M200 170 L600 170 L600 200 L150 200 Z" fill="#BAE6FD" opacity="0.9" />
    <path d="M220 180 L600 180 L600 190 L180 190 Z" fill="#7DD3FC" opacity="0.7" />
    <path d="M250 175 L550 175" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
    
    {/* Front Land */}
    <path d="M100 200 L250 160 L350 170 L600 160 L600 200 Z" fill="#3F6212" opacity="0.6"/>
    <path d="M0 200 L150 165 L220 185 L400 200 Z" fill="#4D7C0F" opacity="0.8"/>
    
    {/* Front Pine Trees */}
    <path d="M180 190 L195 110 L210 190 Z" fill="#064E3B" />
    <path d="M185 140 L195 80 L205 140 Z" fill="#064E3B" />
    
    <path d="M480 180 L495 100 L510 180 Z" fill="#064E3B" />
    <path d="M485 130 L495 70 L505 130 Z" fill="#064E3B" />

    <path d="M540 190 L555 120 L570 190 Z" fill="#115E59" />
    <path d="M545 150 L555 90 L565 150 Z" fill="#115E59" />

    {/* Graphic Cameras/Polaroids */}
    <g transform="translate(490, 110) rotate(15)">
      <rect x="0" y="0" width="55" height="65" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      <rect x="5" y="5" width="45" height="45" fill="#475569" />
      <path d="M5 40 L20 25 L35 35 L50 20 L50 50 L5 50 Z" fill="#94A3B8" />
    </g>
    <g transform="translate(530, 95) rotate(-10)">
      <rect x="0" y="0" width="55" height="65" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      <rect x="5" y="5" width="45" height="45" fill="#64748B" />
      <circle cx="27" cy="27" r="10" fill="#CBD5E1" />
    </g>
    <g transform="translate(440, 130)">
      <rect x="0" y="0" width="70" height="45" rx="8" fill="#1E293B" />
      <rect x="0" y="20" width="70" height="25" rx="8" fill="#334155" />
      <circle cx="35" cy="22" r="14" fill="#94A3B8" />
      <circle cx="35" cy="22" r="9" fill="#0F172A" />
      <circle cx="38" cy="19" r="2" fill="white" opacity="0.6"/>
      <rect x="10" y="8" width="12" height="8" rx="2" fill="#94A3B8" />
    </g>
  </svg>
);

// â”€â”€â”€ Main Memories Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Memories() {
  const { trips } = useTrips();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMemory, setEditMemory] = useState(null);

  // Upload form state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [summary, setSummary] = useState('');
  const [userThoughts, setUserThoughts] = useState('');
  const [locationName, setLocationName] = useState('');
  const [tripRef, setTripRef] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => { fetchMemories(); }, []);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/memory');
      setMemories(res.data || []);
    } catch {
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) { toast.error('Please choose an image file'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) { toast.error('Please select a photo to upload'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('summary', summary);
      formData.append('userThoughts', userThoughts);
      formData.append('locationName', locationName);
      if (tripRef) formData.append('tripRef', tripRef);
      await api.post('/memory/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Memory saved!');
      setShowModal(false);
      setImageFile(null); setImagePreview(''); setSummary(''); setUserThoughts(''); setLocationName(''); setTripRef('');
      fetchMemories();
    } catch (e) {
      toast.error(e.message || 'Failed to upload memory');
    } finally {
      setUploading(false);
    }
  };

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, deleteId: null, message: '' });

  const handleDelete = async (id) => {
    setConfirmModal({ isOpen: true, deleteId: id, message: 'Delete this memory?' });
  };

  const confirmDelete = async () => {
    const id = confirmModal.deleteId;
    if (!id) return;
    try {
      await api.delete(`/memory/${id}`);
      setMemories((prev) => prev.filter((m) => m._id !== id));
      toast.success('Memory deleted');
    } catch (e) {
      toast.error(e.message || 'Failed to delete memory');
    }
    setConfirmModal({ isOpen: false, deleteId: null, message: '' });
  };

  const handleShare = async (mem) => {
    const shareText = `${mem.summary || 'A travel memory'}${mem.locationName ? ` â€” ${mem.locationName}` : ''}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'WayMark Memory', text: shareText, url: mem.mediaUrl }); }
      catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${mem.mediaUrl}`);
      toast.success('Memory link copied to clipboard!');
    }
  };

  const filtered = memories.filter(
    (m) =>
      !searchQuery ||
      m.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.userThoughts?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* â”€â”€ Header Banner â”€â”€ */}
      <div className="relative bg-[#FAFAF5] rounded-[32px] overflow-hidden min-h-[160px] flex items-center px-10 border border-gray-100 shadow-sm">
        <BannerGraphic />
        <div className="relative z-10 flex items-center gap-6 max-w-xl">
          <div className="w-16 h-16 rounded-[20px] bg-[#FFF8E7] border border-[#FDE68A]/30 flex items-center justify-center shadow-sm flex-shrink-0">
            <Camera className="w-8 h-8 text-[#D97706]" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#1A3626] tracking-tight">Travel Memories Vault</h1>
            <p className="text-sm text-[#8B8B8B] mt-1.5 leading-relaxed">
              Upload your own travel photos and keep the<br/>special moments safe and organized.
            </p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Search and Action â”€â”€ */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="w-full bg-white text-sm text-[#1A3626] placeholder-[#8B8B8B] pl-11 pr-4 py-3.5 rounded-full border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#437A60]/20 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#1A3626] p-1 bg-gray-50 rounded-full">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#E5B849] hover:bg-[#D4A736] text-[#1A3626] font-bold text-sm px-6 py-3.5 rounded-full shadow-sm transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> <span>New Memory</span>
        </button>
      </div>

      {/* â”€â”€ Content Grid â”€â”€ */}
      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-gray-100 p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <Camera className="w-12 h-12 text-[#E5E7EB] mb-4" />
          <h3 className="text-base font-bold text-[#1A3626]">No memories yet</h3>
          <p className="text-sm text-[#8B8B8B] mt-1.5">Upload your first travel photo to start your memory vault.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-gray-100 p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <Search className="w-10 h-10 text-[#E5E7EB] mb-4" />
          <h3 className="text-base font-bold text-[#1A3626]">No memories found for "{searchQuery}"</h3>
          <p className="text-sm text-[#8B8B8B] mt-1.5">Try searching by location name or memory title.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((mem) => (
            <div key={mem._id} className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all">
              
              {/* Image Section */}
              <div className="relative h-48 rounded-[16px] overflow-hidden bg-[#f8faf9] flex items-center justify-center mb-4">
                {mem.mediaUrl ? (
                  <img
                    src={mem.mediaUrl}
                    alt={mem.summary}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  style={{ display: mem.mediaUrl ? 'none' : 'flex' }}
                  className="w-full h-full flex-col items-center justify-center text-[#8B8B8B]"
                >
                  <Camera className="w-8 h-8 mb-2 opacity-30" />
                  <span className="text-[10px] opacity-50 uppercase tracking-wider font-semibold">No Image</span>
                </div>
                
                {/* Floating Bookmark Button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform text-[#1A3626]">
                  <Bookmark className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-[#1A3626] line-clamp-1">{mem.summary || 'Untitled Memory'}</h3>
                {mem.locationName && (
                  <p className="text-xs text-[#8B8B8B] mt-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {mem.locationName}
                  </p>
                )}
                {mem.userThoughts && (
                  <p className="text-[11px] text-[#8B8B8B] mt-2 line-clamp-2 leading-relaxed">
                    {mem.userThoughts}
                  </p>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between mt-5 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8B8B8B] font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(mem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditMemory(mem)}
                    className="text-[#A0AEC0] hover:text-[#1A3626] transition-colors"
                    title="Edit memory"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleShare(mem)} className="text-[#A0AEC0] hover:text-[#1A3626] transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(mem._id)} className="text-[#A0AEC0] hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* â”€â”€ Upload New Memory Modal â”€â”€ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 pb-2 shrink-0">
              <h3 className="text-base font-bold text-[#1A3626]">Upload New Travel Memory</h3>
              <button onClick={() => setShowModal(false)} className="text-[#8B8B8B] hover:text-[#1A3626] transition-colors p-1 bg-gray-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 pt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <form onSubmit={handleUpload} className="space-y-4 text-sm">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-200 hover:border-[#D4AF37]/50 bg-[#f8faf9] rounded-[16px] h-44 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-[#8B8B8B]" />
                      </div>
                      <span className="text-xs font-semibold text-[#8B8B8B]">Click or drop a photo here</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  className="hidden"
                />

                <div>
                  <label className="text-[#8B8B8B] block font-semibold mb-1.5 text-xs">Memory Title</label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-gray-100 text-[#1A3626] p-3 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#437A60]/20"
                    placeholder="e.g. Sunset over the bamboo forest"
                  />
                </div>

                <div>
                  <label className="text-[#8B8B8B] block font-semibold mb-1.5 text-xs">Location</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-gray-100 text-[#1A3626] p-3 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#437A60]/20"
                    placeholder="e.g. Kyoto, Japan"
                  />
                </div>

                {trips.length > 0 && (
                  <div>
                    <label className="text-[#8B8B8B] block font-semibold mb-1.5 text-xs">Link to Trip (optional)</label>
                    <select
                      value={tripRef}
                      onChange={(e) => setTripRef(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-gray-100 text-[#1A3626] p-3 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#437A60]/20 appearance-none"
                    >
                      <option value="">None</option>
                      {trips.map((t) => (
                        <option key={t._id} value={t._id}>{getTripDisplayName(t)}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[#8B8B8B] block font-semibold mb-1.5 text-xs">Share your thoughts</label>
                  <textarea
                    value={userThoughts}
                    onChange={(e) => setUserThoughts(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-gray-100 text-[#1A3626] p-3 rounded-[16px] h-20 focus:outline-none focus:ring-2 focus:ring-[#437A60]/20 resize-none"
                    placeholder="What made this moment special?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-[#E5B849] hover:bg-[#D4A736] text-[#1A3626] font-bold py-3.5 rounded-[16px] shadow-sm transition-all disabled:opacity-60"
                >
                  {uploading ? 'Uploading...' : 'Save Memory'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {editMemory && (
        <EditMemoryModal
          memory={editMemory}
          trips={trips}
          onClose={() => setEditMemory(null)}
          onSave={() => fetchMemories()}
        />
      )}
          <ConfirmModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ isOpen: false, deleteId: null, message: '' })} onConfirm={confirmDelete} title="Confirm Delete" message={confirmModal.message} />
    </div>
  );
}
