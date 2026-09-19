import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#090b14] text-slate-100 relative selection:bg-purple-500/30 selection:text-cyan-300">
      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
};
