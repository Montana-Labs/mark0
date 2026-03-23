import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");
const productsEndpoint = new Trend("products_endpoint_duration");
const productByIdEndpoint = new Trend("product_by_id_endpoint_duration");

// ============================================================
// Skenario: 1000 Virtual Users mengakses API Middleware
// Test ini memastikan middleware bisa handle beban dari
// kedua frontend (React + Next.js) secara bersamaan
// ============================================================
export const options = {
  scenarios: {
    load_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 100 },
        { duration: "1m", target: 500 },
        { duration: "1m", target: 1000 },
        { duration: "2m", target: 1000 },
        { duration: "30s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    errors: ["rate<0.05"],
  },
};

const API_URL = "http://localhost:4000";

export default function () {
  // 1. GET /products (list semua produk)
  const productsRes = http.get(`${API_URL}/products`);
  productsEndpoint.add(productsRes.timings.duration);
  check(productsRes, {
    "products: status 200": (r) => r.status === 200,
    "products: has data": (r) => JSON.parse(r.body).length > 0,
    "products: response < 2s": (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);

  sleep(0.5);

  // 2. GET /products/:id (detail produk random)
  const productId = Math.floor(Math.random() * 20) + 1;
  const productRes = http.get(`${API_URL}/products/${productId}`);
  productByIdEndpoint.add(productRes.timings.duration);
  check(productRes, {
    "product: status 200": (r) => r.status === 200,
    "product: has title": (r) => JSON.parse(r.body).title !== undefined,
    "product: response < 2s": (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);

  sleep(0.5);
}

export function handleSummary(data) {
  return {
    "results-middleware.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const metrics = data.metrics;
  return `
=== API MIDDLEWARE LOAD TEST RESULTS ===
Total Requests:    ${metrics.http_reqs?.values?.count || "N/A"}
Avg Duration:      ${Math.round(metrics.http_req_duration?.values?.avg || 0)}ms
P95 Duration:      ${Math.round(metrics.http_req_duration?.values?.["p(95)"] || 0)}ms
P99 Duration:      ${Math.round(metrics.http_req_duration?.values?.["p(99)"] || 0)}ms
Max Duration:      ${Math.round(metrics.http_req_duration?.values?.max || 0)}ms
Error Rate:        ${((metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%
Throughput:        ${Math.round(metrics.http_reqs?.values?.rate || 0)} req/s
`;
}
