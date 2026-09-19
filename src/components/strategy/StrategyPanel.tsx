import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { fetchStrategy } from '../../services/api';
import type { StrategyResponse } from '../../types';
import { Swords, ShieldAlert, Zap, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface StrategyPanelProps {
  onSendToChat?: (content: string) => void;
}

export const StrategyPanel: React.FC<StrategyPanelProps> = ({ onSendToChat }) => {
  const { context } = useGame();
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStrategy = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStrategy(context.boss, context);
      setStrategy(data);
    } catch (err) {
      console.error('Failed to load strategy:', err);
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    let isSubscribed = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchStrategy(context.boss, context);
        if (isSubscribed) setStrategy(data);
      } catch (err) {
        console.error('Failed to load strategy:', err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };
    load();
    return () => {
      isSubscribed = false;
    };
  }, [context]);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
        <p className="text-xs">Formulating battle tactics for {context.boss}...</p>
      </div>
    );
  }

  if (!strategy) return null;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-purple-500/20 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-purple-500/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              Tactical Strategy: {strategy.boss}
            </h3>
            <p className="text-xs text-slate-400">{strategy.location} (Rec. Level {strategy.recommendedLevel})</p>
          </div>
        </div>
        <button
          onClick={loadStrategy}
          title="Regenerate strategy"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <span className="text-slate-400 block mb-0.5 font-medium">Recommended Hero</span>
          <span className="font-bold text-cyan-300 text-sm">{strategy.recommendedCharacter}</span>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <span className="text-slate-400 block mb-0.5 font-medium">Boss Weakness</span>
          <span className="font-bold text-amber-300 text-sm">⚡ {strategy.weakness}</span>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
          <span className="text-slate-400 block mb-0.5 font-medium">Boss Resistance</span>
          <span className="font-bold text-rose-300 text-sm">🛡️ {strategy.resistance}</span>
        </div>
      </div>

      {/* Recommended Loadout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
          <span className="font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Recommended Abilities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {strategy.recommendedAbilities.map((ab, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                {ab}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
          <span className="font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Recommended Equipment
          </span>
          <div className="flex flex-wrap gap-1.5">
            {strategy.recommendedEquipment.map((eq, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200">
                {eq}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Combat Approach */}
      <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800 text-xs">
        <span className="font-semibold text-slate-300 block mb-1">General Approach:</span>
        <p className="text-slate-300 leading-relaxed">{strategy.approach}</p>
      </div>

      {/* Step by step action sequence */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 block">Sequence of Actions:</span>
        {strategy.steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-200">
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-cyan-500/30">
              {idx + 1}
            </div>
            <p className="pt-0.5">{step}</p>
          </div>
        ))}
      </div>

      {/* Important Warnings */}
      {strategy.warnings && strategy.warnings.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>⚠️ Watch out:</span>
          </div>
          {strategy.warnings.map((w, idx) => (
            <p key={idx} className="pl-5">• {w}</p>
          ))}
        </div>
      )}

      {onSendToChat && (
        <button
          onClick={() => onSendToChat(`### 👾 Boss Strategy: **${strategy.boss}**\n\n**Approach:** ${strategy.approach}\n\n**Steps:**\n${strategy.steps.map((s, i) => `${i+1}. ${s}`).join('\n')}`)}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Apply to Active Chat Context</span>
        </button>
      )}
    </div>
  );
};
