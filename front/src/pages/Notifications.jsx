import React from 'react';
import { Bell, CheckCircle2, Check } from 'lucide-react';
import { useTrips } from '../context/TripContext';

export default function Notifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useTrips();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 glass-card flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#2A2A2A] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#D4AF37]" /> Notification & Alerts Center
          </h1>
          <p className="text-xs text-[#8B8B8B] mt-0.5">Real-time system alerts, trip updates & badge notifications.</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-2 glass-inset hover:border-[#D4AF37]/40 text-[#D4AF37] font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      <div className="glass-card p-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-8 h-8 text-[#8B8B8B] mx-auto mb-2" />
            <p className="text-xs text-[#8B8B8B]">No notifications yet — they'll appear here as you use WayMark.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markNotificationAsRead(n._id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                n.isRead ? 'bg-black/[0.02] border-white/[0.05] opacity-75' : 'glass-inset border-[#D4AF37]/30 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`w-5 h-5 ${n.isRead ? 'text-[#8B8B8B]' : 'text-[#D4AF37]'}`} />
                <div>
                  <h4 className="text-xs font-bold text-[#2A2A2A]">{n.title}</h4>
                  <p className="text-xs text-[#8B8B8B] mt-0.5">{n.message}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-[10px] text-[#8B8B8B] font-medium block">{new Date(n.createdAt).toLocaleDateString()}</span>
                {!n.isRead && (
                  <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-full border border-[#D4AF37]/30 mt-1 inline-block">
                    NEW
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
