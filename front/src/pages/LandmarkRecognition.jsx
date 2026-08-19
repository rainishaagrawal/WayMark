import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, MapPin, Loader2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';

export default function LandmarkRecognition() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast.error('Please upload a photo first');
      return;
    }
    setScanning(true);
    toast.loading('AI Computer Vision analyzing landmark details...', { id: 'vision' });

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await api.post('/landmark/detect', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
      toast.success('Landmark identified!', { id: 'vision' });
    } catch (err) {
      toast.error(err.message || 'Failed to analyze image', { id: 'vision' });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">

      {/* ── Banner — full-width photo with left fade ── */}
      <div
        className="relative rounded-[24px] overflow-hidden min-h-[160px] flex items-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        {/* Strong white gradient so left text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/10" />

        <div className="relative z-10 p-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border-2 border-dashed border-[#437A60] shadow-sm flex-shrink-0">
            <Camera className="w-6 h-6 text-[#1A3626]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3626]">AI Vision Landmark Scanner</h1>
            <p className="text-sm text-[#1A3626]/60 mt-1 max-w-sm">
              Upload any travel photo to identify monuments and historic sites.
            </p>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Upload Card */}
        <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
          />

          {/* Drop zone */}
          <div
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center text-center min-h-[240px] rounded-[16px] border-2 border-dashed transition-all ${
              imagePreview
                ? 'border-transparent'
                : 'border-[#437A60]/25 hover:border-[#437A60] cursor-pointer bg-[#fafbfa]'
            }`}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-[14px] max-h-[240px]"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview('');
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Stacked polaroids */}
                <div className="relative w-36 h-28 mb-6 mx-auto">
                  <div className="absolute top-0 left-0 w-20 h-20 bg-white p-1 pb-5 shadow-md border border-gray-200 rounded-sm -rotate-12 z-10">
                    <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=80" alt="" className="w-full h-full object-cover grayscale opacity-50" />
                  </div>
                  <div className="absolute top-1 right-0 w-20 h-20 bg-white p-1 pb-5 shadow-md border border-gray-200 rounded-sm rotate-12 z-20">
                    <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80" alt="" className="w-full h-full object-cover grayscale opacity-50" />
                  </div>
                  <div className="absolute top-3 left-7 w-20 h-20 bg-white p-1 pb-5 shadow-lg border border-gray-200 rounded-sm z-30">
                    <img src="https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=200&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                  {/* Upload badge */}
                  <div className="absolute -bottom-4 right-2 w-10 h-10 rounded-full bg-[#1A3626] flex items-center justify-center shadow-md z-40">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#1A3626] mt-2">Click or Drop Photo to Scan</h3>
                <p className="text-sm text-[#8B8B8B] mt-1">Supports JPG, PNG, WEBP up to 10MB</p>

                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="mt-5 bg-white border border-gray-200 text-[#1A3626] font-semibold text-sm px-7 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

          {/* Generate button — INSIDE the card, below upload */}
          <button
            onClick={handleGenerate}
            disabled={!imageFile || scanning}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-105 text-[#1A3626] font-bold text-sm py-4 rounded-[16px] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            {scanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{scanning ? 'Analyzing Image...' : 'Generate AI'}</span>
          </button>
        </div>

        {/* Right — Results / Info Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center">
          {result ? (
            <div className="animate-fade-in space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[#1A3626]">{result.landmark?.landmarkName}</h3>
                <p className="text-sm text-[#8B8B8B] flex items-center gap-1.5 mt-1.5">
                  <MapPin className="w-4 h-4 text-[#437A60] flex-shrink-0" />
                  {result.landmark?.city}, {result.landmark?.country}
                </p>
                {result.landmark?.architecturalStyle && (
                  <span className="mt-2 inline-block bg-[#EBF8F4] text-[#437A60] text-xs font-semibold px-3 py-1 rounded-full">
                    {result.landmark?.architecturalStyle}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-[16px] bg-[#f8faf9] border border-gray-100">
                <span className="font-bold text-[#1A3626] text-sm block mb-3">Historical Facts</span>
                <ul className="space-y-2">
                  {(result.landmark?.historicalFacts || []).map((fact, i) => (
                    <li key={i} className="text-sm text-[#8B8B8B] flex items-start gap-2">
                      <span className="text-[#437A60] font-bold mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.nearbyPois?.displayName && (
                <div className="p-4 rounded-[16px] bg-[#f8faf9] border border-gray-100">
                  <span className="font-bold text-[#1A3626] text-sm block mb-1">Nearby Area</span>
                  <p className="text-sm text-[#8B8B8B]">{result.nearbyPois.displayName}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-6">
              {/* Search + sparkle icon */}
              <div className="w-20 h-20 rounded-full bg-[#f8faf9] border border-gray-100 flex items-center justify-center mb-5 relative">
                <Search className="w-8 h-8 text-[#8B8B8B]" />
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FFF8E7] border border-[#D4AF37]/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#1A3626] mb-1">Quick, AI-powered landmark analysis</h3>
              <p className="text-sm text-[#8B8B8B] mb-8">Upload a photo and click Generate AI to identify it.</p>

              {/* Step cards */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="flex flex-col items-center p-3 rounded-xl bg-[#f8faf9] border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#437A60] font-bold text-xs mb-2">1</div>
                  <span className="text-xs font-bold text-[#1A3626]">Identify</span>
                  <span className="text-[10px] text-[#8B8B8B] mt-0.5 leading-tight text-center">Monument name</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-[#f8faf9] border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#FFF8E7] border border-[#D4AF37]/20 shadow-sm flex items-center justify-center text-[#D4AF37] font-bold text-xs mb-2">2</div>
                  <span className="text-xs font-bold text-[#1A3626]">History</span>
                  <span className="text-[10px] text-[#8B8B8B] mt-0.5 leading-tight text-center">Historical facts</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-[#f8faf9] border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#EBF8F4] border border-[#437A60]/20 shadow-sm flex items-center justify-center text-[#437A60] font-bold text-xs mb-2">3</div>
                  <span className="text-xs font-bold text-[#1A3626]">Explore</span>
                  <span className="text-[10px] text-[#8B8B8B] mt-0.5 leading-tight text-center">Nearby spots</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
