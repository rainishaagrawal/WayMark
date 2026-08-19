import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  MapPin,
  Camera,
  CloudSun,
  Heart,
  Receipt,
  Users,
  PackageCheck,
  BookOpen,
  Landmark,
  Calendar,
  Bell,
  BarChart3,
  User,
  Settings,
  ShieldAlert,
  Dna,
  LogOut,
  DollarSign,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useTrips();
  const location = useLocation();

  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Explore & Discover', path: '/explore', icon: Compass },
        { name: 'AI Planner', path: '/planner', icon: Sparkles, badge: 'AI' },
      ],
    },
    {
      title: 'TRIP EXECUTION',
      items: [
        { name: 'Active Trips', path: '/trips', icon: MapPin },
        { name: 'Group Trips', path: '/group-trips', icon: Users },
        { name: 'Expense Splitter', path: '/expenses', icon: Receipt },
        { name: 'Packing List', path: '/packing', icon: PackageCheck },
        { name: 'AI Travel Journal', path: '/journal', icon: BookOpen },
      ],
    },
    {
      title: 'DISCOVERY SUITE',
      items: [
        { name: 'Weather Forecast', path: '/weather', icon: CloudSun },
        { name: 'Saved Wishlists', path: '/wishlist', icon: Heart },
        { name: 'Landmark Scanner', path: '/landmark', icon: Landmark, badge: 'Vision' },
        { name: 'Global Festivals', path: '/festivals', icon: Calendar },
        { name: 'Currency Converter', path: '/currency', icon: DollarSign, badge: 'Live' },
      ],
    },
    {
      title: 'MEMORIES & INTELLIGENCE',
      items: [
        { name: 'Travel Memories', path: '/memories', icon: Camera },
        { name: 'Travel DNA', path: '/travel-dna', icon: Dna },
        { name: 'Analytics & Insights', path: '/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount > 0 ? String(unreadCount) : null },
        { name: 'Profile & Passport', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Admin Console', path: '/admin', icon: ShieldAlert, adminOnly: true },
      ],
    },
  ];

  return (
    <aside className={`w-72 bg-white h-screen flex flex-col fixed left-0 top-0 z-50 select-none overflow-hidden border-r border-[#E5E5E7]/60 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/waymark-logo.png" alt="WayMark" className="w-10 h-10 object-contain drop-shadow-sm" />
          <div>
            <h1 className="font-bold text-lg text-[#1A1A1A] tracking-tight flex items-center gap-1.5">
              WayMark
            </h1>
            <span className="text-[10px] text-[#8B8B8B] uppercase tracking-wider font-semibold">Pro Suite v2.4</span>
          </div>
        </div>
        {setIsOpen && (
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navSections.map((section, idx) => {
          const filteredItems = section.items.filter((item) => !item.adminOnly || user?.role === 'ADMIN');
          if (filteredItems.length === 0) return null;

          return (
            <div key={idx}>
              <p className="px-3 text-[10px] font-bold text-[#8B8B8B] tracking-widest uppercase mb-2">{section.title}</p>
              <div className="space-y-1">
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen && setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                        isActive
                            ? 'bg-[#F5F8F6] text-[#1A3626] font-bold'
                            : 'text-[#8B8B8B] hover:text-[#1A3626] hover:bg-black/[0.02]'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#437A60]' : 'text-[#8B8B8B]'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            item.badge === 'AI' || item.badge === 'Vision'
                              ? 'bg-[#FFF6E1] text-[#C9A227]'
                              : item.badge === 'Live'
                              ? 'bg-[#EAF5EA] text-[#355E4B]'
                              : 'bg-red-50 text-red-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-100 bg-[#FAFAFA]/50">
        <div className="flex items-center justify-between group bg-white border border-gray-100 p-2 rounded-2xl shadow-sm hover:border-gray-200 transition-all cursor-pointer">
          <div className="flex items-center gap-3 overflow-hidden pl-1">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-[#8B8B8B]" />
              )}
            </div>
            <div className="truncate">
              <p className="text-[13px] font-bold text-[#1A1A1A] truncate">{user?.name || 'Explorer'}</p>
              <p className="text-[10px] text-[#8B8B8B] truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 rounded-xl text-[#8B8B8B] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
