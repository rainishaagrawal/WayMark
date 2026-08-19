import React from 'react';
import { ShieldAlert, Users, Server, Cpu, Database, Activity, Key } from 'lucide-react';

export default function Admin() {
  const usersList = [
    { name: 'Alex Vance', email: 'alex.vance@voyageai.io', role: 'User', status: 'Active' },
    { name: 'Admin Account', email: 'admin@voyageai.io', role: 'Admin', status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 glass-card">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#F87171] uppercase bg-[#F87171]/20 px-2.5 py-0.5 rounded-full border border-[#F87171]/30">
            SYSTEM ADMIN CONSOLE
          </span>
        </div>
        <h1 className="text-xl font-bold text-[#2A2A2A] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#F87171]" /> VoyageAI Platform Management
        </h1>
        <p className="text-xs text-[#8B8B8B] mt-0.5">Monitor API latency, database health, active user tokens & AI token usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8B8B8B] uppercase font-semibold">Backend Status</span>
            <Server className="w-4 h-4 text-[#355E4B]" />
          </div>
          <p className="text-lg font-bold text-[#355E4B] mt-1">HEALTHY (99.9%)</p>
        </div>

        <div className="p-4 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8B8B8B] uppercase font-semibold">Database</span>
            <Database className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-lg font-bold text-[#2A2A2A] mt-1">CONNECTED</p>
        </div>

        <div className="p-4 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8B8B8B] uppercase font-semibold">AI Tokens Used</span>
            <Cpu className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-lg font-bold text-[#2A2A2A] mt-1">1.42M Tokens</p>
        </div>

        <div className="p-4 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#8B8B8B] uppercase font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-lg font-bold text-[#2A2A2A] mt-1">1,280 Users</p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider">User Directory & Roles</h3>

        <div className="space-y-3">
          {usersList.map((u, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-xl glass-inset">
              <div>
                <h4 className="text-xs font-bold text-[#2A2A2A]">{u.name}</h4>
                <p className="text-[10px] text-[#8B8B8B]">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-md">
                  {u.role}
                </span>
                <span className="text-xs text-[#355E4B] font-semibold">{u.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
