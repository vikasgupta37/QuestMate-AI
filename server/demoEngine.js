import { findBoss, findQuest, findCharacter, findBuild } from './knowledgeBase.js';

// ============================================================
// NEXT BEST MOVE ENGINE
// ============================================================
export function generateNextMove(context = {}) {
  const character = context.character || 'Aria';
  const boss = context.boss || 'Shadow King';
  const quest = context.quest || 'The Lost Crystal';
  const level = context.level || 15;
  const difficulty = context.difficulty || 'Hard';

  const charData = findCharacter(character);
  const bossData = findBoss(boss);
  const questData = findQuest(quest);

  // Assess urgency from level gap
  const levelGap = (bossData?.recommendedLevel || 15) - level;
  let urgency = 'MEDIUM';
  let moveType = 'QUEST_PROGRESS';

  if (levelGap > 3) {
    urgency = 'HIGH';
    moveType = 'LEVEL_UP';
  } else if (levelGap <= 0) {
    urgency = 'READY';
    moveType = 'BOSS_ENGAGE';
  }

  const moves = {
    LEVEL_UP: {
      action: `Gain ${levelGap} more levels before fighting ${bossData?.name || boss}`,
      reasoning: `You are Level ${level} but ${bossData?.name} is tuned for Level ${bossData?.recommendedLevel}. The ${levelGap}-level gap means his attacks will deal 30% bonus damage to you and your spells will be resisted more often.`,
      steps: [
        `Complete side objectives in ${questData?.location || 'the current area'} for bonus XP.`,
        `Upgrade your weapon to at least +${Math.min(level, 5)} at the Blacksmith.`,
        `Farm the elite mobs near ${questData?.location || 'the quest zone'} for Star Metal Ore.`
      ],
      positioning: 'Focus on the northeast corner of the map where mob density is highest.'
    },
    QUEST_PROGRESS: {
      action: `Advance "${questData?.name || quest}" — ${questData?.objectives?.[0] || 'complete the next objective'}`,
      reasoning: `You are at the right level range (Lvl ${level}) for this quest (Rec. ${questData?.recommendedLevel || 12}). Completing it will unlock the path to ${bossData?.name || boss} and grant essential pre-boss gear.`,
      steps: questData?.steps?.slice(0, 3) || [
        'Follow the quest marker to the objective.',
        'Clear the area of hostile mobs.',
        'Interact with the quest objective.'
      ],
      positioning: `Head ${questData?.location ? 'to ' + questData.location : 'east from your current position'}.`
    },
    BOSS_ENGAGE: {
      action: `You are ready to challenge ${bossData?.name || boss}!`,
      reasoning: `At Level ${level}, you meet the recommended threshold (Lvl ${bossData?.recommendedLevel || 15}). ${charData?.name || character}'s ${charData?.element || 'elemental'} attacks directly counter ${bossData?.name}'s weakness (${bossData?.weakness || 'unknown'}).`,
      steps: [
        `Equip ${bossData?.strategy?.recommendedEquipment?.[0] || 'your best elemental weapon'}.`,
        `Slot ${bossData?.strategy?.recommendedAbilities?.[0] || 'your counter ability'} into your primary skill bar.`,
        `Enter ${bossData?.location || 'the boss arena'} and initiate the encounter.`
      ],
      positioning: `Start the fight at max range and position near ${bossData?.phases > 1 ? 'the arena\'s edge for Phase 2 adds' : 'the center for optimal dodging'}.`
    }
  };

  const move = moves[moveType];

  return {
    urgency,
    moveType,
    action: move.action,
    reasoning: move.reasoning,
    steps: move.steps,
    positioning: move.positioning,
    contextSnapshot: { character, boss, quest, level, difficulty }
  };
}

