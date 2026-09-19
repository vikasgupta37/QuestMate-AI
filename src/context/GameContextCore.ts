import { createContext, useContext } from 'react';
import type { GameContextState, GameKnowledgeData, Character, Boss, Quest, Difficulty } from '../types';

export interface GameContextType {
  context: GameContextState;
  gameData: GameKnowledgeData;
  activeCharacter: Character;
  activeBoss: Boss;
  activeQuest: Quest;
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  setCharacter: (name: string) => void;
  setQuest: (name: string) => void;
  setBoss: (name: string) => void;
  setLevel: (level: number) => void;
  setDifficulty: (diff: Difficulty) => void;
  resetContext: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
