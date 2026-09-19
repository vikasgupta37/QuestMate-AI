import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Gamepad2, 
  Sparkles, 
  LayoutDashboard, 
  MessageSquareCode, 
  Crosshair, 
  Skull, 
  Swords, 
  Lightbulb, 
  Settings, 
  Menu, 
  X,
  Zap
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Companion', path: '/chat', icon: MessageSquareCode },
  { name: 'Quests', path: '/quests', icon: Crosshair },
  { name: 'Boss Guide', path: '/bosses', icon: Skull },
  { name: 'Build Creator', path: '/builds', icon: Swords },
  { name: 'Hint Mode', path: '/hints', icon: Lightbulb },
];

export const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDemoMode } = useGame();

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a0c16]/95 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 shadow-lg shadow-purple-500/25">
            <Gamepad2 className="w-5 h-5 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
          </div>
          <div>
            <span className="font-bold tracking-wide text-white text-base">QuestMate <span className="text-cyan-400">AI</span></span>
          </div>
        </div>
        <button 
          onClick={toggleMobile} 
          className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-[#0d1020]/95 lg:bg-[#0d1020]/80 backdrop-blur-xl
        border-r border-purple-500/20 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand / Logo */}
          <div className="p-5 border-b border-purple-500/15">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30">
                <Gamepad2 className="w-6 h-6 text-white" />
                <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-wider text-white">
                  QuestMate <span className="text-cyan-400">AI</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-400">Gaming Companion</p>
              </div>
            </div>

            {/* Demo Mode Badge */}
            {isDemoMode && (
              <div className="mt-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Demo Mode Active</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-white border border-purple-500/40 shadow-sm shadow-purple-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }
                  `}
                >
                  <Icon className="w-4.5 h-4.5 text-cyan-400" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Settings Link */}
        <div className="p-3 border-t border-purple-500/15">
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
              ${isActive 
                ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-white border border-purple-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }
            `}
          >
            <Settings className="w-4.5 h-4.5 text-slate-400" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
