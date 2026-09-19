import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ContextCard } from '../components/context/ContextCard';
import { 
  Crosshair, 
  Skull, 
  Shield, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Lightbulb, 
  Swords, 
  MessageSquareCode,
  Flame
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { context, activeCharacter, activeBoss, activeQuest } = useGame();

  const handleAsk = (query: string) => {
    navigate('/chat', { state: { initialQuery: query } });
  };

  const sampleQuestions = [
    `How do I defeat the ${context.boss}?`,
    `What should I upgrade next for ${context.character}?`,
    `Give me a hint.`,
    `What's ${context.character}'s best build?`,
    `What should I do next in ${context.quest}?`
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/25 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Gaming Companion Ready</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Level Up?
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Ask QuestMate for strategies, hints, builds, and quest guidance tailored to your active game state.
          </p>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-tl from-cyan-500/20 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Editable Context Overview Card */}
      <ContextCard />

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Active Quest */}
        <div 
          onClick={() => navigate('/quests')}
          className="glass-panel p-4 rounded-2xl border border-cyan-500/20 glass-panel-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Quest</span>
            <Crosshair className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="font-bold text-base text-white truncate">{activeQuest.name}</h3>
          <p className="text-[11px] text-cyan-300/80 mt-0.5">{activeQuest.chapter}</p>
        </div>

        {/* Card 2: Current Boss */}
        <div 
          onClick={() => navigate('/bosses')}
          className="glass-panel p-4 rounded-2xl border border-rose-500/20 glass-panel-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Boss</span>
            <Skull className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="font-bold text-base text-white truncate">{activeBoss.name}</h3>
          <p className="text-[11px] text-amber-300/90 mt-0.5">Weakness: {activeBoss.weakness}</p>
        </div>

        {/* Card 3: Character */}
        <div 
          onClick={() => navigate('/builds')}
          className="glass-panel p-4 rounded-2xl border border-purple-500/20 glass-panel-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Character</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="font-bold text-base text-white truncate">{activeCharacter.name}</h3>
          <p className="text-[11px] text-purple-300 mt-0.5">{activeCharacter.class} ({activeCharacter.element})</p>
        </div>

        {/* Card 4: Player Level & Diff */}
        <div 
          onClick={() => handleAsk(`What should I prioritize at level ${context.level}?`)}
          className="glass-panel p-4 rounded-2xl border border-amber-500/20 glass-panel-hover cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Player Level</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-bold text-base text-white">Level {context.level}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{context.difficulty} Mode</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Actions</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleAsk(`What should I do next in ${context.quest}?`)}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400/60 text-left text-slate-200 hover:text-white transition-all group"
          >
            <Crosshair className="w-4 h-4 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs sm:text-sm">Find Next Quest</div>
            <div className="text-[10px] text-slate-400">Get step navigation</div>
          </button>

          <button
            onClick={() => handleAsk(`How do I defeat ${context.boss}?`)}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-rose-500/20 hover:border-rose-400/60 text-left text-slate-200 hover:text-white transition-all group"
          >
            <Skull className="w-4 h-4 text-rose-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs sm:text-sm">Boss Strategy</div>
            <div className="text-[10px] text-slate-400">Attack patterns & counters</div>
          </button>

          <button
            onClick={() => navigate('/builds')}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-purple-950/40 border border-purple-500/20 hover:border-purple-400/60 text-left text-slate-200 hover:text-white transition-all group"
          >
            <Swords className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs sm:text-sm">Create Build</div>
            <div className="text-[10px] text-slate-400">Gear & stat optimization</div>
          </button>

          <button
            onClick={() => navigate('/hints')}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-amber-950/40 border border-amber-500/20 hover:border-amber-400/60 text-left text-slate-200 hover:text-white transition-all group"
          >
            <Lightbulb className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs sm:text-sm">Get Hint</div>
            <div className="text-[10px] text-slate-400">Progressive subtle clues</div>
          </button>
        </div>
      </div>

      {/* "Try asking" Section */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Try asking QuestMate</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left text-xs sm:text-sm text-slate-300 hover:text-white transition-all group"
            >
              <span className="truncate pr-2">"{q}"</span>
              <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
