import type { GameContextState, HintResponse, StrategyResponse, BuildResponse, PlayStyle, NextMoveResponse, CoachResponse, RationaleResponse, CounterBuildResponse } from '../types';
import rawGameData from '../data/games.json';

const API_BASE = '/api';

// In-memory cache for deterministic requests (Efficiency optimization)
const apiCache = new Map<string, { timestamp: number; data: unknown }>();
const CACHE_TTL_MS = 60_000; // 60s cache TTL

function getCached<T>(key: string): T | null {
  const item = apiCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    apiCache.delete(key);
    return null;
  }
  return item.data as T;
}

function setCached<T>(key: string, data: T): void {
  apiCache.set(key, { timestamp: Date.now(), data });
}

// Local client-side fallback if backend server is unreachable
function clientFallbackChat(message: string, context: GameContextState) {
  const q = message.toLowerCase();
  const character = context.character || 'Aria';
  const boss = context.boss || 'Shadow King';
  const quest = context.quest || 'The Lost Crystal';
  const level = context.level || 15;
  const difficulty = context.difficulty || 'Hard';

  const data = rawGameData as any;
  const targetBoss = data.bosses.find((b: any) => b.name.toLowerCase() === boss.toLowerCase()) || data.bosses[0];
  const targetChar = data.characters.find((c: any) => c.name.toLowerCase() === character.toLowerCase()) || data.characters[0];
  const targetQuest = data.quests.find((qItem: any) => qItem.name.toLowerCase() === quest.toLowerCase()) || data.quests[0];

  if (q.includes('what character') || q.includes('who am i')) {
    return {
      category: 'CHARACTER',
      content: `### ⚔️ Current Character: **${character}**
You are playing as **${character}** (${targetChar.class}), harnessing ${targetChar.element}.

- **Level:** ${level}
- **Difficulty:** ${difficulty}
- **Abilities:** ${targetChar.abilities.map((a: any) => a.name).join(', ')}`,
      isDemo: true
    };
  }

  if (q.includes('upgrade') || q.includes('skill point') || q.includes('what should i upgrade')) {
    return {
      category: 'BUILD',
      content: `### 🔮 Upgrade Recommendation for **${character}** (Level ${level})

1. **Primary Spell:** Max out **${targetChar.abilities[0].name}** for optimal counter burst.
2. **Mobility Skill:** Enhance **${targetChar.abilities[1].name}** to reposition during unblockables.
3. **Blacksmith:** Refine weapon to **+5 Star Metal** to unlock Dawn Runic sockets.`,
      isDemo: true
    };
  }

  if (q.includes('defeat') || q.includes('boss') || q.includes('shadow king')) {
    const strat = targetBoss.strategy;
    return {
      category: 'BOSS',
      content: `### 👾 Boss Strategy: **${targetBoss.name}**

**Recommended Character:**
${strat.recommendedCharacter}

**Weakness:**
⚡ ${targetBoss.weakness} *(Resistant to: ${targetBoss.resistance})*

**Approach:**
${strat.approach}

**Combat Steps:**
${strat.steps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

> ⚠️ **Watch out:**
${strat.warnings.map((w: string) => `- ${w}`).join('\n')}`,
      isDemo: true
    };
  }

  if (q.includes('quest') || q.includes('next') || q.includes('what should i do')) {
    return {
      category: 'QUEST',
      content: `### 🎯 Active Quest: **${targetQuest.name}**
*${targetQuest.chapter} — Recommended Level ${targetQuest.recommendedLevel}*

**Objective:**
${targetQuest.description}

**Next Steps:**
${targetQuest.steps.map((s: string, idx: number) => `${idx + 1}. ${s}`).join('\n')}`,
      isDemo: true
    };
  }

  return {
    category: 'GENERAL',
    content: `### 🎮 QuestMate Analysis for **${character}** (Level ${level})

You are currently tracking **${quest}** and preparing to face **${boss}** on **${difficulty}** difficulty.

**Combat Quick Tips:**
1. **Boss Prep:** Target ${targetBoss.name}'s weakness (${targetBoss.weakness}).
2. **Current Objective:** ${targetQuest.objectives[0]}.
3. **Action:** Click **Hint Mode** or **Strategy** below for immediate battle-tested tactics!`,
    isDemo: true
  };
}

