import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HintPanel } from '../components/hints/HintPanel';
import { Lightbulb } from 'lucide-react';
import { ContextCard } from '../components/context/ContextCard';

export const HintsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-purple-500/15">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          <span>Progressive Hint Chamber</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Get subtle hints without spoiling game solutions. Each tier reveals progressively deeper clues.
        </p>
      </div>

      <ContextCard />

      <HintPanel onInsertToChat={(text) => {
        navigate('/chat', { state: { initialQuery: text } });
      }} />
    </div>
  );
};
