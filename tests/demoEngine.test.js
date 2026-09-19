import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateNextMove,
  generateCoachDiagnosis,
  generateRationale,
  generateCounterBuild,
  generateHint,
  generateStrategy,
  generateBuild
} from '../server/demoEngine.js';

test('Demo Engine & Tactical Features Suite', async (t) => {
  await t.test('generateNextMove returns HIGH urgency when player is under-leveled', () => {
    const move = generateNextMove({ boss: 'Shadow King', level: 10 });
    assert.equal(move.urgency, 'HIGH');
    assert.equal(move.moveType, 'LEVEL_UP');
    assert.ok(move.action.length > 0);
    assert.ok(move.steps.length >= 3);
  });

  await t.test('generateNextMove returns READY status when player meets recommended level', () => {
    const move = generateNextMove({ boss: 'Shadow King', level: 18 });
    assert.equal(move.urgency, 'READY');
    assert.equal(move.moveType, 'BOSS_ENGAGE');
    assert.ok(move.action.includes('engage') || move.action.includes('ready'));
  });

  await t.test('generateCoachDiagnosis provides diagnosis, root cause, and 3-step drills', () => {
    const diagnosis = generateCoachDiagnosis('I keep dying during shield phase', {
      boss: 'Shadow King',
      character: 'Aria'
    });
    assert.equal(diagnosis.boss, 'Shadow King');
    assert.equal(diagnosis.character, 'Aria');
    assert.ok(diagnosis.diagnosis.length > 0);
    assert.ok(diagnosis.rootCause.length > 0);
    assert.equal(diagnosis.coachDrill.length, 3);
    assert.ok(diagnosis.mechanicExplanation.length > 0);
    assert.ok(diagnosis.adaptedTip.includes('Aria'));
  });

  await t.test('generateRationale produces structured evidence points', () => {
    const rationale = generateRationale('strategy', {
      character: 'Aria',
      boss: 'Shadow King'
    });
    assert.ok(rationale.title.includes('Shadow King'));
    assert.ok(Array.isArray(rationale.points));
    assert.ok(rationale.points.length >= 3);
    assert.ok(rationale.dataSource.includes('Knowledge Base'));
  });

  await t.test('generateCounterBuild computes effectiveness score and recommendations', () => {
    const counter = generateCounterBuild('Aria', 'Shadow King', 15);
    assert.equal(counter.character, 'Aria');
    assert.equal(counter.targetBoss, 'Shadow King');
    assert.ok(counter.counterScore >= 50 && counter.counterScore <= 100);
    assert.ok(['EXCELLENT COUNTER', 'VIABLE PICK', 'SUBOPTIMAL — Consider switching'].includes(counter.counterVerdict));
    assert.ok(counter.statPriorities.length > 0);
    assert.ok(counter.recommendedAbilities.length > 0);
  });

  await t.test('generateHint respects 3 progressive spoiler-free levels', () => {
    const h1 = generateHint('The Lost Crystal', 1);
    const h2 = generateHint('The Lost Crystal', 2);
    const h3 = generateHint('The Lost Crystal', 3);

    assert.equal(h1.level, 1);
    assert.equal(h2.level, 2);
    assert.equal(h3.level, 3);
    assert.ok(h1.content !== h2.content);
    assert.ok(h2.content !== h3.content);
  });

  await t.test('generateStrategy returns boss weakness, resistance, and phases', () => {
    const strat = generateStrategy('Shadow King');
    assert.equal(strat.boss, 'Shadow King');
    assert.equal(strat.weakness, 'Light Damage');
    assert.equal(strat.resistance, 'Dark & Shadow Magic');
    assert.ok(strat.steps.length > 0);
    assert.ok(strat.warnings.length > 0);
  });

  await t.test('generateBuild returns character gear and combat strategy', () => {
    const build = generateBuild('Aria', 'Aggressive', 15);
    assert.equal(build.character, 'Aria');
    assert.equal(build.playStyle, 'Aggressive');
    assert.ok(Array.isArray(build.recommendedEquipment));
    assert.ok(build.recommendedEquipment.length > 0);
    assert.ok(build.combatStrategy.length > 0);
  });
});