// ============================================================
// AI COACH & MISTAKE ANALYZER
// ============================================================
const COMMON_MISTAKES = {
  'shadow king': [
    {
      patterns: ['shadow burst', 'burst', 'shockwave', 'one shot', 'wiped', 'killed instantly'],
      diagnosis: 'You are being hit by Shadow Burst — a telegraphed AoE with a 2.5s wind-up.',
      rootCause: 'Standing too close or dodging backward instead of sideways. The shockwave propagates forward in a cone.',
      drill: [
        'Watch for the sword raising upright with purple runes — this is the 2.5s telegraph.',
        'Dash perpendicular (left or right), NOT backward. The wave travels in the forward cone.',
        'Immediately cast your strongest light spell during his 4-second recovery window.'
      ],
      mechanic: 'Shadow Burst has a forward-cone hitbox. Lateral movement avoids 100% of the damage.'
    },
    {
      patterns: ['shield', 'damage reflected', 'reflect', 'no damage', 'immune', 'can\'t hurt'],
      diagnosis: 'You are attacking into the Shadow King\'s active dark shield, which reflects 50% damage.',
      rootCause: 'The shield shimmers with a dark aura when active. Attacking it punishes you instead of the boss.',
      drill: [
        'Never attack when you see the shimmering dark aura around the boss.',
        'Wait for Shadow Burst — the shield drops for 4-5 seconds after the attack.',
        'Use that window exclusively for your damage rotation.'
      ],
      mechanic: 'The dark shield reflects 50% of incoming damage. It only drops after Shadow Burst recovery.'
    },
    {
      patterns: ['mana', 'run out', 'no mana', 'can\'t cast', 'out of resources'],
      diagnosis: 'You are running out of mana before finishing the Shadow King encounter.',
      rootCause: 'Continuous casting during shield-up phases wastes mana on reflected/absorbed hits.',
      drill: [
        'Only cast during the 4-5 second vulnerability window after Shadow Burst.',
        'Equip the Amulet of Serenity for +40% mana regeneration.',
        'Use Arcane Surge at the start of each vulnerability window for +100% mana regen during the burst.'
      ],
      mechanic: 'Mana efficiency is critical. Each vulnerability window should get exactly 2 spell rotations.'
    }
  ],
  'fire titan': [
    {
      patterns: ['burn', 'fire', 'lava', 'ground', 'dot', 'damage over time', 'standing'],
      diagnosis: 'You are taking sustained burn damage from lava ground hazards.',
      rootCause: 'Standing still for more than 2 seconds on the arena floor activates lava fissures.',
      drill: [
        'Keep moving in a circular orbit — never stand still for more than 2 seconds.',
        'Watch for red circles on the ground indicating incoming magma geysers.',
        'Equip Frost resistance boots to reduce Burn DoT by 40%.'
      ],
      mechanic: 'The arena has dynamic lava tiles. Constant movement prevents fissure activation.'
    },
    {
      patterns: ['armor', 'can\'t break', 'physical', 'no damage', 'immune'],
      diagnosis: 'Your physical or fire attacks cannot penetrate the Titan\'s volcanic armor.',
      rootCause: 'The Fire Titan is immune to fire damage and highly resistant to physical strikes until his armor is chilled.',
      drill: [
        'Switch to Frost-element abilities (Frost Ward, Cold arrows).',
        'Target his lower limbs to build the frost gauge.',
        'When the frost gauge fills, the armor shatters and he staggers for 8 seconds.'
      ],
      mechanic: 'Frost attacks build a hidden "brittle gauge." At 100%, the armor crystallizes and breaks.'
    }
  ],
  'frost witch': [
    {
      patterns: ['frozen', 'freeze', 'ice', 'chill', 'stacks', 'can\'t move', 'encased'],
      diagnosis: 'Chill debuff is stacking to 5, encasing you in ice for 4 seconds.',
      rootCause: 'Staying inside Blizzard Storm AoE too long or getting hit by Ice Lance tracking projectiles.',
      drill: [
        'Use Vanish or a mobility skill immediately when Blizzard Storm begins.',
        'Weave between ice lances rather than tanking them.',
        'Equip Ring of Embers for passive chill resistance.'
      ],
      mechanic: 'Each ice hit adds 1 chill stack. At 5 stacks = 4-second freeze. Stacks decay after 6 seconds out of frost AoE.'
    },
    {
      patterns: ['clone', 'illusion', 'mirror', 'wrong one', 'which one', 'can\'t find'],
      diagnosis: 'You are attacking the wrong mirror clone during the Mirror Clones phase.',
      rootCause: 'The Frost Witch splits into 3 identical reflections. Attacking a fake one triggers an explosive frost trap.',
      drill: [
        'Look for the faint shadow beneath her feet — clones do NOT cast shadows.',
        'The real witch has a subtle glowing rune above her head.',
        'Close the gap with Shadow Strike or Shield Slam to interrupt her channel.'
      ],
      mechanic: 'Only the real witch casts a shadow on the snow. Destroying a clone triggers an AoE frost explosion.'
    }
  ]
};

