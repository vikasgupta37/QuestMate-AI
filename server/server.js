import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { processAgentQuery } from './agent.js';
import {
  generateHint,
  generateStrategy,
  generateBuild,
  generateNextMove,
  generateCoachDiagnosis,
  generateRationale,
  generateCounterBuild
} from './demoEngine.js';
import { getGameData } from './knowledgeBase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security: Disable Express fingerprint header
app.disable('x-powered-by');

// Security: Enforce Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Security: Restrict body size to prevent payload exhaustion
app.use(express.json({ limit: '100kb' }));

// CORS setup
app.use(cors());

// Input sanitizer helper to prevent malformed/excessive payloads
function sanitizeText(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

// Health & status check
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here');
  res.json({
    status: 'ok',
    mode: hasKey ? 'live_ai' : 'demo_mode',
    provider: 'Google Gemini (3.6 Flash)',
    game: 'Realm of Legends',
    uptime: Math.round(process.uptime())
  });
});

// Full Game Knowledge
app.get('/api/game-data', (req, res) => {
  const data = getGameData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to load game knowledge base' });
  }
  res.json(data);
});

// Main Chat Query (Context-aware agent)
app.post('/api/chat', async (req, res) => {
  try {
    const rawMessage = req.body?.message;
    if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
      return res.status(400).json({ error: 'Valid message text is required' });
    }

    const message = sanitizeText(rawMessage, 2000);
    const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];

    const response = await processAgentQuery(message, context, history);
    res.json(response);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: "QuestMate couldn't reach the AI service right now.",
      fallbackAvailable: true
    });
  }
});

// Progressive Hint endpoint
app.post('/api/hint', (req, res) => {
  try {
    const topic = sanitizeText(req.body?.topic, 200);
    const rawLevel = Number(req.body?.level);
    const level = Number.isFinite(rawLevel) ? Math.min(Math.max(rawLevel, 1), 3) : 1;
    const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};

    const hint = generateHint(topic, level, context);
    res.json(hint);
  } catch (err) {
    console.error('Hint error:', err);
    res.status(500).json({ error: 'Failed to retrieve hint' });
  }
});

// Strategy Generator endpoint
app.post('/api/strategy', (req, res) => {
  try {
    const boss = sanitizeText(req.body?.boss, 100) || 'Shadow King';
    const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};
    const strategy = generateStrategy(boss, context);
    res.json(strategy);
  } catch (err) {
    console.error('Strategy error:', err);
    res.status(500).json({ error: 'Failed to generate strategy' });
  }
});

// Build Creator endpoint
app.post('/api/build', (req, res) => {
  try {
    const character = sanitizeText(req.body?.character, 100) || 'Aria';
    const playStyle = sanitizeText(req.body?.playStyle, 50) || 'Aggressive';
    const rawLevel = Number(req.body?.level);
    const level = Number.isFinite(rawLevel) ? Math.min(Math.max(rawLevel, 1), 100) : 15;

    const build = generateBuild(character, playStyle, level);
    res.json(build);
  } catch (err) {
    console.error('Build error:', err);
    res.status(500).json({ error: 'Failed to generate character build' });
  }
});

// Next Best Move endpoint
app.post('/api/next-move', (req, res) => {
  try {
    const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};
    const move = generateNextMove(context);
    res.json(move);
  } catch (err) {
    console.error('Next-move error:', err);
    res.status(500).json({ error: 'Failed to compute next move' });
  }
});

// AI Coach Diagnosis endpoint
app.post('/api/coach', (req, res) => {
  try {
    const problem = sanitizeText(req.body?.problem, 500);
    const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};
    const diagnosis = generateCoachDiagnosis(problem, context);
    res.json(diagnosis);
  } catch (err) {
    console.error('Coach error:', err);
    res.status(500).json({ error: 'Failed to generate coach diagnosis' });
  }
});

// Rationale / "Why this?" endpoint
app.post('/api/rationale', (req, res) => {
  try {
    const type = sanitizeText(req.body?.type, 50) || 'strategy';
    const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};
    const rationale = generateRationale(type, context);
    res.json(rationale);
  } catch (err) {
    console.error('Rationale error:', err);
    res.status(500).json({ error: 'Failed to generate rationale' });
  }
});

// Counter-Build Optimizer endpoint
app.post('/api/counter-build', (req, res) => {
  try {
    const character = sanitizeText(req.body?.character, 100) || 'Aria';
    const boss = sanitizeText(req.body?.boss, 100) || 'Shadow King';
    const rawLevel = Number(req.body?.level);
    const level = Number.isFinite(rawLevel) ? Math.min(Math.max(rawLevel, 1), 100) : 15;

    const build = generateCounterBuild(character, boss, level);
    res.json(build);
  } catch (err) {
    console.error('Counter-build error:', err);
    res.status(500).json({ error: 'Failed to generate counter build' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 QuestMate AI Backend running on http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.GEMINI_API_KEY ? 'Live AI connected' : 'Demo Mode (no API key detected)'}`);
});
