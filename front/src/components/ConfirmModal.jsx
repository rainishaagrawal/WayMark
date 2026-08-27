import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message, 
  confirmText = "Delete", 
  confirmColor = "bg-[#D93838] hover:bg-[#B32D2D]" 
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-fade-in border border-[#E5E5E7]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F7F2] hover:bg-[#E5E5E7] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[#8B8B8B]" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-[#FEECEB] flex items-center justify-center mb-4 border border-[#FAD7D4]">
            <AlertTriangle className="w-6 h-6 text-[#D93838]" />
          </div>
          
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
          <p className="text-sm text-[#8B8B8B] mb-6 leading-relaxed px-2">
            {message}
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 bg-[#F5F7F2] hover:bg-[#E5E5E7] text-[#1A1A1A] font-semibold text-sm py-3.5 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 text-white font-semibold text-sm py-3.5 rounded-xl transition-all shadow-md ${confirmColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