export function generateCoachDiagnosis(problemDescription, context = {}) {
  const q = (problemDescription || '').toLowerCase();
  const boss = context.boss || 'Shadow King';
  const character = context.character || 'Aria';
  const charData = findCharacter(character);
  const bossData = findBoss(boss);
  const bossKey = boss.toLowerCase();

  // Find matching mistake pattern
  const bossMistakes = COMMON_MISTAKES[bossKey] || COMMON_MISTAKES['shadow king'];
  let matched = null;

  for (const mistake of bossMistakes) {
    if (mistake.patterns.some(p => q.includes(p))) {
      matched = mistake;
      break;
    }
  }

  if (!matched) {
    // Generic coaching fallback
    matched = bossMistakes[0];
  }

  return {
    boss: bossData?.name || boss,
    character: charData?.name || character,
    diagnosis: matched.diagnosis,
    rootCause: matched.rootCause,
    coachDrill: matched.drill,
    mechanicExplanation: matched.mechanic,
    adaptedTip: `As **${charData?.name || character}** (${charData?.class || 'Hero'}), use your **${charData?.abilities?.[2]?.name || 'defensive ability'}** to create space when you see the attack telegraph.`
  };
}

// ============================================================
// "WHY THIS RECOMMENDATION?" RATIONALE ENGINE
// ============================================================
export function generateRationale(recommendationType, context = {}) {
  const character = context.character || 'Aria';
  const boss = context.boss || 'Shadow King';
  const charData = findCharacter(character);
  const bossData = findBoss(boss);

  const rationales = {
    strategy: {
      title: `Why ${charData?.name} against ${bossData?.name}?`,
      points: [
        `**Elemental Counter:** ${charData?.name}'s primary element (${charData?.element}) directly counters ${bossData?.name}'s weakness (${bossData?.weakness}). This grants a **200% damage multiplier** on vulnerability hits.`,
        `**Range Advantage:** ${charData?.class === 'Mage' || charData?.class === 'Ranger' ? charData.name + ' can maintain safe distance during ' + bossData?.name + '\'s melee telegraphs, reducing positioning risk by 60%.' : charData.name + '\'s high defense allows tanking hits that would kill squishier characters.'}`,
        `**Ability Synergy:** ${bossData?.strategy?.recommendedAbilities?.[0] || 'The recommended ability'} has a ${charData?.class === 'Mage' ? '4-second cast window that perfectly matches ' + bossData?.name + '\'s post-burst recovery duration' : 'short cooldown that aligns with the boss stagger window'}.`,
        `**Game Mechanic:** ${bossData?.name}'s ${bossData?.attacks?.[0]?.name || 'primary attack'} creates a vulnerability window. ${charData?.name}'s kit is designed to exploit exactly this pattern.`
      ],
      dataSource: 'Realm of Legends Knowledge Base — Boss Affinity Matrix & Character Ability Tables'
    },
    build: {
      title: `Why this build for ${charData?.name}?`,
      points: [
        `**Stat Priority Logic:** The recommended stat order maximizes your damage-per-vulnerability-window against ${bossData?.name}, where burst within short openings matters more than sustained DPS.`,
        `**Equipment Synergy:** Each gear piece was selected to enhance ${charData?.element} damage and provide resistance against ${bossData?.resistance || 'the boss\'s primary damage type'}.`,
        `**Ability Rotation:** The selected abilities create a chain: buff → burst → escape, perfectly timed to the boss's attack cycle.`,
        `**Level Scaling:** At Level ${context.level || 15}, these stat thresholds hit critical breakpoints for ${charData?.class} performance.`
      ],
      dataSource: 'Realm of Legends Knowledge Base — Build Optimization Tables & Stat Breakpoint Charts'
    },
    hint: {
      title: `Why progressive hints?`,
      points: [
        `**Discovery Preservation:** Research shows players retain 40% more satisfaction when they discover solutions themselves rather than reading walkthroughs.`,
        `**Skill Building:** Each hint teaches an underlying mechanic, building pattern recognition for future encounters.`,
        `**Adaptive Difficulty:** You control how much help you receive, maintaining challenge at your comfort level.`
      ],
      dataSource: 'Game Design Best Practices — Progressive Disclosure Theory'
    }
  };

  return rationales[recommendationType] || rationales.strategy;
}

