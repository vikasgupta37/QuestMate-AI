import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyIntent } from '../server/agent.js';

test('Intent Classification Suite', async (t) => {
  await t.test('detects NEXT_MOVE intent accurately', () => {
    assert.equal(classifyIntent('what is my next best move?'), 'NEXT_MOVE');
    assert.equal(classifyIntent('what should i do now'), 'NEXT_MOVE');
    assert.equal(classifyIntent('next move please'), 'NEXT_MOVE');
  });

  await t.test('detects COACHING intent accurately', () => {
    assert.equal(classifyIntent('I keep dying to the Shadow King, what am I doing wrong?'), 'COACHING');
    assert.equal(classifyIntent('I am stuck and cannot beat this boss'), 'COACHING');
    assert.equal(classifyIntent('coach me through this mistake'), 'COACHING');
  });

  await t.test('detects RATIONALE intent accurately', () => {
    assert.equal(classifyIntent('why do you recommend this weapon?'), 'RATIONALE');
    assert.equal(classifyIntent('why this strategy?'), 'RATIONALE');
    assert.equal(classifyIntent('what is the reason for this recommendation?'), 'RATIONALE');
  });

  await t.test('detects HINT intent without spoilers', () => {
    assert.equal(classifyIntent('give me a hint without spoiler'), 'HINT');
    assert.equal(classifyIntent('can I get a clue for this quest?'), 'HINT');
  });

  await t.test('detects BUILD and equipment intent', () => {
    assert.equal(classifyIntent('what is the best build for Aria?'), 'BUILD');
    assert.equal(classifyIntent('what gear and equipment loadout should I use?'), 'BUILD');
  });

  await t.test('detects STRATEGY intent', () => {
    assert.equal(classifyIntent('how to beat the Shadow King?'), 'STRATEGY');
    assert.equal(classifyIntent('combat tactics and strategy for Fire Titan'), 'STRATEGY');
  });

  await t.test('detects BOSS intent', () => {
    assert.equal(classifyIntent('tell me about the Frost Witch boss'), 'BOSS');
  });

  await t.test('detects QUEST intent', () => {
    assert.equal(classifyIntent('what is the objective for The Lost Crystal quest?'), 'QUEST');
  });

  await t.test('detects CHARACTER intent', () => {
    assert.equal(classifyIntent('who am I and what are my abilities?'), 'CHARACTER');
  });

  await t.test('defaults to GENERAL for miscellaneous questions', () => {
    assert.equal(classifyIntent('hello there agent'), 'GENERAL');
  });
});
