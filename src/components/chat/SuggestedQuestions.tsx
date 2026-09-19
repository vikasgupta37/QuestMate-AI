import React from 'react';
import { useGame } from '../../context/GameContext';
import { Sparkles, HelpCircle } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  const { context } = useGame();

  const questions = [
    `How do I defeat the ${context.boss}?`,
    `What's my next best move?`,
    `I keep dying to ${context.boss}, what am I doing wrong?`,
    `What should I upgrade next for ${context.character}?`,
    `Give me a hint without revealing the solution.`,
    `What's ${context.character}'s best build against ${context.boss}?`,
    `Why do you recommend ${context.character} for this fight?`,
    `What should I do next in ${context.quest}?`,
  ];

  return (
    <div className="my-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Suggested questions for current context:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/40 border border-purple-500/20 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-200 text-xs transition-all duration-200 text-left shadow-sm"
          >
            <HelpCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
