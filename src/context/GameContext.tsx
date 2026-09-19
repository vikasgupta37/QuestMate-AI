import React, { useState, useEffect } from 'react';
import type { GameContextState, Difficulty, GameKnowledgeData } from '../types';
import rawGameData from '../data/games.json';
import { GameContext } from './GameContextCore';
export { useGame } from './GameContextCore';
export type { GameContextType } from './GameContextCore';

const defaultState: GameContextState = {
  game: 'Realm of Legends',
  character: 'Aria',
  quest: 'The Lost Crystal',
  boss: 'Shadow King',
  level: 15,
  difficulty: 'Hard'
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gameData = rawGameData as unknown as GameKnowledgeData;

  const [context, setContext] = useState<GameContextState>(() => {
    const saved = localStorage.getItem('questmate_context');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  const [isDemoMode, setDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('questmate_demomode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('questmate_context', JSON.stringify(context));
  }, [context]);

  useEffect(() => {
    localStorage.setItem('questmate_demomode', String(isDemoMode));
  }, [isDemoMode]);

  const setCharacter = (name: string) => setContext(prev => ({ ...prev, character: name }));
  const setQuest = (name: string) => setContext(prev => ({ ...prev, quest: name }));
  const setBoss = (name: string) => setContext(prev => ({ ...prev, boss: name }));
  const setLevel = (level: number) => setContext(prev => ({ ...prev, level }));
  const setDifficulty = (difficulty: Difficulty) => setContext(prev => ({ ...prev, difficulty }));

  const resetContext = () => {
    setContext(defaultState);
    localStorage.removeItem('questmate_context');
  };

  const activeCharacter = gameData.characters.find(
    c => c.name.toLowerCase() === context.character.toLowerCase()
  ) || gameData.characters[0];

  const activeBoss = gameData.bosses.find(
    b => b.name.toLowerCase() === context.boss.toLowerCase()
  ) || gameData.bosses[0];

  const activeQuest = gameData.quests.find(
    q => q.name.toLowerCase() === context.quest.toLowerCase()
  ) || gameData.quests[0];

  return (
    <GameContext.Provider
      value={{
        context,
        gameData,
        activeCharacter,
        activeBoss,
        activeQuest,
        isDemoMode,
        setDemoMode,
        setCharacter,
        setQuest,
        setBoss,
        setLevel,
        setDifficulty,
        resetContext
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
