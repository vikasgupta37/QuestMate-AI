import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage, GameContextState } from '../types';
import { sendChatMessage } from '../services/api';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `### ⚔️ Welcome to **QuestMate AI**
*Your Intelligent Gaming Companion for **Realm of Legends**.*

I am connected to your active session. Ask me for:
- 🎯 **Quest Guidance & Next Steps**
- 👾 **Boss Weaknesses & Full Strategies**
- 💡 **Progressive Spoiler-Free Hints**
- 🛡️ **Optimal Character Builds & Upgrades**

How can I assist your journey today, traveler?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  category: 'GENERAL'
};

export function useChat(context: GameContextState) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem('questmate_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_MESSAGE];
      }
    }
    return [INITIAL_MESSAGE];
  });

  const [loading, setLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState('');

  useEffect(() => {
    sessionStorage.setItem('questmate_chat', JSON.stringify(messages));
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem('questmate_chat');
  }, []);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setThinkingText('QuestMate is analyzing your quest...');

    // Quick thinking transition for realistic AI agent feel
    const timer = setTimeout(() => {
      setThinkingText('QuestMate is preparing your strategy...');
    }, 450);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(userText, context, history);

      clearTimeout(timer);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content || 'Strategy ready.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: response.category,
        isDemo: response.isDemo
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat send error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "⚠️ QuestMate couldn't reach the AI service right now. Please try again or switch to Demo Mode.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setThinkingText('');
    }
  }, [context, loading, messages]);

  const addAssistantDirectMessage = useCallback((content: string, category: string = 'STRATEGY') => {
    const directMessage: ChatMessage = {
      id: `direct-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category
    };
    setMessages(prev => [...prev, directMessage]);
  }, []);

  return {
    messages,
    loading,
    thinkingText,
    sendMessage,
    clearChat,
    addAssistantDirectMessage
  };
}
