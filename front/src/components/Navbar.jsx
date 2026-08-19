import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, LogOut, Settings, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useTrips();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-20 bg-transparent sticky top-0 z-20 px-8 flex items-center justify-between ml-64">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-[450px]">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search destinations, flights, itineraries, memories..."
            className="w-full bg-white text-xs text-[#2A2A2A] placeholder-[#8B8B8B] pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-[#E5E5E7] transition-all shadow-sm border border-[#E5E5E7]/50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-[#8B8B8B] bg-black/[0.04] px-1.5 py-0.5 rounded border border-black/[0.06]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick AI Planner Button */}
        <button
          onClick={() => navigate('/planner')}
          className="flex items-center gap-2 bg-[#0F2B24] hover:bg-[#0A1F1A] text-white font-medium text-xs px-5 py-2.5 rounded-full transition-all shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plan with AI</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E5E7]/50 flex items-center justify-center text-[#2A2A2A] hover:bg-black/[0.02] transition-colors relative shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 bg-[#EF4444] border-2 border-white rounded-full absolute top-2 right-2" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 shadow-2xl z-50 animate-fade-in">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-2 mb-3">
                <h4 className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider">Notifications</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#D4AF37] font-semibold">{unreadCount} New</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] text-[#8B8B8B] hover:text-[#2A2A2A] underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id || n._id}
                    onClick={() => markNotificationAsRead(n.id || n._id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      n.isRead ? 'bg-black/[0.02] border-black/[0.05] opacity-75' : 'bg-[#D4AF37]/5 border-[#D4AF37]/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-[#2A2A2A]">{n.title}</p>
                      <span className="text-[9px] text-[#8B8B8B] ml-2">{n.timeText || 'Just now'}</span>
                    </div>
                    <p className="text-[11px] text-[#8B8B8B] mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowNotifMenu(false);
                  navigate('/notifications');
                }}
                className="w-full text-center text-xs font-semibold text-[#D4AF37] mt-3 block hover:underline"
              >
                View Notifications Center →
              </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full border border-[#E5E5E7] flex items-center justify-center transition-colors overflow-hidden bg-white shadow-sm"
            title="User Profile"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-[#8B8B8B]" />
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-black/[0.06] mb-1">
                <p className="text-xs font-semibold text-[#2A2A2A]">{user?.name}</p>
                <p className="text-[10px] text-[#8B8B8B] truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8B8B8B] hover:text-[#0F2B24] hover:bg-black/[0.04] flex items-center gap-2.5"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                Profile & Passport
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8B8B8B] hover:text-[#0F2B24] hover:bg-black/[0.04] flex items-center gap-2.5"
              >
                <Settings className="w-3.5 h-3.5" />
                Account Settings
              </button>
              <div className="border-t border-black/[0.06] my-1" />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#F87171] hover:bg-[#F87171]/10 flex items-center gap-2.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
