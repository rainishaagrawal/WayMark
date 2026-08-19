import React from 'react';
import { Bell, Check, Dna, Bookmark, Plane, Trophy, Luggage, Info } from 'lucide-react';
import { useTrips } from '../context/TripContext';

const getNotificationStyle = (type, title = '') => {
  const t = title.toLowerCase();
  const m = type ? type.toLowerCase() : '';
  
  if (m === 'badge' || t.includes('badge')) {
    return {
      Icon: Trophy,
      bg: 'bg-purple-50',
      text: 'text-purple-500',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-600'
    };
  }
  if (m === 'itinerary' || t.includes('itinerary')) {
    return {
      Icon: Luggage,
      bg: 'bg-emerald-50',
      text: 'text-emerald-500',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-600'
    };
  }
  if (t.includes('created')) {
    return {
      Icon: Bookmark,
      bg: 'bg-blue-50',
      text: 'text-blue-500',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-600'
    };
  }
  if (t.includes('dna') || t.includes('10 new badges')) {
    return {
      Icon: Dna,
      bg: 'bg-green-50',
      text: 'text-green-500',
      badgeBg: 'bg-green-50',
      badgeText: 'text-green-600'
    };
  }
  if (m === 'trip' || t.includes('trip')) {
    return {
      Icon: Plane,
      bg: 'bg-amber-50',
      text: 'text-amber-500',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-600'
    };
  }
  
  return {
    Icon: Info,
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    badgeBg: 'bg-gray-50',
    badgeText: 'text-gray-600'
  };
};

const formatDate = (dateString) => {
  const d = new Date(dateString);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function Notifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useTrips();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div className="relative bg-white rounded-[32px] overflow-hidden min-h-[140px] flex items-center px-6 md:px-10 shadow-sm border border-gray-100">
        <div className="absolute right-0 bottom-0 opacity-[0.15] pointer-events-none w-1/2 h-full"
             style={{ backgroundImage: 'radial-gradient(circle at right bottom, #F59E0B, transparent 70%)' }} />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-[#FFF8ED] flex items-center justify-center flex-shrink-0">
              <Bell className="w-8 h-8 text-[#F59E0B]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[26px] font-bold text-[#1A1A1A] tracking-tight">
                Notification & Alerts Center
              </h1>
              <p className="text-sm text-[#8B8B8B] mt-1.5 leading-relaxed">
                Real-time system alerts, trip updates & badge notifications
              </p>
            </div>
          </div>
          
          {notifications.some((n) => !n.isRead) && (
            <button 
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-2 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] font-bold text-xs px-5 py-2.5 rounded-full transition-all shrink-0">
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-[#E5E5E7] mx-auto mb-4" />
            <p className="text-sm text-[#8B8B8B]">You're all caught up! No new notifications.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const style = getNotificationStyle(n.type, n.title);
            const Icon = style.Icon;
            
            return (
              <div
                key={n._id}
                onClick={() => markNotificationAsRead(n._id)}
                className={`flex items-center justify-between p-5 rounded-[24px] border transition-all cursor-pointer ${
                  n.isRead 
                    ? 'bg-[#FAFAFA] border-gray-50 opacity-70' 
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 ${style.bg}`}>
                    <Icon className={`w-6 h-6 ${style.text}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">{n.title}</h4>
                    <p className="text-xs text-[#8B8B8B] mt-1">{n.message}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-center shrink-0 ml-4 gap-2">
                  <span className="text-[11px] text-[#8B8B8B] font-medium block whitespace-nowrap">
                    {formatDate(n.createdAt)}
                  </span>
                  {!n.isRead && (
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${style.badgeBg} ${style.badgeText}`}>
                      New
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Pagination Dots (Visual Only for matching mockup) */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
            <div className="w-2 h-2 rounded-full bg-[#355E4B]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          </div>
        )}
      </div>
    </div>
  );
}
