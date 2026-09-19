import React from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  thinkingText?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ thinkingText }) => {
  return (
    <div className="flex gap-3 my-3 items-center">
      {/* AI Avatar with pulse */}
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20 animate-pulse">
        <Gamepad2 className="w-4 h-4 text-white" />
      </div>

      {/* Bubble */}
      <div className="glass-panel px-4 py-2.5 rounded-2xl rounded-bl-none border border-cyan-500/30 flex items-center gap-3 shadow-lg">
        {/* Animated 3 dots */}
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
        </div>

        {/* Text */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-300">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
          <span>{thinkingText || 'QuestMate is thinking...'}</span>
        </div>
      </div>
    </div>
  );
};