// ============================================================
// BOSS-COUNTER BUILD OPTIMIZER
// ============================================================
export function generateCounterBuild(characterName, bossName, level = 15) {
  const char = findCharacter(characterName) || findCharacter('aria');
  const boss = findBoss(bossName) || findBoss('shadow king');
  const baseBuild = findBuild(char.id, 'Balanced');

  // Override equipment and abilities to counter specific boss
  const counterEquipment = boss.strategy?.recommendedEquipment || baseBuild.recommendedEquipment;
  const counterAbilities = boss.strategy?.recommendedAbilities || baseBuild.recommendedAbilities;

  // Compute counter effectiveness score
  const elementMatch = char.element?.toLowerCase().includes(boss.weakness?.toLowerCase().split(' ')[0]) ||
    boss.weakness?.toLowerCase().includes(char.element?.toLowerCase().split(' ')[0]);
  const counterScore = elementMatch ? 95 : 60;

  return {
    character: char.name,
    class: char.class,
    element: char.element,
    level,
    targetBoss: boss.name,
    bossWeakness: boss.weakness,
    bossResistance: boss.resistance,
    counterScore,
    counterVerdict: counterScore >= 80 ? 'EXCELLENT COUNTER' : counterScore >= 60 ? 'VIABLE PICK' : 'SUBOPTIMAL — Consider switching',
    buildName: `${boss.name} Counter Build`,
    statPriorities: baseBuild.statPriorities,
    recommendedAbilities: counterAbilities,
    recommendedEquipment: counterEquipment,
    combatStrategy: boss.strategy?.approach || baseBuild.combatStrategy,
    bossSpecificTips: boss.strategy?.steps?.slice(0, 3) || [],
    warnings: boss.strategy?.warnings || [],
    rationale: `${char.name}'s ${char.element} element ${elementMatch ? 'directly counters' : 'partially affects'} ${boss.name}'s weakness (${boss.weakness}). ${elementMatch ? 'This grants 200% elemental damage during vulnerability windows.' : 'Consider equipping elemental runes to bridge the affinity gap.'}`
  };
}

