import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-[#2A2A2A] flex flex-col font-sans relative overflow-hidden">
      {/* Ambient background glow orbs for depth */}
      <div className="ambient-orb w-[500px] h-[500px] bg-[#355E4B]/[0.02] top-[-150px] left-[20%] hidden md:block" />
      <div className="ambient-orb w-[400px] h-[400px] bg-[#D4AF37]/[0.02] bottom-[10%] right-[5%] hidden md:block" />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      
      <div className="flex flex-col flex-1 w-full relative">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="md:ml-72 flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
