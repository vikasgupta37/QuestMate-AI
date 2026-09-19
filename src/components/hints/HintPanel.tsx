import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { fetchHint } from '../../services/api';
import type { HintResponse } from '../../types';
import { Lightbulb, Unlock, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface HintPanelProps {
  onInsertToChat?: (text: string) => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({ onInsertToChat }) => {
  const { context } = useGame();
  const [revealedLevel, setRevealedLevel] = useState<number>(0);
  const [hints, setHints] = useState<Record<number, HintResponse>>({});
  const [loading, setLoading] = useState(false);

  const requestHint = async (level: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const hintData = await fetchHint(context.boss, level, context);
      setHints(prev => ({ ...prev, [level]: hintData }));
      setRevealedLevel(Math.max(revealedLevel, level));
      if (onInsertToChat) {
        onInsertToChat(`### 💡 ${hintData.title}\n\n"${hintData.content}"`);
      }
    } catch (err) {
      console.error('Error fetching hint:', err);
    } finally {
      setLoading(false);
    }
  };

  const levels = [
    { level: 1, label: 'Hint 1: Subtle Clue', desc: 'A gentle nudge in the right direction' },
    { level: 2, label: 'Hint 2: Specific Clue', desc: 'Points out mechanics and timings' },
    { level: 3, label: 'Hint 3: Direct Clue', desc: 'Specific counters and vulnerability states' },
    { level: 4, label: 'Show Solution', desc: 'Full step-by-step boss counter strategy' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-purple-500/20 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-purple-500/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              Progressive Hint Mode
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-normal">
                {context.boss}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Reveal clues incrementally without spoiling the fun</p>
          </div>
        </div>
      </div>

      {/* Progressive Step Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {levels.map((item) => {
          const isUnlocked = revealedLevel >= item.level;
          const isNext = revealedLevel === item.level - 1;
          const isSolution = item.level === 4;

          return (
            <button
              key={item.level}
              disabled={loading || (!isUnlocked && !isNext)}
              onClick={() => requestHint(item.level)}
              className={`p-2.5 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between min-h-[76px] ${
                isUnlocked 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' 
                  : isNext
                    ? isSolution
                      ? 'bg-gradient-to-r from-rose-600/30 to-purple-600/30 border-rose-500/40 text-rose-200 hover:scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-750 border-cyan-500/40 text-cyan-300 hover:scale-[1.02]'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs flex items-center gap-1">
                  {isSolution ? <Unlock className="w-3.5 h-3.5" /> : <Lightbulb className="w-3.5 h-3.5" />}
                  {isSolution ? 'Solution' : `Hint ${item.level}`}
                </span>
                {isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isNext ? (
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Display Revealed Hints */}
      <div className="space-y-2.5">
        {revealedLevel === 0 && (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center text-xs text-slate-400">
            Click <strong className="text-amber-300">Hint 1</strong> above to reveal your first subtle clue for defeating <strong className="text-white">{context.boss}</strong>.
          </div>
        )}

        {[1, 2, 3, 4].map((lvl) => {
          if (revealedLevel < lvl || !hints[lvl]) return null;
          const hint = hints[lvl];
          const isSolution = lvl === 4;

          return (
            <div 
              key={lvl} 
              className={`p-3.5 rounded-xl border animate-fadeIn ${
                isSolution 
                  ? 'bg-purple-950/30 border-purple-500/40 text-slate-200' 
                  : 'bg-slate-900/70 border-amber-500/30 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  {isSolution ? <Unlock className="w-3.5 h-3.5 text-rose-400" /> : <Lightbulb className="w-3.5 h-3.5 text-amber-400" />}
                  {hint.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Stage {lvl}/4</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {hint.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
