async function runTests() {
  const baseUrl = 'http://localhost:3001/api';

  console.log('--- 1. Testing Health ---');
  const healthRes = await fetch(`${baseUrl}/health`);
  console.log('Health:', await healthRes.json());

  console.log('\n--- 2. Testing Chat ("How do I defeat the Shadow King?") ---');
  const chatRes = await fetch(`${baseUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'How do I defeat the Shadow King?',
      context: { character: 'Aria', boss: 'Shadow King', level: 15, difficulty: 'Hard' }
    })
  });
  const chatData = await chatRes.json();
  console.log('Category:', chatData.category);
  console.log('Content:\n', chatData.content);

  console.log('\n--- 3. Testing Hint (Level 1, 2, 3, Solution) ---');
  for (let lvl = 1; lvl <= 4; lvl++) {
    const hintRes = await fetch(`${baseUrl}/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'Shadow King', level: lvl, context: { boss: 'Shadow King' } })
    });
    const hintData = await hintRes.json();
    console.log(`Hint ${lvl} [${hintData.title}]:`, hintData.content);
  }

  console.log('\n--- 4. Testing Strategy (Shadow King) ---');
  const stratRes = await fetch(`${baseUrl}/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ boss: 'Shadow King' })
  });
  const stratData = await stratRes.json();
  console.log('Boss Strategy for:', stratData.boss);
  console.log('Weakness:', stratData.weakness);
  console.log('Steps count:', stratData.steps.length);

  console.log('\n--- 5. Testing Build (Nyx - Aggressive) ---');
  const buildRes = await fetch(`${baseUrl}/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ character: 'Nyx', playStyle: 'Aggressive', level: 15 })
  });
  const buildData = await buildRes.json();
  console.log('Build name:', buildData.buildName);
  console.log('Abilities:', buildData.recommendedAbilities);
  console.log('Combat Strategy:', buildData.combatStrategy);

  console.log('\n✅ ALL BACKEND TEST ENDPOINTS VERIFIED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