// ============================================================
// ENHANCED DEMO RESPONSE ENGINE (original + new intents)
// ============================================================
export function generateDemoResponse(userMessage, context = {}) {
  const q = (userMessage || '').toLowerCase();
  const character = context.character || 'Aria';
  const boss = context.boss || 'Shadow King';
  const quest = context.quest || 'The Lost Crystal';
  const level = context.level || 15;
  const difficulty = context.difficulty || 'Hard';

  // === NEW: Next Best Move intent ===
  if (q.includes('next best move') || q.includes('what should i do now') || q.includes('next move') || q.includes('what now')) {
    const move = generateNextMove(context);
    return {
      category: 'NEXT_MOVE',
      content: `### ⚡ Next Best Move — Priority: **${move.urgency}**

**Action:** ${move.action}

**Why:** ${move.reasoning}

**Steps:**
${move.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Positioning:** ${move.positioning}

> 🧠 *This recommendation is grounded in your active context: ${character} (Lvl ${level}) vs ${boss} on ${difficulty}.*`
    };
  }

  // === NEW: Coach / Mistake Analysis intent ===
  if (q.includes('keep dying') || q.includes('can\'t beat') || q.includes('stuck') || q.includes('help me with') || q.includes('what am i doing wrong') || q.includes('mistake') || q.includes('coach')) {
    const diagnosis = generateCoachDiagnosis(userMessage, context);
    return {
      category: 'COACHING',
      content: `### 🧠 AI Coach Diagnosis — ${diagnosis.boss}

**Problem Detected:**
${diagnosis.diagnosis}

**Root Cause:**
${diagnosis.rootCause}

**Coach Drill (3-Step Fix):**
${diagnosis.coachDrill.map((d, i) => `${i + 1}. ${d}`).join('\n')}

**Mechanic Explained:**
> ⚙️ ${diagnosis.mechanicExplanation}

**Personalized Tip:**
${diagnosis.adaptedTip}`
    };
  }

  // === NEW: Why / Rationale intent ===
  if (q.includes('why') && (q.includes('recommend') || q.includes('this') || q.includes('that') || q.includes('reason'))) {
    const rationale = generateRationale('strategy', context);
    return {
      category: 'RATIONALE',
      content: `### 🧠 ${rationale.title}

${rationale.points.map(p => `- ${p}`).join('\n')}

> 📚 *Source: ${rationale.dataSource}*`
    };
  }

  // 1. Identity & Context questions
  if (q.includes('what character') || q.includes('who am i') || q.includes('my character')) {
    const charData = findCharacter(character);
    return {
      category: 'CHARACTER',
      content: `### ⚔️ Current Character: **${character}**
You are currently playing as **${character}** (${charData?.class || 'Mage'}), a master of ${charData?.element || 'Light & Arcane'} magic.

- **Level:** ${level}
- **Difficulty:** ${difficulty}
- **Primary Spells:** ${charData?.abilities.map(a => a.name).join(', ') || 'Light Nova, Arcane Surge'}

Let me know if you'd like an optimal build or ability upgrade path!`
    };
  }

  // 2. Upgrades & Skill points
  if (q.includes('upgrade') || q.includes('skill point') || q.includes('what should i upgrade')) {
    const charData = findCharacter(character) || findCharacter('aria');
    const bossData = findBoss(boss);
    return {
      category: 'BUILD',
      content: `### 🔮 Upgrade Recommendation for **${character}** (Level ${level})

At **Level ${level} (${difficulty} Mode)**, prioritize counter-synergy against **${bossData?.name || boss}**:

1. **${charData?.abilities?.[0]?.name || 'Primary Ability'} (Max Rank):** Maximize burst for the ${bossData?.name || boss}'s vulnerability windows.
2. **${charData?.abilities?.[1]?.name || 'Secondary Ability'} (Rank 2):** Essential for survivability during ${bossData?.attacks?.[0]?.name || 'boss attacks'}.
3. **Weapon Upgrade (+5 Star Metal):** Unlock the first runic socket for a **${bossData?.weakness?.includes('Light') ? 'Dawn Rune' : bossData?.weakness?.includes('Frost') ? 'Frost Rune' : 'Elemental Rune'}**.
4. **Mana/Resource Gear:** Sustain through extended encounters.

> 🧠 *Why these priorities?* ${charData?.name}'s ${charData?.element} element ${bossData?.weakness?.toLowerCase().includes(charData?.element?.split(' ')[0]?.toLowerCase()) ? 'directly counters' : 'complements attacks against'} ${bossData?.name}'s weakness (${bossData?.weakness}).`
    };
  }

  // 3. Boss Questions & "How do I defeat"
  if (q.includes('defeat') || q.includes('boss') || q.includes('shadow king') || q.includes('titan') || q.includes('witch')) {
    const targetBoss = findBoss(q) || findBoss(boss) || findBoss('shadow king');
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
${strat.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

> ⚠️ **Watch out:**
${strat.warnings.map(w => `- ${w}`).join('\n')}

> 🧠 **Why ${strat.recommendedCharacter}?** Their elemental affinity (${findCharacter(strat.recommendedCharacter)?.element || 'Light'}) directly counters ${targetBoss.name}'s weakness (${targetBoss.weakness}), granting a 200% damage multiplier during vulnerability windows.`
    };
  }

  // 4. Quest & "What should I do next"
  if (q.includes('what should i do next') || q.includes('quest') || q.includes('mission') || q.includes('lost crystal') || q.includes('escape') || q.includes('temple')) {
    const targetQuest = findQuest(q) || findQuest(quest) || findQuest('the lost crystal');
    return {
      category: 'QUEST',
      content: `### 🎯 Active Quest: **${targetQuest.name}**
*${targetQuest.chapter} — Recommended Level ${targetQuest.recommendedLevel}*

**Objective:**
${targetQuest.description}

**Next Recommended Steps:**
${targetQuest.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

💡 **Tactical Advice:**
Ensure your inventory is stocked with potions and your gear is at least +3 before entering the chamber.`
    };
  }

  // 5. Hint request
  if (q.includes('hint') || q.includes('clue') || q.includes('without revealing')) {
    const targetBoss = findBoss(boss) || findBoss('shadow king');
    return {
      category: 'HINT',
      content: `### 💡 QuestMate Hint (Level 1) for **${targetBoss.name}**

"${targetBoss.hints[0]}"

*Need more help? Click **Hint 2** in Hint Mode for a more specific clue without spoiling the battle!*`
    };
  }

  // 6. Character builds
  if (q.includes('build') || q.includes('equipment') || q.includes('loadout')) {
    const targetChar = findCharacter(character) || findCharacter('aria');
    const bossData = findBoss(boss);
    const counterBuild = generateCounterBuild(targetChar.name, bossData?.name || boss, level);
    return {
      category: 'BUILD',
      content: `### 🛡️ Boss-Counter Build: **${counterBuild.buildName}**
**Character:** ${counterBuild.character} (${counterBuild.class}) | **Target:** ${counterBuild.targetBoss}
**Counter Effectiveness:** ${counterBuild.counterVerdict} (${counterBuild.counterScore}%)

**Stat Priorities:**
${counterBuild.statPriorities.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

**Abilities:**
${counterBuild.recommendedAbilities.map(a => `- **${a}**`).join('\n')}

**Recommended Equipment:**
${counterBuild.recommendedEquipment.map(e => `- 🗡️ ${e}`).join('\n')}

**Combat Strategy:**
${counterBuild.combatStrategy}

> 🧠 **Why this build?** ${counterBuild.rationale}`
    };
  }

  // 7. Game Mechanics
  if (q.includes('mechanic') || q.includes('element') || q.includes('stagger') || q.includes('how does')) {
    return {
      category: 'GAME_MECHANIC',
      content: `### ⚙️ Core Mechanic: **Elemental Damage & Stagger**

In *Realm of Legends*, combat revolves around affinities:
- **Light** dismantles **Shadow** shields and pierces abyssal armor.
- **Frost** chills and crystallizes **Fire** creatures, breaking their posture.
- **Fire** melts **Frost** illusions and interrupts continuous channels.
- **Lightning** arcs through heavily armored warriors, causing multi-target stuns.

> 💡 **Pro-Tip:** Empty the enemy's golden posture bar to trigger an 8-second **Stagger** window with 250% critical damage!`
    };
  }

  // 8. Default intelligent response using active context
  const move = generateNextMove(context);
  return {
    category: 'GENERAL',
    content: `### 🎮 QuestMate Analysis for **${character}** (Level ${level})

You are currently tracking **${quest}** and preparing to face **${boss}** on **${difficulty}** difficulty.

**⚡ Immediate Priority (${move.urgency}):**
${move.action}

**Quick Recommendations:**
1. **Boss Prep:** ${boss}'s weakness is **${findBoss(boss)?.weakness || 'elemental counters'}** — equip corresponding skills.
2. **Current Goal:** Advance **${quest}** by following your compass to the objective.
3. **Action:** Click **⚡ Next Move**, **Strategy**, or **🧠 Coach** for deeper tactical guidance!`
  };
}

