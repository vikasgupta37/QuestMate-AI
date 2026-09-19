export type PlayStyle = 'Aggressive' | 'Defensive' | 'Balanced' | 'Speed';
export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Nightmare';

export interface GameContextState {
  game: string;
  character: string;
  quest: string;
  boss: string;
  level: number;
  difficulty: Difficulty;
}

export interface Ability {
  name: string;
  type: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  element: string;
  description: string;
  baseStats: {
    health: number;
    mana: number;
    attack: number;
    defense: number;
    speed: number;
  };
  abilities: Ability[];
  recommendedPlaystyles: PlayStyle[];
}

export interface BossAttack {
  name: string;
  description: string;
}

export interface BossStrategy {
  recommendedCharacter: string;
  recommendedAbilities: string[];
  recommendedEquipment: string[];
  approach: string;
  steps: string[];
  warnings: string[];
}

export interface Boss {
  id: string;
  name: string;
  location: string;
  recommendedLevel: number;
  weakness: string;
  resistance: string;
  phases: number;
  recommendedCharacter: string;
  description: string;
  attacks: BossAttack[];
  hints: string[];
  strategy: BossStrategy;
}

export interface Quest {
  id: string;
  name: string;
  chapter: string;
  recommendedLevel: number;
  location: string;
  description: string;
  objectives: string[];
  steps: string[];
  hints: string[];
}

export interface GameMechanic {
  id: string;
  name: string;
  description: string;
  tips: string;
}

export interface CharacterBuild {
  characterId: string;
  playStyle: PlayStyle;
  name: string;
  statPriorities: string[];
  recommendedAbilities: string[];
  recommendedEquipment: string[];
  combatStrategy: string;
}

export interface GameKnowledgeData {
  game: string;
  tagline: string;
  characters: Character[];
  bosses: Boss[];
  quests: Quest[];
  mechanics: GameMechanic[];
  builds: CharacterBuild[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  category?: string;
  isDemo?: boolean;
}

export interface HintResponse {
  level: number;
  title: string;
  content: string;
}

export interface StrategyResponse {
  boss: string;
  location: string;
  recommendedLevel: number;
  weakness: string;
  resistance: string;
  recommendedCharacter: string;
  recommendedAbilities: string[];
  recommendedEquipment: string[];
  approach: string;
  steps: string[];
  warnings: string[];
}

export interface BuildResponse {
  character: string;
  class: string;
  element: string;
  level: number;
  playStyle: PlayStyle;
  buildName: string;
  statPriorities: string[];
  recommendedAbilities: string[];
  recommendedEquipment: string[];
  combatStrategy: string;
  rationale?: RationaleResponse;
}

export interface NextMoveResponse {
  urgency: 'HIGH' | 'MEDIUM' | 'READY';
  moveType: 'LEVEL_UP' | 'QUEST_PROGRESS' | 'BOSS_ENGAGE';
  action: string;
  reasoning: string;
  steps: string[];
  positioning: string;
  contextSnapshot: {
    character: string;
    boss: string;
    quest: string;
    level: number;
    difficulty: string;
  };
}

export interface CoachResponse {
  boss: string;
  character: string;
  diagnosis: string;
  rootCause: string;
  coachDrill: string[];
  mechanicExplanation: string;
  adaptedTip: string;
}

export interface RationaleResponse {
  title: string;
  points: string[];
  dataSource: string;
}

export interface CounterBuildResponse {
  character: string;
  class: string;
  element: string;
  level: number;
  targetBoss: string;
  bossWeakness: string;
  bossResistance: string;
  counterScore: number;
  counterVerdict: string;
  buildName: string;
  statPriorities: string[];
  recommendedAbilities: string[];
  recommendedEquipment: string[];
  combatStrategy: string;
  bossSpecificTips: string[];
  warnings: string[];
  rationale: string;
}