export async function sendChatMessage(
  message: string,
  context: GameContextState,
  history: { role: string; content: string }[] = []
) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, history })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('API unreachable, using seamless offline demo engine:', err);
    return clientFallbackChat(message, context);
  }
}

export async function fetchHint(topic: string, level: number, context: GameContextState): Promise<HintResponse> {
  try {
    const res = await fetch(`${API_BASE}/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level, context })
    });
    if (!res.ok) throw new Error('Hint request failed');
    return await res.json();
  } catch {
    const data = rawGameData as any;
    const targetBoss = data.bosses.find((b: any) => b.name.toLowerCase().includes(topic.toLowerCase())) || data.bosses[0];
    const hints = targetBoss.hints || [];
    const titles = [
      'Subtle Clue',
      'Specific Clue',
      'Direct Clue',
      'Full Solution'
    ];
    const idx = Math.min(Math.max(level - 1, 0), 3);
    return {
      level,
      title: `${titles[idx]} for ${targetBoss.name}`,
      content: hints[idx] || hints[0]
    };
  }
}

export async function fetchStrategy(bossName: string, context: GameContextState): Promise<StrategyResponse> {
  const cacheKey = `strategy:${bossName.toLowerCase()}:${context.character || ''}:${context.level || 0}`;
  const cached = getCached<StrategyResponse>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/strategy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boss: bossName, context })
    });
    if (!res.ok) throw new Error('Strategy request failed');
    const result: StrategyResponse = await res.json();
    setCached(cacheKey, result);
    return result;
  } catch {
    const data = rawGameData as any;
    const boss = data.bosses.find((b: any) => b.name.toLowerCase().includes(bossName.toLowerCase())) || data.bosses[0];
    const fallback: StrategyResponse = {
      boss: boss.name,
      location: boss.location,
      recommendedLevel: boss.recommendedLevel,
      weakness: boss.weakness,
      resistance: boss.resistance,
      recommendedCharacter: boss.strategy.recommendedCharacter,
      recommendedAbilities: boss.strategy.recommendedAbilities,
      recommendedEquipment: boss.strategy.recommendedEquipment,
      approach: boss.strategy.approach,
      steps: boss.strategy.steps,
      warnings: boss.strategy.warnings
    };
    setCached(cacheKey, fallback);
    return fallback;
  }
}

export async function fetchBuild(characterName: string, playStyle: PlayStyle, level: number): Promise<BuildResponse> {
  const cacheKey = `build:${characterName.toLowerCase()}:${playStyle}:${level}`;
  const cached = getCached<BuildResponse>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character: characterName, playStyle, level })
    });
    if (!res.ok) throw new Error('Build request failed');
    const result: BuildResponse = await res.json();
    setCached(cacheKey, result);
    return result;
  } catch {
    const data = rawGameData as any;
    const char = data.characters.find((c: any) => c.name.toLowerCase() === characterName.toLowerCase()) || data.characters[0];
    const build = data.builds.find(
      (b: any) => b.characterId === char.id && b.playStyle.toLowerCase() === playStyle.toLowerCase()
    ) || data.builds[0];

    const fallback: BuildResponse = {
      character: char.name,
      class: char.class,
      element: char.element,
      level,
      playStyle,
      buildName: build.name,
      statPriorities: build.statPriorities,
      recommendedAbilities: build.recommendedAbilities,
      recommendedEquipment: build.recommendedEquipment,
      combatStrategy: build.combatStrategy
    };
    setCached(cacheKey, fallback);
    return fallback;
  }
}

export async function fetchNextMove(context: GameContextState): Promise<NextMoveResponse> {
  try {
    const res = await fetch(`${API_BASE}/next-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context })
    });
    if (!res.ok) throw new Error('Next-move request failed');
    return await res.json();
  } catch {
    const data = rawGameData as any;
    const boss = data.bosses.find((b: any) => b.name.toLowerCase() === (context.boss || '').toLowerCase()) || data.bosses[0];
    const levelGap = (boss.recommendedLevel || 15) - (context.level || 15);
    const urgency = levelGap > 3 ? 'HIGH' : levelGap <= 0 ? 'READY' : 'MEDIUM';
    return {
      urgency: urgency as NextMoveResponse['urgency'],
      moveType: levelGap > 3 ? 'LEVEL_UP' : levelGap <= 0 ? 'BOSS_ENGAGE' : 'QUEST_PROGRESS',
      action: levelGap <= 0 ? `You are ready to fight ${boss.name}!` : `Gain ${levelGap} levels before ${boss.name}`,
      reasoning: `Level ${context.level || 15} vs recommended ${boss.recommendedLevel}`,
      steps: ['Follow the quest marker', 'Upgrade your weapon', 'Stock potions'],
      positioning: 'Head toward the objective marker on your map.',
      contextSnapshot: { character: context.character, boss: context.boss, quest: context.quest, level: context.level, difficulty: context.difficulty }
    };
  }
}

