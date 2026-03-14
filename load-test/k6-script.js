/**
 * k6 load test – 5000+ requests, concurrent users, traffic spike.
 * Run: k6 run load-test/k6-script.js
 * Install k6: https://k6.io/docs/get-started/installation/
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:4000';

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '2m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const res = http.get(`${BASE}/health`);
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(0.5 + Math.random());
}
