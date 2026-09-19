import { GoogleGenerativeAI } from '@google/generative-ai';
import { findBoss, findQuest, findCharacter } from './knowledgeBase.js';
import { generateDemoResponse } from './demoEngine.js';

// ============================================================
// ENHANCED INTENT DETECTION (8→11 categories)
// ============================================================
export function classifyIntent(message) {
  const m = (message || '').toLowerCase();

  // Priority intents first (more specific patterns)
  if (m.includes('next best move') || m.includes('next move') || m.includes('what now') || m.includes('what should i do now')) return 'NEXT_MOVE';
  if (m.includes('keep dying') || m.includes('can\'t beat') || m.includes('stuck') || m.includes('what am i doing wrong') || m.includes('mistake') || m.includes('coach') || m.includes('analyze my')) return 'COACHING';
  if (m.includes('why') || m.includes('reason') || m.includes('rationale') || m.includes('why this') || m.includes('why recommend')) return 'RATIONALE';

  // Original intents
  if (m.includes('hint') || m.includes('clue') || m.includes('without spoiler')) return 'HINT';
  if (m.includes('build') || m.includes('equipment') || m.includes('gear') || m.includes('stat priority') || m.includes('loadout')) return 'BUILD';
  if (m.includes('strategy') || m.includes('tactics') || m.includes('how to beat') || m.includes('defeat') || m.includes('kill')) return 'STRATEGY';
  if (m.includes('boss') || m.includes('shadow king') || m.includes('fire titan') || m.includes('frost witch')) return 'BOSS';
  if (m.includes('quest') || m.includes('mission') || m.includes('objective') || m.includes('what should i do next')) return 'QUEST';
  if (m.includes('character') || m.includes('aria') || m.includes('kael') || m.includes('nyx') || m.includes('orion') || m.includes('who am i')) return 'CHARACTER';
  if (m.includes('mechanic') || m.includes('stagger') || m.includes('element') || m.includes('upgrade') || m.includes('skill point')) return 'GAME_MECHANIC';
  if (m.includes('beginner') || m.includes('starter') || m.includes('new player') || m.includes('tips')) return 'BEGINNER_HELP';

  return 'GENERAL';
}

// ============================================================
// MAIN AGENT PROCESSOR
// ============================================================
export async function processAgentQuery(userMessage, context = {}, conversationHistory = []) {
  const intent = classifyIntent(userMessage);

  // Extract context parameters
  const game = context.game || 'Realm of Legends';
  const character = context.character || 'Aria';
  const quest = context.quest || 'The Lost Crystal';
  const boss = context.boss || 'Shadow King';
  const level = context.level || 15;
  const difficulty = context.difficulty || 'Hard';

  // Retrieve relevant game knowledge
  const relevantBoss = findBoss(userMessage) || findBoss(boss);
  const relevantQuest = findQuest(userMessage) || findQuest(quest);
  const relevantChar = findCharacter(userMessage) || findCharacter(character);

  // Check if real Gemini API key is available
  const apiKey = process.env.GEMINI_API_KEY;
  const hasRealKey = apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 10;

  if (!hasRealKey) {
    // Return structured demo response directly
    const demo = generateDemoResponse(userMessage, {
      ...context,
      game, character, quest, boss, level, difficulty
    });
    return {
      category: intent || demo.category,
      content: demo.content,
      isDemo: true,
      contextUsed: { game, character, quest, boss, level, difficulty }
    };
  }

  // Attempt real LLM reasoning with Gemini
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const systemContext = `
You are "QuestMate Agent", an elite, game-aware AI coaching companion for the RPG "${game}".
You are NOT a generic chatbot. You are a specialized gaming coach that gives precise, actionable, context-aware advice.

CURRENT PLAYER CONTEXT:
- Game: ${game}
- Player Character: ${character} (${relevantChar ? relevantChar.class : 'Hero'}, ${relevantChar ? relevantChar.element : 'Unknown'} element)
- Current Active Quest: ${quest}
- Target Boss: ${boss}
- Player Level: ${level}
- Game Difficulty: ${difficulty}

DETECTED INTENT: ${intent}

KNOWLEDGE BASE RETRIEVAL:
${relevantBoss ? `Boss Knowledge: ${JSON.stringify(relevantBoss)}` : ''}
${relevantQuest ? `Quest Knowledge: ${JSON.stringify(relevantQuest)}` : ''}
${relevantChar ? `Character Knowledge: ${JSON.stringify(relevantChar)}` : ''}

RESPONSE RULES:
1. Stay strictly in character as QuestMate AI.
2. Use markdown headers (###), bullet points, emojis, and warnings (> ⚠️).
3. Keep responses concise (max 300 words). Use numbered steps for tactics.
4. For HINT intent: Give ONE progressive clue, not the solution.
5. For COACHING intent: Diagnose the problem, explain the mechanic, give a 3-step drill.
6. For NEXT_MOVE intent: Give exactly ONE tactical action with positioning and reasoning.
7. For RATIONALE intent: Explain WHY using game mechanics data, not opinions.
8. If a fact is NOT in the knowledge base, state: "I don't have that specific detail in my current game knowledge."
9. ALWAYS reference the player's character (${character}), level (${level}), and boss (${boss}).
10. End with a follow-up suggestion or action the player can take.
`;

    const chat = model.startChat({
      history: conversationHistory.slice(-4).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(`${systemContext}\n\nUSER QUESTION: ${userMessage}`);
    const text = result.response.text();

    return {
      category: intent,
      content: text,
      isDemo: false,
      contextUsed: { game, character, quest, boss, level, difficulty }
    };
  } catch (err) {
    console.warn('Gemini API call failed, falling back to Demo Mode:', err.message);
    const demo = generateDemoResponse(userMessage, {
      ...context,
      game, character, quest, boss, level, difficulty
    });
    return {
      category: intent || demo.category,
      content: demo.content,
      isDemo: true,
      errorFallback: true,
      contextUsed: { game, character, quest, boss, level, difficulty }
    };
  }
}
