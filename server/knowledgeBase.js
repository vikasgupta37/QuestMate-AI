import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../src/data/games.json');

let gameData = null;

export function getGameData() {
  if (!gameData) {
    try {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      gameData = JSON.parse(raw);
    } catch (err) {
      console.error('Error loading game knowledge base:', err);
      return null;
    }
  }
  return gameData;
}

export function findBoss(query) {
  const data = getGameData();
  if (!data || !query) return null;
  const q = query.toLowerCase();
  return data.bosses.find(b => 
    b.id.toLowerCase() === q || 
    b.name.toLowerCase().includes(q) ||
    q.includes(b.name.toLowerCase())
  ) || null;
}

export function findQuest(query) {
  const data = getGameData();
  if (!data || !query) return null;
  const q = query.toLowerCase();
  return data.quests.find(qItem => 
    qItem.id.toLowerCase() === q || 
    qItem.name.toLowerCase().includes(q) ||
    q.includes(qItem.name.toLowerCase())
  ) || null;
}

export function findCharacter(query) {
  const data = getGameData();
  if (!data || !query) return null;
  const q = query.toLowerCase();
  return data.characters.find(c => 
    c.id.toLowerCase() === q || 
    c.name.toLowerCase().includes(q) ||
    c.class.toLowerCase().includes(q) ||
    q.includes(c.name.toLowerCase())
  ) || null;
}

export function findBuild(characterId, playStyle) {
  const data = getGameData();
  if (!data) return null;
  const cId = (characterId || '').toLowerCase();
  const pStyle = (playStyle || 'Balanced').toLowerCase();

  const found = data.builds.find(b => 
    b.characterId.toLowerCase() === cId && 
    b.playStyle.toLowerCase() === pStyle
  );

  if (found) return found;

  // Fallback to any build for this character
  return data.builds.find(b => b.characterId.toLowerCase() === cId) || data.builds[0];
}

export function getMechanics() {
  const data = getGameData();
  return data ? data.mechanics : [];
}
