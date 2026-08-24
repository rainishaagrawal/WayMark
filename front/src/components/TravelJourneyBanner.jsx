import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Edit2, Check, User, MapPin } from "lucide-react";

export default function TravelJourneyBanner({ 
  user, 
  completedTrips, 
  trips, 
  isEditing, 
  setIsEditing, 
  handleSave, 
  saving, 
  fileInputRef, 
  handleAvatarChange, 
  uploadingAvatar 
}) {
  const constraintsRef = useRef(null);
  
  return (
    <div ref={constraintsRef} className="relative h-64 rounded-[32px] overflow-hidden shadow-sm bg-[#F9F6F0] flex items-end p-6 md:p-10 border border-[#E5E5E7]/50">
      
      {/* Background Stickers Area */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Base Sticker - Always visible and draggable */}
        <motion.img 
          src="/profile-sticker.png" 
          alt="Vintage Travel Elements"
          drag
          dragMomentum={false}
          dragConstraints={constraintsRef}
          whileDrag={{ scale: 1.05, zIndex: 100 }}
          className="absolute bottom-4 right-8 w-40 md:w-56 h-auto object-contain opacity-95 mix-blend-multiply pointer-events-auto cursor-grab active:cursor-grabbing z-0"
        />

        {/* Safe zone for text/avatar is left ~40%. We put stickers on the right 60% */}
        <div className="absolute top-2 right-4 bottom-2 left-[35%] flex flex-wrap-reverse justify-end items-end gap-x-0 gap-y-2 pb-2 pl-10 pr-2" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 15%)" }}>
          <AnimatePresence>
            {completedTrips.map((trip, idx) => {
              if (!trip.stickerUrl) return null;
              
              const rotate = (idx % 3 === 0) ? -6 : (idx % 3 === 1) ? 8 : -3;
              const zIndex = idx + 1; // Above the base sticker
              
              return (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, scale: 0.5, y: 20, rotate }}
                  animate={{ opacity: 0.95, scale: 1, y: 0, rotate }}
                  transition={{ duration: 0.6, type: "spring" }}
                  drag
                  dragMomentum={false}
                  dragConstraints={constraintsRef}
                  whileDrag={{ scale: 1.1, zIndex: 100 }}
                  className="relative mix-blend-multiply drop-shadow-sm -ml-8 hover:z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
                  style={{ zIndex }}
                >
                  <img 
                    src={trip.stickerUrl} 
                    alt={trip.landmark || trip.destinationName} 
                    className="w-28 md:w-36 h-auto object-contain drop-shadow-md"
                    onError={(e) => { e.target.style.display = "none" }}
                  />
                  {/* Location Tag */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white/95 px-2 py-0.5 rounded-full text-[9px] font-black text-[#2A2A2A] shadow-sm whitespace-nowrap tracking-tight uppercase">
                    {trip.destinationName}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-6">
          <div className="relative pointer-events-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-[28px] border-4 border-amber-400 overflow-hidden bg-white flex items-center justify-center relative group shadow-xl z-20"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-300" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                {uploadingAvatar ? <span className="text-[10px] text-white font-bold">...</span> : <Camera className="w-6 h-6 text-white" />}
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          
          <div className="pb-2 pointer-events-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#2A2A2A] tracking-tight drop-shadow-sm">{user?.name}</h1>
              {completedTrips.length > 0 && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
                  {completedTrips.length} TRIPS COMPLETED
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A5A5A] flex items-center gap-1.5 mt-2 font-medium">
              <MapPin className="w-4 h-4 text-amber-500" /> {trips.length} trips planned
            </p>
          </div>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={saving}
          className="bg-[#2A2A2A] hover:bg-black text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 disabled:opacity-60 mb-2 shadow-lg z-20 pointer-events-auto"
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          <span>{saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Passport"}</span>
        </button>
      </div>
    </div>
  );
}