// ============================================================
// EXISTING FUNCTIONS (enhanced)
// ============================================================
export function generateHint(topic, hintLevel, context = {}) {
  const boss = findBoss(topic) || findBoss(context.boss) || findBoss('shadow king');
  const quest = findQuest(topic) || findQuest(context.quest);
  const target = boss || quest;

  if (!target || !target.hints) {
    return {
      level: hintLevel,
      title: 'General Hint',
      content: 'Observe the enemy attack telegraphs and preserve your mobility skill for emergency escapes.'
    };
  }

  const levelNum = parseInt(hintLevel, 10);
  if (levelNum === 1) {
    return { level: 1, title: `Hint 1: Subtle Clue for ${target.name}`, content: target.hints[0] };
  } else if (levelNum === 2) {
    return { level: 2, title: `Hint 2: Specific Clue for ${target.name}`, content: target.hints[1] };
  } else if (levelNum === 3) {
    return { level: 3, title: `Hint 3: Direct Clue for ${target.name}`, content: target.hints[2] };
  } else {
    return {
      level: 4,
      title: `🔓 Full Solution for ${target.name}`,
      content: target.hints[3] || (boss?.strategy?.approach + '\n\n' + boss?.strategy?.steps?.join('\n'))
    };
  }
}

export function generateStrategy(bossName, context = {}) {
  const boss = findBoss(bossName) || findBoss(context.boss) || findBoss('shadow king');
  const rationale = generateRationale('strategy', { ...context, boss: boss.name });

  return {
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
    warnings: boss.strategy.warnings,
    rationale
  };
}

export function generateBuild(characterName, playStyle = 'Aggressive', level = 15, bossName = null) {
  const char = findCharacter(characterName) || findCharacter('aria');
  const build = findBuild(char.id, playStyle);
  const boss = bossName ? findBoss(bossName) : null;
  const buildRationale = generateRationale('build', { character: char.name, boss: boss?.name || 'Shadow King', level });

  return {
    character: char.name,
    class: char.class,
    element: char.element,
    level,
    playStyle: playStyle || 'Aggressive',
    buildName: build.name,
    statPriorities: build.statPriorities,
    recommendedAbilities: build.recommendedAbilities,
    recommendedEquipment: build.recommendedEquipment,
    combatStrategy: build.combatStrategy,
    rationale: buildRationale
  };
}
