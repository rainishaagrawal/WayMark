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
    <div className="space-y-6 animate-fade-in relative z-10 pb-10">

      {/* Header Banner */}
      <div
        className="relative rounded-[32px] overflow-hidden min-h-[160px] flex items-center shadow-sm border border-gray-100"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />

        <div className="relative z-10 p-8 flex items-center gap-5">
          <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
            <Camera className="w-7 h-7 text-[#1A3626]" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight">AI Vision Landmark Scanner</h1>
            <p className="text-sm text-[#8B8B8B] mt-1.5 max-w-sm font-medium">
              Upload any travel photo to identify monuments and historic sites.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left - Upload Card */}
        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
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
            className={`relative flex flex-col items-center justify-center text-center p-8 min-h-[340px] rounded-[32px] border-2 border-dashed transition-all ${
              imagePreview
                ? 'border-transparent p-0'
                : 'border-gray-200 hover:border-[#1A3626]/30 cursor-pointer bg-white'
            }`}
          >
            {imagePreview ? (
              <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-gray-100 shadow-sm group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover max-h-[340px]"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview('');
                    setResult(null);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                {/* Stacked polaroids matching screenshot */}
                <div className="relative w-48 h-40 mb-6 mx-auto">
                  <div className="absolute top-2 left-0 w-24 h-[104px] bg-white p-1.5 pb-6 shadow-md border border-gray-200 rounded-sm -rotate-[15deg] z-10 transition-transform hover:-rotate-[20deg] duration-300">
                    <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=80" alt="" className="w-full h-full object-cover grayscale opacity-70" />
                  </div>
                  <div className="absolute top-3 right-0 w-24 h-[104px] bg-white p-1.5 pb-6 shadow-md border border-gray-200 rounded-sm rotate-[15deg] z-20 transition-transform hover:rotate-[20deg] duration-300">
                    <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80" alt="" className="w-full h-full object-cover grayscale opacity-70" />
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[100px] h-[112px] bg-white p-1.5 pb-6 shadow-xl border border-gray-200 rounded-sm z-30 transition-transform hover:scale-105 duration-300">
                    <img src="https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=200&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                  {/* Upload badge */}
                  <div className="absolute -bottom-2 right-4 w-[42px] h-[42px] rounded-full bg-[#1A3626] flex items-center justify-center shadow-lg z-40 transition-transform hover:scale-110">
                    <Upload className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A3626] mt-4">Click or Drop Photo to Scan</h3>
                <p className="text-[13px] text-[#A0A0A0] font-medium mt-1">Supports JPG, PNG, WEBP up to 10MB</p>

                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="mt-6 bg-white border border-gray-200 text-[#1A3626] font-semibold text-[13px] px-6 py-2.5 rounded-full shadow-sm hover:border-gray-300 transition-colors"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!imageFile || scanning}
            className={`w-full font-bold text-[15px] py-4 rounded-[16px] transition-all flex items-center justify-center gap-2 shadow-sm ${
              !imageFile || scanning 
                ? 'bg-[#F9EFC3] text-[#A69B75] cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 to-amber-300 text-[#1A3626] hover:brightness-105 shadow-md'
            }`}
          >
            {scanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{scanning ? 'Analyzing Image...' : 'Generate AI'}</span>
          </button>
        </div>

        {/* Right - Results / Info Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center">
          {result ? (
            <div className="animate-fade-in space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1A3626]">{result.landmark?.landmarkName}</h3>
                <p className="text-sm text-[#8B8B8B] font-medium flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-[#1A3626] flex-shrink-0" />
                  {result.landmark?.city}, {result.landmark?.country}
                </p>
                {result.landmark?.architecturalStyle && (
                  <span className="mt-3 inline-block bg-[#F8FAFA] border border-gray-100 text-[#1A3626] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                    {result.landmark?.architecturalStyle}
                  </span>
                )}
              </div>

              <div className="p-5 rounded-[24px] bg-[#FAFAFA] border border-gray-100">
                <span className="font-bold text-[#1A3626] text-[13px] uppercase tracking-wider block mb-3">Historical Facts</span>
                <ul className="space-y-3">
                  {(result.landmark?.historicalFacts || []).map((fact, i) => (
                    <li key={i} className="text-[13px] text-[#4A4A4A] flex items-start gap-2.5">
                      <span className="text-amber-500 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.nearbyPois?.displayName && (
                <div className="p-5 rounded-[24px] bg-[#FAFAFA] border border-gray-100">
                  <span className="font-bold text-[#1A3626] text-[13px] uppercase tracking-wider block mb-2">Nearby Area</span>
                  <p className="text-[13px] text-[#4A4A4A] font-medium leading-relaxed">{result.nearbyPois.displayName}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-6">
              {/* Search + sparkle icon */}
              <div className="w-24 h-24 rounded-full bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-6 relative">
                <Search className="w-10 h-10 text-[#8B8B8B]" />
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Quick, AI-powered landmark analysis</h3>
              <p className="text-[15px] text-[#8B8B8B] font-medium mb-10 max-w-sm">Upload a photo and click Generate AI to magically identify it.</p>

              {/* Step cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center p-4 rounded-[20px] bg-[#FAFAFA] border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1A3626] font-bold text-xs mb-3">1</div>
                  <span className="text-[13px] font-bold text-[#1A1A1A]">Identify</span>
                  <span className="text-[11px] text-[#8B8B8B] font-medium mt-1 text-center">Monument name</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-[20px] bg-[#FAFAFA] border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-center text-amber-600 font-bold text-xs mb-3">2</div>
                  <span className="text-[13px] font-bold text-[#1A1A1A]">History</span>
                  <span className="text-[11px] text-[#8B8B8B] font-medium mt-1 text-center">Historical facts</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-[20px] bg-[#FAFAFA] border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-center text-emerald-600 font-bold text-xs mb-3">3</div>
                  <span className="text-[13px] font-bold text-[#1A1A1A]">Explore</span>
                  <span className="text-[11px] text-[#8B8B8B] font-medium mt-1 text-center">Nearby spots</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

