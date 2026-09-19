import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Shield, Sparkles, Crosshair, Skull, ChevronDown, RotateCcw } from 'lucide-react';
import type { Difficulty } from '../../types';

export const ContextCard: React.FC = () => {
  const { 
    context, 
    gameData, 
    setCharacter, 
    setQuest, 
    setBoss, 
    setLevel, 
    setDifficulty,
    resetContext 
  } = useGame();

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-4 border border-purple-500/20 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Gaming Context</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetContext}
            title="Reset Context to Default"
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>{expanded ? 'Simple View' : 'Edit Context'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Context Values */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Game & Character */}
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Character</span>
          </div>
          {expanded ? (
            <select
              value={context.character}
              onChange={(e) => setCharacter(e.target.value)}
              className="w-full bg-slate-800 text-white rounded p-1 text-xs border border-purple-500/30 focus:outline-none focus:border-cyan-400"
            >
              {gameData.characters.map((c) => (
                <option key={c.id} value={c.name}>{c.name} ({c.class})</option>
              ))}
            </select>
          ) : (
            <p className="font-semibold text-white truncate">{context.character}</p>
          )}
        </div>

        {/* Level & Difficulty */}
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Level & Diff</span>
          </div>
          {expanded ? (
            <div className="flex gap-1">
              <input
                type="number"
                min="1"
                max="50"
                value={context.level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-12 bg-slate-800 text-white rounded p-1 text-xs border border-purple-500/30"
              />
              <select
                value={context.difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="flex-1 bg-slate-800 text-white rounded p-1 text-xs border border-purple-500/30"
              >
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
                <option value="Nightmare">Nightmare</option>
              </select>
            </div>
          ) : (
            <p className="font-semibold text-amber-300">Lvl {context.level} <span className="text-slate-400">({context.difficulty})</span></p>
          )}
        </div>

        {/* Active Quest */}
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quest</span>
          </div>
          {expanded ? (
            <select
              value={context.quest}
              onChange={(e) => setQuest(e.target.value)}
              className="w-full bg-slate-800 text-white rounded p-1 text-xs border border-purple-500/30"
            >
              {gameData.quests.map((q) => (
                <option key={q.id} value={q.name}>{q.name}</option>
              ))}
            </select>
          ) : (
            <p className="font-semibold text-cyan-300 truncate" title={context.quest}>{context.quest}</p>
          )}
        </div>

        {/* Current Boss */}
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Skull className="w-3.5 h-3.5 text-rose-400" />
            <span>Target Boss</span>
          </div>
          {expanded ? (
            <select
              value={context.boss}
              onChange={(e) => setBoss(e.target.value)}
              className="w-full bg-slate-800 text-white rounded p-1 text-xs border border-purple-500/30"
            >
              {gameData.bosses.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          ) : (
            <p className="font-semibold text-rose-300 truncate" title={context.boss}>{context.boss}</p>
          )}
        </div>
      </div>
    </div>
  );
};
