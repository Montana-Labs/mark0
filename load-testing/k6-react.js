import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const homePage = new Trend("home_page_duration");
const productPage = new Trend("product_page_duration");

// ============================================================
// Skenario: 1000 Virtual Users mengakses React (CSR) App
// React CSR: server hanya kirim HTML kosong + JS bundle
// Rendering terjadi di browser client, BUKAN di server
// ============================================================
export const options = {
  scenarios: {
    // Skenario 1: Ramp up bertahap sampai 1000 VUs
    load_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 100 },   // Warm up: 0 → 100 users
        { duration: "1m", target: 500 },     // Ramp up: 100 → 500 users
        { duration: "1m", target: 1000 },    // Peak: 500 → 1000 users
        { duration: "2m", target: 1000 },    // Sustain: 1000 users selama 2 menit
        { duration: "30s", target: 0 },      // Cool down
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<3000"],  // 95% request harus < 3 detik
    errors: ["rate<0.1"],               // Error rate harus < 10%
  },
};

const REACT_URL = "http://localhost:5173";

export default function () {
  // 1. Akses Home Page
  const homeRes = http.get(`${REACT_URL}/`);
  homePage.add(homeRes.timings.duration);
  check(homeRes, {
    "home: status 200": (r) => r.status === 200,
    "home: response < 3s": (r) => r.timings.duration < 3000,
  }) || errorRate.add(1);

  sleep(1);

  // 2. Akses Product Detail (random product ID 1-20)
  const productId = Math.floor(Math.random() * 20) + 1;
  const productRes = http.get(`${REACT_URL}/product/${productId}`);
  productPage.add(productRes.timings.duration);
  check(productRes, {
    "product: status 200": (r) => r.status === 200,
    "product: response < 3s": (r) => r.timings.duration < 3000,
  }) || errorRate.add(1);

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results-react.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const metrics = data.metrics;
  return `
=== REACT (CSR) LOAD TEST RESULTS ===
Total Requests:    ${metrics.http_reqs?.values?.count || "N/A"}
Avg Duration:      ${Math.round(metrics.http_req_duration?.values?.avg || 0)}ms
P95 Duration:      ${Math.round(metrics.http_req_duration?.values?.["p(95)"] || 0)}ms
P99 Duration:      ${Math.round(metrics.http_req_duration?.values?.["p(99)"] || 0)}ms
Max Duration:      ${Math.round(metrics.http_req_duration?.values?.max || 0)}ms
Error Rate:        ${((metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%
Throughput:        ${Math.round(metrics.http_reqs?.values?.rate || 0)} req/s
`;
}
