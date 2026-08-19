import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();

  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [badges, setBadges] = useState([]);

  const refreshTrips = useCallback(async () => {
    if (!user) return;
    setTripsLoading(true);
    try {
      const res = await api.get('/trips');
      setTrips(res.data || []);
    } catch (e) {
      console.warn('Failed to load trips:', e.message);
    } finally {
      setTripsLoading(false);
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (e) {
      console.warn('Failed to load notifications:', e.message);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data?.count || 0);
    } catch (e) {
      // Silent - non-critical
    }
  }, [user]);

  const fetchBadges = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/badges/mine');
      setBadges(res.data || []);
    } catch (e) {
      // Silent - non-critical
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshTrips();
      fetchNotifications();
      fetchUnreadCount();
      fetchBadges();
    } else {
      setTrips([]);
      setNotifications([]);
      setUnreadCount(0);
      setBadges([]);
      setActiveTrip(null);
    }
  }, [user, refreshTrips, fetchNotifications, fetchUnreadCount, fetchBadges]);

  const deleteTrip = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
      if (activeTrip?._id === tripId) setActiveTrip(null);
      toast.success('Trip deleted successfully');
    } catch (e) {
      toast.error(e.message || 'Failed to delete trip');
    }
  };

  const completeTrip = async (tripId) => {
    try {
      const res = await api.patch(`/trips/${tripId}/complete`);
      await refreshTrips();
      await fetchNotifications();
      await fetchUnreadCount();
      await fetchBadges();
      await refreshUser();

      const badgesAwarded = res.data?.badgesAwarded || [];
      if (badgesAwarded.length > 0) {
        badgesAwarded.forEach((b) => toast.success(`New badge unlocked: ${b.title} ${b.icon}`, { duration: 4000 }));
      } else {
        toast.success('Trip marked as completed! Your Travel DNA & Analytics have been updated.');
      }
      return res.data;
    } catch (e) {
      toast.error(e.message || 'Failed to complete trip');
    }
  };

  const updateTripBanner = async (tripId, bannerImage) => {
    try {
      const res = await api.patch(`/trips/${tripId}/banner`, { bannerImage });
      setTrips((prev) => prev.map((t) => (t._id === tripId ? res.data : t)));
      if (activeTrip?._id === tripId) setActiveTrip(res.data);
      toast.success('Trip banner updated');
      return res.data;
    } catch (e) {
      toast.error(e.message || 'Failed to update banner');
    }
  };

  const updateTripDays = async (tripId, tripDays) => {
    try {
      const res = await api.patch(`/trips/${tripId}/days`, { tripDays });
      setTrips((prev) => prev.map((t) => (t._id === tripId ? res.data : t)));
      if (activeTrip?._id === tripId) setActiveTrip(res.data);
      toast.success('Itinerary updated');
      return res.data;
    } catch (e) {
      toast.error(e.message || 'Failed to update itinerary');
    }
  };

  const getTripById = async (tripId) => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      setActiveTrip(res.data);
      return res.data;
    } catch (e) {
      toast.error(e.message || 'Trip not found');
      return null;
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      fetchUnreadCount();
    } catch (e) {
      // Silent
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (e) {
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        tripsLoading,
        activeTrip,
        setActiveTrip,
        refreshTrips,
        deleteTrip,
        completeTrip,
        updateTripBanner,
        updateTripDays,
        getTripById,
        notifications,
        unreadCount,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        badges,
        fetchBadges,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);