export async function fetchCoachDiagnosis(problem: string, context: GameContextState): Promise<CoachResponse> {
  try {
    const res = await fetch(`${API_BASE}/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, context })
    });
    if (!res.ok) throw new Error('Coach request failed');
    return await res.json();
  } catch {
    return {
      boss: context.boss || 'Shadow King',
      character: context.character || 'Aria',
      diagnosis: 'You may be attacking during the boss\'s shielded phase.',
      rootCause: 'The boss has damage reflection or immunity windows that must be respected.',
      coachDrill: [
        'Watch for the boss telegraph animation (glowing aura).',
        'Only attack during the recovery window after the boss\'s big attack.',
        'Use your defensive ability when you see the telegraph start.'
      ],
      mechanicExplanation: 'Bosses cycle between shielded and vulnerable phases. Attacking during shield wastes resources.',
      adaptedTip: `As ${context.character || 'Aria'}, use your mobility skill to reposition safely during shield phases.`
    };
  }
}

export async function fetchRationale(type: string, context: GameContextState): Promise<RationaleResponse> {
  const cacheKey = `rationale:${type}:${context.character || ''}:${context.boss || ''}`;
  const cached = getCached<RationaleResponse>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/rationale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, context })
    });
    if (!res.ok) throw new Error('Rationale request failed');
    const result: RationaleResponse = await res.json();
    setCached(cacheKey, result);
    return result;
  } catch {
    const fallback: RationaleResponse = {
      title: `Why this recommendation for ${context.character || 'Aria'}?`,
      points: [
        'Elemental counter advantage against the target boss.',
        'Stat priorities optimized for burst damage windows.',
        'Equipment synergy with your character class.'
      ],
      dataSource: 'Realm of Legends Knowledge Base'
    };
    setCached(cacheKey, fallback);
    return fallback;
  }
}

export async function fetchCounterBuild(character: string, boss: string, level: number): Promise<CounterBuildResponse> {
  const cacheKey = `counter-build:${character.toLowerCase()}:${boss.toLowerCase()}:${level}`;
  const cached = getCached<CounterBuildResponse>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/counter-build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, boss, level })
    });
    if (!res.ok) throw new Error('Counter-build request failed');
    const result: CounterBuildResponse = await res.json();
    setCached(cacheKey, result);
    return result;
  } catch {
    const data = rawGameData as any;
    const char = data.characters.find((c: any) => c.name.toLowerCase() === character.toLowerCase()) || data.characters[0];
    const bossData = data.bosses.find((b: any) => b.name.toLowerCase() === boss.toLowerCase()) || data.bosses[0];
    const build = data.builds.find((b: any) => b.characterId === char.id) || data.builds[0];
    const fallback: CounterBuildResponse = {
      character: char.name,
      class: char.class,
      element: char.element,
      level,
      targetBoss: bossData.name,
      bossWeakness: bossData.weakness,
      bossResistance: bossData.resistance,
      counterScore: 75,
      counterVerdict: 'VIABLE PICK',
      buildName: `${bossData.name} Counter Build`,
      statPriorities: build.statPriorities,
      recommendedAbilities: bossData.strategy.recommendedAbilities,
      recommendedEquipment: bossData.strategy.recommendedEquipment,
      combatStrategy: bossData.strategy.approach,
      bossSpecificTips: bossData.strategy.steps.slice(0, 3),
      warnings: bossData.strategy.warnings,
      rationale: `${char.name}'s ${char.element} element targets ${bossData.name}'s weakness (${bossData.weakness}).`
    };
    setCached(cacheKey, fallback);
    return fallback;
  }
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { status: 'offline', mode: 'demo_mode' };
    return await res.json();
  } catch {
    return { status: 'offline', mode: 'demo_mode' };
  }
}
