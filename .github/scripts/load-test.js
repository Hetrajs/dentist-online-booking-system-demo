import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: parseInt(__ENV.CONCURRENT_USERS) || 50 }, // Stay at target users
    { duration: '2m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.05'], // Error rate must be below 5%
    errors: ['rate<0.1'], // Custom error rate must be below 10%
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://your-site.vercel.app';

// Test scenarios
const scenarios = [
  { name: 'Homepage', url: '/', weight: 40 },
  { name: 'Services', url: '/services', weight: 20 },
  { name: 'About', url: '/about', weight: 15 },
  { name: 'Contact', url: '/contact', weight: 10 },
  { name: 'Book Appointment', url: '/book', weight: 15 },
];

export default function () {
  // Select random scenario based on weight
  const scenario = selectWeightedScenario(scenarios);
  
  const response = http.get(`${BASE_URL}${scenario.url}`, {
    headers: {
      'User-Agent': 'k6-load-test/1.0',
    },
  });

  // Check response
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
    'content contains expected text': (r) => {
      if (scenario.url === '/') return r.body.includes('dental') || r.body.includes('appointment');
      if (scenario.url === '/services') return r.body.includes('service') || r.body.includes('treatment');
      if (scenario.url === '/book') return r.body.includes('book') || r.body.includes('appointment');
      return true;
    },
  });

  errorRate.add(!success);

  // Simulate user reading time
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

function selectWeightedScenario(scenarios) {
  const totalWeight = scenarios.reduce((sum, scenario) => sum + scenario.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const scenario of scenarios) {
    random -= scenario.weight;
    if (random <= 0) {
      return scenario;
    }
  }
  
  return scenarios[0]; // Fallback
}

// Test appointment booking flow
export function bookingFlow() {
  const response1 = http.get(`${BASE_URL}/book`);
  check(response1, { 'booking page loads': (r) => r.status === 200 });
  
  sleep(2);
  
  // Simulate form interaction (GET availability)
  const response2 = http.get(`${BASE_URL}/api/availability?date=2024-12-01`);
  check(response2, { 'availability API works': (r) => r.status === 200 });
  
  sleep(1);
}
