import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { StrategyPanel } from '../components/strategy/StrategyPanel';
import { HintPanel } from '../components/hints/HintPanel';
import { Skull, Sparkles, Swords, Lightbulb } from 'lucide-react';

export const BossGuide: React.FC = () => {
  const { gameData, context, setBoss } = useGame();
  const navigate = useNavigate();
  const [selectedBossId, setSelectedBossId] = useState<string>(
    gameData.bosses.find(b => b.name.toLowerCase() === context.boss.toLowerCase())?.id || gameData.bosses[0].id
  );
  const [viewMode, setViewMode] = useState<'strategy' | 'hints'>('strategy');

  const selectedBoss = gameData.bosses.find(b => b.id === selectedBossId) || gameData.bosses[0];

  const handleSelectActive = (bossName: string) => {
    setBoss(bossName);
  };

  const handleLaunchChat = (bossName: string) => {
    setBoss(bossName);
    navigate('/chat', { state: { initialQuery: `How do I defeat ${bossName}?` } });
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-purple-500/15">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Skull className="w-6 h-6 text-rose-400" />
          <span>Boss Dossier & Tactics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          In-depth threat profiles, attack telegraphs, and victory strategies for <span className="text-cyan-300 font-semibold">{gameData.game}</span>.
        </p>
      </div>

      {/* Boss Selection Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {gameData.bosses.map((b) => {
          const isSelected = b.id === selectedBoss.id;
          const isActive = b.name.toLowerCase() === context.boss.toLowerCase();

          return (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBossId(b.id);
                setBoss(b.name);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-rose-950/30 border-rose-500/80 shadow-lg shadow-rose-950/20'
                  : 'glass-panel hover:bg-slate-850 border-purple-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-rose-300">Rec. Level {b.recommendedLevel}</span>
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    Target
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1">{b.name}</h3>
              <p className="text-xs text-slate-400 truncate">{b.location}</p>
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-amber-300">⚡ {b.weakness}</span>
                <span className="text-slate-400">{b.phases} Phases</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Boss Detail Section */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-purple-500/25 space-y-6">
        {/* Boss Overview Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase text-rose-400 tracking-wider">
              Threat Tier: Boss #{gameData.bosses.findIndex(b => b.id === selectedBoss.id) + 1}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">{selectedBoss.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{selectedBoss.location}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectActive(selectedBoss.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                context.boss.toLowerCase() === selectedBoss.name.toLowerCase()
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
              }`}
            >
              {context.boss.toLowerCase() === selectedBoss.name.toLowerCase() ? '✓ Targeted' : 'Target This Boss'}
            </button>
            <button
              onClick={() => handleLaunchChat(selectedBoss.name)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discuss in AI Chat</span>
            </button>
          </div>
        </div>

        {/* Attack Patterns */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Known Attacks</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedBoss.attacks.map((att, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="font-bold text-xs text-rose-300 mb-0.5">💥 {att.name}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{att.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Sub-views Toggle */}
        <div className="flex border-b border-slate-800 pb-2 gap-2">
          <button
            onClick={() => setViewMode('strategy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'strategy' 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Complete Strategy Breakdown</span>
          </button>
          <button
            onClick={() => setViewMode('hints')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'hints' 
                ? 'bg-amber-600 text-white' 
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Progressive Hints Mode</span>
          </button>
        </div>

        {/* Sub-view Content */}
        {viewMode === 'strategy' ? (
          <StrategyPanel onSendToChat={(text) => navigate('/chat', { state: { initialQuery: text } })} />
        ) : (
          <HintPanel onInsertToChat={(text) => navigate('/chat', { state: { initialQuery: text } })} />
        )}
      </div>
    </div>
  );
};
