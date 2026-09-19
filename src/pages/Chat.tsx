import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useChat } from '../hooks/useChat';
import { ContextCard } from '../components/context/ContextCard';
import { ChatMessage } from '../components/chat/ChatMessage';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions';
import { HintPanel } from '../components/hints/HintPanel';
import { StrategyPanel } from '../components/strategy/StrategyPanel';
import { BuildPanel } from '../components/build/BuildPanel';
import { NextMoveCard } from '../components/coach/NextMoveCard';
import { CoachPanel } from '../components/coach/CoachPanel';
import { 
  Send, 
  Lightbulb, 
  Swords, 
  Shield, 
  RotateCcw, 
  MessageSquareCode,
  Zap,
  Brain
} from 'lucide-react';

type ActiveTab = 'chat' | 'hint' | 'strategy' | 'build' | 'nextmove' | 'coach';

export const Chat: React.FC = () => {
  const { context } = useGame();
  const location = useLocation();
  const { messages, loading, thinkingText, sendMessage, clearChat, addAssistantDirectMessage } = useChat(context);

  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialProcessed = useRef(false);

  // Auto-scroll on new messages or thinking state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, thinkingText]);

  // Handle incoming initial query from Dashboard navigation
  useEffect(() => {
    const state = location.state as { initialQuery?: string } | null;
    if (state?.initialQuery && !initialProcessed.current) {
      initialProcessed.current = true;
      sendMessage(state.initialQuery);
    }
  }, [location.state, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const tabConfig = [
    { id: 'chat' as ActiveTab, label: 'Chat', icon: MessageSquareCode, activeClass: 'bg-purple-600 text-white shadow-sm', emoji: '💬' },
    { id: 'hint' as ActiveTab, label: 'Hints', icon: Lightbulb, activeClass: 'bg-amber-600 text-white shadow-sm', emoji: '💡' },
    { id: 'strategy' as ActiveTab, label: 'Strategy', icon: Swords, activeClass: 'bg-indigo-600 text-white shadow-sm', emoji: '⚔️' },
    { id: 'build' as ActiveTab, label: 'Build', icon: Shield, activeClass: 'bg-cyan-600 text-white shadow-sm', emoji: '🛡️' },
    { id: 'nextmove' as ActiveTab, label: 'Next Move', icon: Zap, activeClass: 'bg-emerald-600 text-white shadow-sm', emoji: '⚡' },
    { id: 'coach' as ActiveTab, label: 'Coach', icon: Brain, activeClass: 'bg-rose-600 text-white shadow-sm', emoji: '🧠' },
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-3 sm:p-6 space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-purple-500/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            QuestMate <span className="text-cyan-400">AI</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
              Agent v2.0
            </span>
          </h1>
          <p className="text-xs text-slate-400">Your Intelligent Gaming Coach</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Desktop Mode Switchers */}
          <div
            role="tablist"
            aria-label="Agent Mode Panels"
            className="hidden sm:flex bg-slate-900/80 p-1 rounded-xl border border-purple-500/20 text-xs"
          >
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none cursor-pointer ${
                  activeTab === tab.id ? tab.activeClass : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={clearChat}
            aria-label="Start fresh conversation session"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-medium transition-colors shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
            title="Start fresh conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        </div>
      </div>

      {/* Live Context Card */}
      <ContextCard />

      {/* Mobile Mode Switcher Bar */}
      <div
        role="tablist"
        aria-label="Mobile Agent Mode Panels"
        className="flex sm:hidden overflow-x-auto gap-1.5 py-1 text-xs"
      >
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`mob-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg flex-shrink-0 font-medium cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
              activeTab === tab.id ? tab.activeClass : 'bg-slate-900 text-slate-400'
            }`}
          >
            <span aria-hidden="true">{tab.emoji}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab: Interactive Panels vs Chat */}
      {activeTab === 'hint' && (
        <div role="tabpanel" id="panel-hint" aria-labelledby="tab-hint" className="animate-fadeIn">
          <HintPanel onInsertToChat={(text) => {
            addAssistantDirectMessage(text, 'HINT');
            setActiveTab('chat');
          }} />
        </div>
      )}

      {activeTab === 'strategy' && (
        <div role="tabpanel" id="panel-strategy" aria-labelledby="tab-strategy" className="animate-fadeIn">
          <StrategyPanel onSendToChat={(text) => {
            addAssistantDirectMessage(text, 'STRATEGY');
            setActiveTab('chat');
          }} />
        </div>
      )}

      {activeTab === 'build' && (
        <div role="tabpanel" id="panel-build" aria-labelledby="tab-build" className="animate-fadeIn">
          <BuildPanel onInsertToChat={(text) => {
            addAssistantDirectMessage(text, 'BUILD');
            setActiveTab('chat');
          }} />
        </div>
      )}

      {activeTab === 'nextmove' && (
        <div role="tabpanel" id="panel-nextmove" aria-labelledby="tab-nextmove" className="animate-fadeIn">
          <NextMoveCard onInsertToChat={(text) => {
            addAssistantDirectMessage(text, 'NEXT_MOVE');
            setActiveTab('chat');
          }} />
        </div>
      )}

      {activeTab === 'coach' && (
        <div role="tabpanel" id="panel-coach" aria-labelledby="tab-coach" className="animate-fadeIn">
          <CoachPanel onInsertToChat={(text) => {
            addAssistantDirectMessage(text, 'COACHING');
            setActiveTab('chat');
          }} />
        </div>
      )}

      {/* Main Chat Interface */}
      {activeTab === 'chat' && (
        <div role="tabpanel" id="panel-chat" aria-labelledby="tab-chat" className="flex-1 flex flex-col min-h-0 space-y-3">
          {/* Messages Scroll Area */}
          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 overflow-y-auto px-2 py-3 rounded-2xl glass-panel border border-purple-500/15 space-y-2 max-h-[58vh]"
          >
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}

            {loading && <TypingIndicator thinkingText={thinkingText} />}

            <div ref={messagesEndRef} />
          </div>

          {/* Context-aware Suggested Questions */}
          <SuggestedQuestions onSelectQuestion={(q) => sendMessage(q)} />

          {/* Input & Action Buttons Form */}
          <div className="space-y-2">
            {/* Action Buttons Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-0.5">
              <span className="text-slate-500 text-[11px] font-medium mr-1 hidden sm:inline">Tactics:</span>
              <button
                type="button"
                onClick={() => setActiveTab('hint')}
                aria-label="Open Progressive Hint panel"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
              >
                <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hint</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('strategy')}
                aria-label="Open Boss Strategy panel"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
              >
                <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Strategy</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('build')}
                aria-label="Open Character Build optimizer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Build</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('nextmove')}
                aria-label="Open Next Best Move tactical advisor"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
              >
                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Next Move</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('coach')}
                aria-label="Open AI Mistake Coach panel"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
              >
                <Brain className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Coach</span>
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="flex gap-2" role="search">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask QuestMate anything (e.g. I keep dying to the Shadow King, what am I doing wrong?)..."
                disabled={loading}
                aria-label="Gaming query input"
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-900/90 border border-purple-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 text-white placeholder-slate-500 text-xs sm:text-sm transition-all focus:outline-none shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !inputVal.trim()}
                aria-label="Submit query to QuestMate AI"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <span>Send</span>
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
