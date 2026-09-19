import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3001/api';

test('API Endpoints Verification Suite', async (t) => {
  await t.test('GET /health returns 200 with mode and status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.ok(data.mode === 'live_ai' || data.mode === 'demo_mode');
    assert.equal(data.game, 'Realm of Legends');
  });

  await t.test('GET /game-data returns knowledge base with characters and bosses', async () => {
    const res = await fetch(`${BASE_URL}/game-data`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.characters));
    assert.ok(Array.isArray(data.bosses));
    assert.ok(Array.isArray(data.quests));
  });

  await t.test('POST /chat processes question and returns categorized response', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'How do I defeat the Shadow King?',
        context: { character: 'Aria', boss: 'Shadow King', level: 15 }
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.category);
    assert.ok(data.content && data.content.length > 0);
  });

  await t.test('POST /chat rejects empty message with 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' })
    });
    assert.equal(res.status, 400);
  });

  await t.test('POST /hint returns progressive hint', async () => {
    const res = await fetch(`${BASE_URL}/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'Shadow King', level: 2 })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.level, 2);
    assert.ok(data.content);
  });

  await t.test('POST /strategy returns tactical boss guide', async () => {
    const res = await fetch(`${BASE_URL}/strategy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boss: 'Shadow King' })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.boss, 'Shadow King');
    assert.ok(data.steps.length > 0);
  });

  await t.test('POST /build returns customized loadout', async () => {
    const res = await fetch(`${BASE_URL}/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character: 'Aria', playStyle: 'Aggressive', level: 15 })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.character, 'Aria');
    assert.ok(data.statPriorities.length > 0);
  });

  await t.test('POST /next-move returns tactical action and urgency', async () => {
    const res = await fetch(`${BASE_URL}/next-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: { boss: 'Fire Titan', level: 12 } })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.urgency);
    assert.ok(data.action);
    assert.ok(data.steps.length > 0);
  });

  await t.test('POST /coach returns mistake diagnosis and 3-step drills', async () => {
    const res = await fetch(`${BASE_URL}/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem: 'I keep dying to meteor strike',
        context: { boss: 'Fire Titan', character: 'Nyx' }
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.diagnosis);
    assert.equal(data.coachDrill.length, 3);
  });

  await t.test('POST /rationale returns evidence-based rationale', async () => {
    const res = await fetch(`${BASE_URL}/rationale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'strategy', context: { boss: 'Shadow King', character: 'Aria' } })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.points.length >= 3);
  });

  await t.test('POST /counter-build returns boss-counter build with score', async () => {
    const res = await fetch(`${BASE_URL}/counter-build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character: 'Aria', boss: 'Shadow King', level: 15 })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.counterScore);
    assert.ok(data.counterVerdict);
  });
});
