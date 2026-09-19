import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Crosshair, MapPin, CheckCircle2, Sparkles, Lightbulb } from 'lucide-react';

export const Quests: React.FC = () => {
  const { gameData, context, setQuest } = useGame();
  const navigate = useNavigate();
  const [selectedQuestId, setSelectedQuestId] = useState<string>(
    gameData.quests.find(q => q.name.toLowerCase() === context.quest.toLowerCase())?.id || gameData.quests[0].id
  );

  const selectedQuest = gameData.quests.find(q => q.id === selectedQuestId) || gameData.quests[0];

  const handleSelectActive = (questName: string) => {
    setQuest(questName);
  };

  const handleAskAI = (questName: string) => {
    setQuest(questName);
    navigate('/chat', { state: { initialQuery: `What should I do next in ${questName}?` } });
  };

  const handleGetHints = (questName: string) => {
    setQuest(questName);
    navigate('/hints');
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-purple-500/15">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Crosshair className="w-6 h-6 text-cyan-400" />
          <span>Quest Codex</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Track campaign progression, objectives, and tactical navigation for <span className="text-cyan-300 font-semibold">{gameData.game}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quest List (Left) */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Available Quests ({gameData.quests.length})
          </span>
          {gameData.quests.map((q) => {
            const isSelected = q.id === selectedQuest.id;
            const isActiveContext = q.name.toLowerCase() === context.quest.toLowerCase();

            return (
              <div
                key={q.id}
                onClick={() => setSelectedQuestId(q.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-600/25 border-cyan-400 shadow-md shadow-purple-500/10'
                    : 'glass-panel hover:bg-slate-800/60 border-purple-500/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400">{q.chapter}</span>
                  {isActiveContext && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white mt-1">{q.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <span className="text-amber-300">Lvl {q.recommendedLevel}+</span>
                  <span>•</span>
                  <span className="truncate">{q.location}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quest Details (Right) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 sm:p-7 border border-purple-500/25 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400">{selectedQuest.chapter}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{selectedQuest.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{selectedQuest.location}</span>
                <span>•</span>
                <span className="text-amber-300 font-medium">Recommended Level: {selectedQuest.recommendedLevel}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectActive(selectedQuest.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  context.quest.toLowerCase() === selectedQuest.name.toLowerCase()
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                }`}
              >
                {context.quest.toLowerCase() === selectedQuest.name.toLowerCase() ? '✓ Tracking' : 'Set as Active'}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Overview</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              {selectedQuest.description}
            </p>
          </div>

          {/* Key Objectives */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Objectives</h4>
            <div className="space-y-1.5">
              {selectedQuest.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Tactical Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Detailed Steps</h4>
            <div className="space-y-2">
              {selectedQuest.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-purple-950/15 border border-purple-500/20 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                  <p className="pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleAskAI(selectedQuest.name)}
              className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI About This Quest</span>
            </button>

            <button
              onClick={() => handleGetHints(selectedQuest.name)}
              className="py-2.5 px-4 rounded-xl glass-panel hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Progressive Hints</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
