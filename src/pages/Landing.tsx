import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Sparkles, Crosshair, Skull, Swords, Lightbulb, ArrowRight, Play } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setDemoMode } = useGame();

  const handleStartPlaying = () => {
    navigate('/chat');
  };

  const handleTryDemo = () => {
    setDemoMode(true);
    navigate('/chat');
  };

  return (
    <div className="relative min-h-full py-10 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Hero Section */}
      <div className="text-center space-y-5 my-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Next-Gen AI Gaming Agent</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
          QUESTMATE <span className="text-gradient">AI</span>
        </h1>

        <p className="text-lg sm:text-2xl font-semibold text-slate-300">
          Your Intelligent Gaming Companion
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto italic">
          "Don't just play. <span className="text-cyan-400 font-semibold not-italic">Play smarter.</span>"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={handleStartPlaying}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-600/30 hover:scale-105 transition-all flex items-center gap-2.5"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Playing</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleTryDemo}
            className="px-6 py-3.5 rounded-2xl glass-panel hover:bg-slate-800/80 border border-cyan-500/30 text-cyan-300 font-bold text-sm sm:text-base hover:scale-105 transition-all flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Try Demo Mode</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="my-12">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          AI-Powered Capabilities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Quest Guidance */}
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Crosshair className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">🎯 Quest Guidance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step-by-step puzzle solutions and directional hints mapped to your current quest status.
            </p>
          </div>

          {/* Card 2: Boss Strategies */}
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
              <Skull className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">👾 Boss Strategies</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vulnerability windows, telegraph dodges, and elemental weakness breakdowns for every boss.
            </p>
          </div>

          {/* Card 3: Character Builds */}
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">⚔️ Character Builds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tailored talent setups, stat prioritizations, and equipment synergies for your preferred play style.
            </p>
          </div>

          {/* Card 4: Progressive Hints */}
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">💡 Progressive Hints</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              3-tier hint revelation (subtle → specific → direct → solution) so nothing gets spoiled prematurely.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Game Highlight */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-purple-950/20 via-slate-900/60 to-cyan-950/20 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Featured Demo RPG</span>
              <h4 className="text-xl font-bold text-white">Realm of Legends</h4>
              <p className="text-xs text-slate-400">4 Champions • 3 Epic Bosses • 4 Quests • Deep Lore & Mechanics</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5"
          >
            <span>Enter Companion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
