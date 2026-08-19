import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = (userData, accessToken) => {
    if (accessToken) localStorage.setItem('voyage_access_token', accessToken);
    if (userData) localStorage.setItem('voyage_user', JSON.stringify(userData));
  };

  const clearSession = () => {
    localStorage.removeItem('voyage_access_token');
    localStorage.removeItem('voyage_user');
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('voyage_access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/users/profile');
      setUser(res.data);
      persistSession(res.data);
    } catch (error) {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Re-fetches the current user's profile. Call this after any action that
   * changes user state on the backend (creating a first trip, updating DNA,
   * etc.) so the new-user vs returning-user experience updates automatically
   * without a page reload.
   */
  const refreshUser = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser(res.data);
      persistSession(res.data);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  const login = async (email, password) => {
    // Always clear stale session before a new login attempt
    clearSession();
    setUser(null);
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, accessToken } = res.data;
    persistSession(userData, accessToken);
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
    return userData;
  };

  /**
   * Registers a new user with onboarding info (travel bio, interests,
   * preferences) collected up-front, then optionally uploads their chosen
   * avatar photo. New users always start with hasCreatedFirstTrip = false,
   * which drives the automatic onboarding dashboard view.
   */
  const register = async (payload) => {
    const { avatarFile, ...body } = payload;

    const res = await api.post('/auth/register', body);
    const { user: userData, accessToken } = res.data;
    persistSession(userData, accessToken);
    setUser(userData);

    if (avatarFile) {
      try {
        const formData = new FormData();
        formData.append('image', avatarFile);
        const avatarRes = await api.post('/users/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setUser(avatarRes.data);
        persistSession(avatarRes.data);
      } catch (e) {
        console.warn('Avatar upload failed, continuing without it:', e.message);
      }
    }

    toast.success(`Welcome to WayMark, ${userData.name}!`);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network error on logout - clear local session regardless
    } finally {
      clearSession();
      setUser(null);
      toast.success('Logged out');
    }
  };

  // A user is "new" until they've created their first trip - this replaces
  // the old manual View-toggle. The dashboard automatically switches to the
  // returning-user experience the moment hasCreatedFirstTrip flips true.
  const isNewUser = !!user && !user.hasCreatedFirstTrip;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isNewUser,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
