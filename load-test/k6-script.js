import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * k6 Comprehensive Load Test
 * Features: Auth, Multi-API, and Error Injection.
 * 
 * Command to run via Docker:
 * docker run --rm -i grafana/k6 run --env BASE_URL=http://host.docker.internal:4000 - < load-test/k6-script.js
 */

const BASE = __ENV.BASE_URL || 'http://localhost:4000';

console.log(`🌍 Target Base URL: ${BASE}`);

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '1m', target: 50 },  // Steady load
    { duration: '30s', target: 100 }, // Spike
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must be under 2s
  },
};

// 1. Setup Phase: Log in once to get the token
export function setup() {
  const loginUrl = `${BASE}/api/login`;
  const payload = JSON.stringify({
    email: 'admin@gmail.com',
    password: 'password123',
  });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(loginUrl, payload, params);

  check(res, {
    'logged in successfully': (r) => r.status === 200,
  });

  return { token: res.json().data.accessToken };
}

// 2. Main Test Loop
export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };

  // List of possible actions to take
  const actions = [
    { url: '/api/users', weight: 4 },
    { url: '/api/roles', weight: 3 },
    { url: '/api/brands', weight: 3 },
    { url: '/api/observability/delay?ms=500', weight: 1 }, // Slight delay
    { url: '/api/observability/error500', weight: 1 },    // Intentional error
  ];

  // Pick a random action based on weights
  const totalWeight = actions.reduce((sum, a) => sum + a.weight, 0);
  let random = Math.random() * totalWeight;
  let action = actions[0];

  for (const a of actions) {
    if (random < a.weight) {
      action = a;
      break;
    }
    random -= a.weight;
  }

  const res = http.get(`${BASE}${action.url}`, params);

  // We only check for 200 on non-error endpoints
  if (!action.url.includes('error500')) {
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  }

  // Sleep between requests to simulate real usage
  sleep(0.1 + Math.random() * 0.5);
}
