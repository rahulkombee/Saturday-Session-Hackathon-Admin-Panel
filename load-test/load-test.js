/**
 * Custom Node.js Load Test Script - SEQUENTIAL BATCH MODE
 * Calls each API 5,000 times one after another.
 * 
 * Usage: node load-test/load-test.js
 */

const BASE_URL = 'http://localhost:4000';
const LOGIN_PAYLOAD = {
  email: 'admin@gmail.com',
  password: 'password123'
};

const REQUESTS_PER_ENDPOINT = 5000;
const CONCURRENCY = 50; 
const ENDPOINTS = ['/api/users', '/api/roles', '/api/brands'];

async function runLoadTest() {
  console.log(`🚀 Starting Sequential Load Test at ${BASE_URL}...`);
  
  // 1. Authenticate
  console.log('🔑 Logging in to get access token...');
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(LOGIN_PAYLOAD),
  });

  if (!loginRes.ok) {
    console.error('❌ Login failed! Make sure your backend is running and seeded.');
    process.exit(1);
  }

  const { data } = await loginRes.json();
  const token = data.accessToken;
  console.log('✅ Authentication successful!\n');

  const globalStart = Date.now();
  const finalStats = [];

  // 2. Process each endpoint sequentially
  for (const endpoint of ENDPOINTS) {
    console.log(`\n📡 Testing Endpoint: ${endpoint} (${REQUESTS_PER_ENDPOINT} requests)`);
    console.log('--------------------------------------------------');
    
    let completed = 0;
    let successCount = 0;
    let failureCount = 0;
    const batchStart = Date.now();

    const makeRequest = async () => {
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          // Add a timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000) 
        });
        if (res.ok) {
          successCount++;
        } else {
          failureCount++;
          // Log non-200 responses occasionally for debugging
          if (failureCount % 100 === 0) {
            console.log(`   ⚠️ Warning: Received status ${res.status} from ${endpoint}`);
          }
        }
      } catch (err) {
        failureCount++;
        // Log network/fatal errors occasionally
        if (failureCount % 50 === 0) {
          console.error(`   ❌ Connection Error: ${err.message}`);
        }
      } finally {
        completed++;
        if (completed % 1000 === 0) {
          console.log(`   📦 Progress: ${completed}/${REQUESTS_PER_ENDPOINT} completed...`);
        }
      }
    };

    // Run in parallel chunks
    try {
      const tasks = [];
      for (let i = 0; i < REQUESTS_PER_ENDPOINT; i++) {
        tasks.push(makeRequest());
        if (tasks.length >= CONCURRENCY) {
          await Promise.all(tasks);
          tasks.length = 0;
        }
      }
      await Promise.all(tasks);
    } catch (fatalError) {
      console.error(`\n🔥 Fatal error during ${endpoint} batch:`, fatalError.message);
      // Don't stop the whole test, just move to next endpoint
    }

    const batchDuration = (Date.now() - batchStart) / 1000;
    finalStats.push({
      endpoint,
      success: successCount,
      failed: failureCount,
      duration: batchDuration.toFixed(2),
      rps: (REQUESTS_PER_ENDPOINT / batchDuration).toFixed(2)
    });
    
    console.log(`✅ Finished ${endpoint} (${failureCount} failures)`);
  }

  const globalDuration = (Date.now() - globalStart) / 1000;

  console.log('\n==================================================');
  console.log('📊 FINAL SEQUENTIAL LOAD TEST RESULTS');
  console.log('==================================================');
  finalStats.forEach(stat => {
    console.log(`Endpoint: ${stat.endpoint.padEnd(12)}`);
    console.log(`   Success:  ${stat.success}`);
    console.log(`   Failed:   ${stat.failed}`);
    console.log(`   Time:     ${stat.duration}s`);
    console.log(`   Rate:     ${stat.rps} req/sec`);
    console.log('--------------------------------------------------');
  });
  console.log(`Total Time:  ${globalDuration.toFixed(2)} seconds`);
  console.log('==================================================\n');
  console.log('📈 Check Grafana to see the separate spikes for Users, Roles, and Brands!');
}

runLoadTest().catch(err => {
  console.error('🔥 Fatal error during load test:', err);
});
