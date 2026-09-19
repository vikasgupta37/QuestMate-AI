import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { fetchBuild } from '../../services/api';
import type { PlayStyle, BuildResponse } from '../../types';
import { Swords, Flame, Shield, Scale, Zap, Sparkles, Send, RefreshCw } from 'lucide-react';

interface BuildPanelProps {
  onInsertToChat?: (text: string) => void;
}

export const BuildPanel: React.FC<BuildPanelProps> = ({ onInsertToChat }) => {
  const { context, gameData, setCharacter, setLevel } = useGame();
  const [playStyle, setPlayStyle] = useState<PlayStyle>('Aggressive');
  const [build, setBuild] = useState<BuildResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const styles: { id: PlayStyle; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'Aggressive', label: 'Aggressive', icon: Flame },
    { id: 'Defensive', label: 'Defensive', icon: Shield },
    { id: 'Balanced', label: 'Balanced', icon: Scale },
    { id: 'Speed', label: 'Speed', icon: Zap },
  ];



  useEffect(() => {
    let isSubscribed = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBuild(context.character, playStyle, context.level);
        if (isSubscribed) setBuild(data);
      } catch (err) {
        console.error('Build error:', err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };
    load();
    return () => {
      isSubscribed = false;
    };
  }, [context.character, playStyle, context.level]);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-purple-500/20 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-purple-500/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">Character Build Creator</h3>
            <p className="text-xs text-slate-400">Tailored ability loadouts and stat optimization</p>
          </div>
        </div>
        {loading && <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />}
      </div>

      {/* Selectors: Character, Level, Play Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Character Selector */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">Select Character:</label>
          <div className="grid grid-cols-2 gap-1.5">
            {gameData.characters.map((c) => (
              <button
                key={c.id}
                onClick={() => setCharacter(c.name)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  context.character.toLowerCase() === c.name.toLowerCase()
                    ? 'bg-purple-600/30 border-purple-500/60 text-white font-semibold shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold">{c.name}</div>
                <div className="text-[10px] text-slate-400">{c.class}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Level & Play Style */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Target Level:</span>
              <span className="font-bold text-cyan-400">{context.level}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={context.level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Play Style:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {styles.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setPlayStyle(s.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs border transition-all ${
                      playStyle === s.id
                        ? 'bg-cyan-600/30 border-cyan-500/60 text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Build View */}
      {build && (
        <div className="bg-slate-900/70 rounded-xl p-4 border border-purple-500/25 space-y-3 mt-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">
                {build.character} • {build.playStyle} Build
              </span>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                {build.buildName}
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-xs">
              Lvl {build.level}
            </span>
          </div>

          {/* Stat Priorities */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1">Stat Priorities:</span>
            <div className="flex flex-wrap gap-1.5">
              {build.statPriorities.map((p, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-amber-300">
                  {idx + 1}. {p}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Abilities */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1">Recommended Abilities:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
              {build.recommendedAbilities.map((ab, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-800/80 border border-purple-500/20 text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="font-medium truncate">{ab}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Equipment */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-1">Recommended Equipment:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {build.recommendedEquipment.map((eq, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/80 text-slate-300 flex items-center gap-1.5">
                  <span className="text-cyan-400">🛡️</span>
                  <span className="truncate">{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Combat Strategy */}
          <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300">
            <span className="font-bold text-white block mb-0.5">Combat Strategy:</span>
            <p className="leading-relaxed">{build.combatStrategy}</p>
          </div>

          {onInsertToChat && (
            <button
              onClick={() => onInsertToChat(`### 🛡️ Recommended Build: **${build.buildName}**\n**Character:** ${build.character} | **Play Style:** ${build.playStyle}\n\n**Abilities:** ${build.recommendedAbilities.join(', ')}\n\n**Strategy:** ${build.combatStrategy}`)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Build to Chat</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
