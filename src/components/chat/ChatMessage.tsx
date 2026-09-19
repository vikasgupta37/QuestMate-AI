import React, { useState } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types';
import { Gamepad2, User, Copy, Check, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Simple, clean markdown rendering for lines
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      // Header 3: ###
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-white mt-2 mb-1 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Header 4: ####
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm font-semibold text-cyan-300 mt-2 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      // Warning / Blockquote: > ⚠️
      if (line.startsWith('> ⚠️') || line.startsWith('> 💡') || line.startsWith('>')) {
        return (
          <blockquote key={idx} className="border-l-2 border-amber-400 bg-amber-500/10 px-3 py-1.5 my-2 rounded-r-lg text-xs text-amber-200">
            {line.replace(/^>\s*/, '')}
          </blockquote>
        );
      }
      // Numbered step: 1. , 2. 
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-xs sm:text-sm text-slate-200">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-[11px] border border-cyan-500/30">
              {line.match(/^\d+/)?.[0]}
            </span>
            <span className="flex-1 pt-0.5">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      // Bullet list item: - 
      if (line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 text-xs sm:text-sm text-slate-300 pl-2">
            <span className="text-purple-400 font-bold">•</span>
            <span>{line.replace(/^- /, '')}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-0.5">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20 mt-1">
          <Gamepad2 className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 relative group ${
        isUser 
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-purple-900/30' 
          : 'glass-panel text-slate-100 rounded-bl-none border border-purple-500/25 shadow-xl'
      }`}>
        {/* Header with category badge & timestamp */}
        <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-white">
              {isUser ? 'You' : 'QuestMate'}
            </span>
            {!isUser && message.category && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-medium uppercase tracking-wider">
                {message.category}
              </span>
            )}
            {!isUser && message.isDemo && (
              <span className="flex items-center gap-1 text-cyan-400/80 text-[10px]">
                <Sparkles className="w-2.5 h-2.5" /> Demo
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[10px]">{message.timestamp}</span>
        </div>

        {/* Message Body */}
        <div className="space-y-0.5">
          {renderFormattedContent(message.content)}
        </div>

        {/* Copy Button */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-white bg-slate-800/40 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy message"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-purple-500/30 flex items-center justify-center shadow-md mt-1">
          <User className="w-4 h-4 text-purple-300" />
        </div>
      )}
    </div>
  );
};
