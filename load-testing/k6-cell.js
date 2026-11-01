import http from "k6/http";
import { sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// ============================================================
// Load testing satu sel pengujian (RQ3).
//
// Dipanggil dengan dua variabel lingkungan:
//   TARGET_URL — alamat yang diuji
//   LABEL      — nama sel, dipakai untuk nama berkas hasil
//
// DUA METRIK DIPISAH — ini perbaikan dari pilot study:
//   http_errors  = persentase respons berstatus bukan 200
//   sla_breaches = persentase respons yang melebihi 3 detik
//
// Pada pilot study keduanya tercampur sehingga dilaporkan sebagai
// "error rate 100%", padahal server tetap merespons dengan benar dan
// hanya melampaui ambang waktu. Laporan seperti itu mudah dibantah.
//
// CATATAN CAKUPAN (Keputusan B):
// k6 hanya mengunduh dokumen HTML, tidak mengunduh gambar. Karena itu
// pengujian ini mengukur BIAYA GENERASI DOKUMEN DI SISI SERVER, bukan
// pengaruh beban media. Variasi beban media berdampak pada sisi klien
// dan diukur terpisah melalui Lighthouse.
// ============================================================

const SLA_MS = 3000;

const httpErrors = new Rate("http_errors");
const slaBreaches = new Rate("sla_breaches");
const docDuration = new Trend("document_duration");

const TARGET_URL = __ENV.TARGET_URL;
const LABEL = __ENV.LABEL || "unlabeled";

// Jumlah pengguna virtual untuk SATU pengukuran.
// Kolokium 8.2.1 menyebut 100, 500, dan 1000 pengguna simultan —
// itu TIGA pengukuran terpisah, bukan satu tanjakan panjang.
const VUS = Number(__ENV.VUS || 100);

// Durasi fase stabil. Sengaja tidak terlalu panjang: beban tinggi yang
// bertahan lama memicu proteksi otomatis platform, sehingga yang terukur
// bukan lagi kapasitas aplikasi melainkan ambang perlindungan Vercel.
const HOLD = __ENV.HOLD || "45s";

export const options = {
  scenarios: {
    load_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "15s", target: VUS },
        { duration: HOLD, target: VUS },
        { duration: "5s", target: 0 },
      ],
    },
  },
  // Ambang ini untuk PELAPORAN, bukan untuk menggugurkan pengujian.
  thresholds: {
    http_errors: [{ threshold: "rate<0.01", abortOnFail: false }],
    sla_breaches: [{ threshold: "rate<0.05", abortOnFail: false }],
  },
  summaryTrendStats: ["avg", "min", "med", "p(90)", "p(95)", "p(99)", "max"],
};

export default function () {
  const res = http.get(TARGET_URL, {
    headers: { "user-agent": "k6-mark0-loadtest" },
  });

  httpErrors.add(res.status !== 200);
  slaBreaches.add(res.timings.duration > SLA_MS);
  docDuration.add(res.timings.duration);

  sleep(1);
}

export function handleSummary(data) {
  const m = data.metrics;
  const get = (name, stat) => {
    const v = m[name] && m[name].values;
    return v ? v[stat] : null;
  };

  const ringkas = {
    label: LABEL,
    url: TARGET_URL,
    vus: VUS,
    total_requests: get("http_reqs", "count"),
    throughput_rps: get("http_reqs", "rate"),
    duration_avg_ms: get("http_req_duration", "avg"),
    duration_med_ms: get("http_req_duration", "med"),
    duration_p95_ms: get("http_req_duration", "p(95)"),
    duration_p99_ms: get("http_req_duration", "p(99)"),
    duration_max_ms: get("http_req_duration", "max"),
    http_error_rate: get("http_errors", "rate"),
    sla_breach_rate: get("sla_breaches", "rate"),
    data_received_bytes: get("data_received", "count"),
  };

  const baris = [
    "",
    `  ${LABEL}  @ ${VUS} VU`,
    `  total request     ${Math.round(ringkas.total_requests)}`,
    `  throughput        ${Math.round(ringkas.throughput_rps)} req/s`,
    `  durasi rata-rata  ${Math.round(ringkas.duration_avg_ms)} ms`,
    `  durasi median     ${Math.round(ringkas.duration_med_ms)} ms`,
    `  durasi p95        ${Math.round(ringkas.duration_p95_ms)} ms`,
    `  durasi maks       ${Math.round(ringkas.duration_max_ms)} ms`,
    `  error rate        ${(ringkas.http_error_rate * 100).toFixed(2)} %   (respons bukan 200)`,
    `  SLA breach rate   ${(ringkas.sla_breach_rate * 100).toFixed(2)} %   (respons > ${SLA_MS} ms)`,
    "",
  ].join("\n");

  return {
    stdout: baris,
    [`../results/k6/${LABEL}.json`]: JSON.stringify(ringkas, null, 2),
  };
}
