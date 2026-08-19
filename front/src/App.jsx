import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Module 1: Auth & Profile
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Module 2: Dashboard & Layout
import Dashboard from './pages/Dashboard';

// Module 3: Explore & Discovery
import Explore from './pages/Explore';
import Weather from './pages/Weather';
import Wishlist from './pages/Wishlist';
import Festivals from './pages/Festivals';
import CurrencyConverter from './pages/CurrencyConverter';

// Module 4: AI Planner & Chat
import AIPlanner from './pages/AIPlanner';
import SmartSearch from './pages/SmartSearch';
import LandmarkRecognition from './pages/LandmarkRecognition';

// Module 5: Trip Management & Execution
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import GroupTrips from './pages/GroupTrips';
import Expenses from './pages/Expenses';
import PackingChecklist from './pages/PackingChecklist';
import Journal from './pages/Journal';

// Module 6: Memories & Travel DNA
import Memories from './pages/Memories';
import TravelDNA from './pages/TravelDNA';

// Module 7: System & Admin
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import Admin from './pages/Admin';

export default function App() {
  return (
    <CurrencyProvider>
    <AuthProvider>
      <TripProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(11, 18, 32, 0.9)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              fontSize: '12px',
              backdropFilter: 'blur(16px)',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#0B1220',
              },
            },
            error: {
              iconTheme: {
                primary: '#F87171',
                secondary: '#0B1220',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Explore */}
              <Route path="/explore" element={<Explore />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/festivals" element={<Festivals />} />
              <Route path="/currency" element={<CurrencyConverter />} />

              {/* AI Planner */}
              <Route path="/planner" element={<AIPlanner />} />
              <Route path="/smart-search" element={<SmartSearch />} />
              <Route path="/landmark" element={<LandmarkRecognition />} />

              {/* Trip Execution */}
              <Route path="/trips" element={<Trips />} />
              <Route path="/trip-details/:id" element={<TripDetails />} />
              <Route path="/group-trips" element={<GroupTrips />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/packing" element={<PackingChecklist />} />
              <Route path="/journal" element={<Journal />} />

              {/* Memories & DNA */}
              <Route path="/memories" element={<Memories />} />
              <Route path="/travel-dna" element={<TravelDNA />} />

              {/* System */}
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </TripProvider>
    </AuthProvider>
    </CurrencyProvider>
  );
}
