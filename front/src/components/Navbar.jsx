import React, { useState, useEffect, useRef } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="h-20 bg-transparent sticky top-0 z-20 px-8 flex items-center justify-between ml-72">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-[450px]">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations, flights, itineraries, memories..."
            className="w-full bg-white text-xs text-[#2A2A2A] placeholder-[#8B8B8B] pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-[#E5E5E7] transition-all shadow-sm border border-[#E5E5E7]/50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-[#8B8B8B] bg-black/[0.04] px-1.5 py-0.5 rounded border border-black/[0.06] pointer-events-none">
            ⌘K
          </kbd>
        </form>
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
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E5E7]/50 flex items-center justify-center text-[#2A2A2A] hover:bg-black/[0.02] transition-colors relative shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 bg-[#EF4444] border-2 border-white rounded-full absolute top-2 right-2" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E5E7]/50 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <h4 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider">Notifications</h4>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <>
                      <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-[#8B8B8B] hover:text-[#2A2A2A] font-semibold"
                      >
                        Clear all
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#8B8B8B] text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id || n._id}
                      onClick={() => markNotificationAsRead(n.id || n._id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        n.isRead ? 'bg-[#FAFAFA] border-transparent opacity-75' : 'bg-white border-gray-100 shadow-sm hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-bold text-[#1A1A1A]">{n.title}</p>
                        <span className="text-[9px] text-[#8B8B8B] shrink-0 ml-2">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-[#8B8B8B] line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setShowNotifMenu(false);
                  navigate('/notifications');
                }}
                className="w-full text-center text-[11px] font-bold text-amber-500 mt-3 pt-3 border-t border-gray-100 hover:text-amber-600 transition-colors"
              >
                View Notifications Center →
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E5E7]/50 overflow-hidden shadow-sm hover:border-gray-300 transition-all focus:outline-none"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#FAFAFA] flex items-center justify-center text-[#8B8B8B]">
                <User className="w-5 h-5" />
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E5E7]/50 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in">
              <div className="p-3 border-b border-gray-100 mb-2">
                <p className="text-sm font-bold text-[#1A1A1A] truncate">{user?.name || 'Explorer'}</p>
                <p className="text-[10px] text-[#8B8B8B] truncate mt-0.5">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#4A4A4A] hover:bg-[#FAFAFA] transition-colors"
              >
                <User className="w-4 h-4 text-[#8B8B8B]" /> My Profile
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#4A4A4A] hover:bg-[#FAFAFA] transition-colors"
              >
                <Settings className="w-4 h-4 text-[#8B8B8B]" /> Settings
              </button>

              <div className="h-px bg-gray-100 my-2 mx-2" />

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
