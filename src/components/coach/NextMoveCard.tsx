import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { fetchNextMove } from '../../services/api';
import type { NextMoveResponse } from '../../types';
import { Zap, Navigation, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

interface NextMoveCardProps {
  onInsertToChat?: (text: string) => void;
}

export const NextMoveCard: React.FC<NextMoveCardProps> = ({ onInsertToChat }) => {
  const { context } = useGame();
  const [move, setMove] = useState<NextMoveResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMove = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchNextMove(context);
      setMove(result);
    } catch (err) {
      console.error('Failed to fetch next move:', err);
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    let isSubscribed = true;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchNextMove(context);
        if (isSubscribed) setMove(result);
      } catch (err) {
        console.error('Failed to fetch next move:', err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };
    load();
    return () => {
      isSubscribed = false;
    };
  }, [context]);

  const urgencyConfig = {
    HIGH: { color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/40', badge: 'bg-red-500/20 text-red-300', icon: '🔴' },
    MEDIUM: { color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300', icon: '🟡' },
    READY: { color: 'from-emerald-500/20 to-cyan-500/20', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300', icon: '🟢' },
  };

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-purple-500/20 flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
        <span className="text-slate-400 text-sm">Computing optimal next move...</span>
      </div>
    );
  }

  if (!move) return null;

  const cfg = urgencyConfig[move.urgency];

  const handleInsert = () => {
    const text = `### ⚡ Next Best Move — Priority: **${move.urgency}**\n\n**Action:** ${move.action}\n\n**Why:** ${move.reasoning}\n\n**Steps:**\n${move.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n**Positioning:** ${move.positioning}`;
    onInsertToChat?.(text);
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${cfg.color} border ${cfg.border} space-y-4 animate-fadeIn`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Next Best Move</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${cfg.badge}`}>
            {cfg.icon} {move.urgency}
          </span>
        </div>
        <button
          onClick={fetchMove}
          aria-label="Refresh next best move recommendation"
          className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* Action */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <p className="text-sm font-semibold text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          {move.action}
        </p>
      </div>

      {/* Reasoning */}
      <div>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-1">Why This Move</p>
        <p className="text-xs text-slate-300 leading-relaxed">{move.reasoning}</p>
      </div>

      {/* Steps */}
      <div>
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-2">Action Steps</p>
        <div className="space-y-1.5">
          {move.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Positioning */}
      <div className="bg-black/15 rounded-lg p-3 border border-white/5 flex items-start gap-2">
        <span className="text-sm">📍</span>
        <p className="text-xs text-slate-400">{move.positioning}</p>
      </div>

      {/* CTA */}
      {onInsertToChat && (
        <button
          onClick={handleInsert}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Send to Chat <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
