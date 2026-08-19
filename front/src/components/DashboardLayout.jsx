import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-transparent text-[#2A2A2A] flex flex-col font-sans relative overflow-hidden">
      {/* Ambient background glow orbs for depth */}
      <div className="ambient-orb w-[500px] h-[500px] bg-[#355E4B]/[0.02] top-[-150px] left-[20%]" />
      <div className="ambient-orb w-[400px] h-[400px] bg-[#D4AF37]/[0.02] bottom-[10%] right-[5%]" />

      <Sidebar />
      <Navbar />
      <main className="ml-64 flex-1 p-6 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
