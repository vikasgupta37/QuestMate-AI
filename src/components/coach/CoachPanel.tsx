import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { fetchCoachDiagnosis } from '../../services/api';
import type { CoachResponse } from '../../types';
import { Brain, AlertTriangle, Target, Wrench, Lightbulb, Loader2, Send, ChevronRight } from 'lucide-react';

interface CoachPanelProps {
  onInsertToChat?: (text: string) => void;
}

const QUICK_PROBLEMS = [
  { label: 'I keep dying to the boss', icon: '💀' },
  { label: 'I can\'t deal damage', icon: '⚔️' },
  { label: 'I run out of mana', icon: '🔵' },
  { label: 'I get frozen/stunned', icon: '❄️' },
  { label: 'The boss shield blocks everything', icon: '🛡️' },
  { label: 'I can\'t find the real boss among clones', icon: '👥' },
];

export const CoachPanel: React.FC<CoachPanelProps> = ({ onInsertToChat }) => {
  const { context } = useGame();
  const [problem, setProblem] = useState('');
  const [diagnosis, setDiagnosis] = useState<CoachResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (problemText: string) => {
    if (!problemText.trim()) return;
    setLoading(true);
    setProblem(problemText);
    try {
      const result = await fetchCoachDiagnosis(problemText, context);
      setDiagnosis(result);
    } catch (err) {
      console.error('Coach diagnosis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (!diagnosis) return;
    const text = `### 🧠 AI Coach Diagnosis — ${diagnosis.boss}\n\n**Problem:** ${diagnosis.diagnosis}\n\n**Root Cause:** ${diagnosis.rootCause}\n\n**Coach Drill:**\n${diagnosis.coachDrill.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\n**Mechanic:** ${diagnosis.mechanicExplanation}\n\n**Tip:** ${diagnosis.adaptedTip}`;
    onInsertToChat?.(text);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-purple-500/15">
        <Brain className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-bold text-white">AI Coach</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
          Mistake Analyzer
        </span>
      </div>

      {/* Problem Input */}
      {!diagnosis && (
        <>
          <p className="text-xs text-slate-400">Describe what you're struggling with, and the AI Coach will diagnose the issue and give you a targeted drill.</p>

          {/* Quick Problem Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {QUICK_PROBLEMS.map((qp) => (
              <button
                key={qp.label}
                onClick={() => handleDiagnose(qp.label)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/70 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-left"
              >
                <span className="text-base">{qp.icon}</span>
                <span>{qp.label}</span>
              </button>
            ))}
          </div>

          {/* Custom input */}
          <form onSubmit={(e) => { e.preventDefault(); handleDiagnose(problem); }} className="flex gap-2">
            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Or describe your problem here..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 text-white placeholder-slate-500 text-xs transition-all focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !problem.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Diagnose
            </button>
          </form>
        </>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 p-8 rounded-2xl bg-slate-900/50 border border-emerald-500/20">
          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-sm text-slate-400">Analyzing your gameplay pattern...</span>
        </div>
      )}

      {/* Diagnosis Result */}
      {diagnosis && !loading && (
        <div className="space-y-4">
          {/* Problem Detected */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs font-bold text-red-300 uppercase tracking-wider">Problem Detected</p>
            </div>
            <p className="text-sm text-white font-medium">{diagnosis.diagnosis}</p>
          </div>

          {/* Root Cause */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Root Cause</p>
            </div>
            <p className="text-sm text-slate-300">{diagnosis.rootCause}</p>
          </div>

          {/* Coach Drill */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">3-Step Coach Drill</p>
            </div>
            <div className="space-y-2">
              {diagnosis.coachDrill.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mechanic Explanation */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-purple-500/20 flex items-start gap-2">
            <span className="text-sm">⚙️</span>
            <p className="text-xs text-slate-400 leading-relaxed">{diagnosis.mechanicExplanation}</p>
          </div>

          {/* Personalized Tip */}
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-300 leading-relaxed">{diagnosis.adaptedTip}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => { setDiagnosis(null); setProblem(''); }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Analyze Another Problem
            </button>
            {onInsertToChat && (
              <button
                onClick={handleInsert}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Send to Chat <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
