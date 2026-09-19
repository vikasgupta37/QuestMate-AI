const tests = [
  {
    name: 'Next Move',
    url: 'http://localhost:3001/api/next-move',
    body: { context: { character: 'Aria', boss: 'Shadow King', quest: 'The Lost Crystal', level: 15, difficulty: 'Hard' } }
  },
  {
    name: 'Coach Diagnosis',
    url: 'http://localhost:3001/api/coach',
    body: { problem: 'I keep dying to the Shadow King burst attack', context: { character: 'Aria', boss: 'Shadow King', level: 15, difficulty: 'Hard' } }
  },
  {
    name: 'Rationale',
    url: 'http://localhost:3001/api/rationale',
    body: { type: 'strategy', context: { character: 'Aria', boss: 'Shadow King' } }
  },
  {
    name: 'Counter Build',
    url: 'http://localhost:3001/api/counter-build',
    body: { character: 'Aria', boss: 'Shadow King', level: 15 }
  },
  {
    name: 'Chat - Next Move Intent',
    url: 'http://localhost:3001/api/chat',
    body: { message: "What's my next best move?", context: { character: 'Aria', boss: 'Shadow King', quest: 'The Lost Crystal', level: 15, difficulty: 'Hard' } }
  },
  {
    name: 'Chat - Coach Intent',
    url: 'http://localhost:3001/api/chat',
    body: { message: 'I keep dying to the Shadow King, what am I doing wrong?', context: { character: 'Aria', boss: 'Shadow King', level: 15, difficulty: 'Hard' } }
  },
  {
    name: 'Chat - Why/Rationale Intent',
    url: 'http://localhost:3001/api/chat',
    body: { message: 'Why do you recommend Aria for this fight?', context: { character: 'Aria', boss: 'Shadow King', level: 15 } }
  }
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const res = await fetch(test.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.body)
      });
      const data = await res.json();

      if (res.ok && data) {
        console.log(`✅ ${test.name}: PASS`);
        // Show a key field to verify content
        const preview = JSON.stringify(data).slice(0, 150);
        console.log(`   Preview: ${preview}...`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAIL (${res.status})`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${test.name}: ERROR - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🏁 Results: ${passed}/${tests.length} passed, ${failed} failed`);
}

runTests();
