import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildPanel } from '../components/build/BuildPanel';
import { Swords } from 'lucide-react';

export const BuildCreator: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-purple-500/15">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Swords className="w-6 h-6 text-purple-400" />
          <span>Character Build Forge</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Synthesize optimal ability synergies, stat allocations, and gear sets for any combat style.
        </p>
      </div>

      <BuildPanel onInsertToChat={(text) => {
        navigate('/chat', { state: { initialQuery: text } });
      }} />
    </div>
  );
};
