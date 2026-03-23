# Load Testing — mark0

Pengujian beban (load testing) menggunakan **k6** untuk mengukur kemampuan server menangani 1000 virtual users secara bersamaan.

## Prasyarat

### Install k6

```bash
# Windows (via winget)
winget install k6 --source winget

# Windows (via chocolatey)
choco install k6

# macOS
brew install k6
```

Verifikasi instalasi:

```bash
k6 version
```

---

## Persiapan Sebelum Test

### 1. Warm up cache di API Middleware

Pastikan API middleware sudah jalan (port 4000), lalu warm up cache agar data konsisten:

```bash
curl http://localhost:4000/cache/warmup
```

Output yang diharapkan:

```json
{ "message": "Cache warmed up", "cacheSize": 22, "timestamp": "..." }
```

### 2. Build Production (PENTING!)

Load testing harus dilakukan di **production build**, bukan dev server:

```bash
# React — build lalu serve
cd react-ecommerce
pnpm build
pnpm preview          # Jalan di http://localhost:4173

# Next.js — build lalu serve
cd nextjs-ecommerce
pnpm build
pnpm start            # Jalan di http://localhost:3000
```

> **Catatan**: `vite preview` default port-nya **4173** (bukan 5173). Sesuaikan URL di `k6-react.js` jika perlu.

---

## Menjalankan Load Test

### Test 1: API Middleware (port 4000)

```bash
cd load-testing
k6 run k6-middleware.js
```

### Test 2: React CSR (port 4173 production / 5173 dev)

```bash
cd load-testing
k6 run k6-react.js
```

### Test 3: Next.js SSR (port 3000)

```bash
cd load-testing
k6 run k6-nextjs.js
```

---

## Metrik yang Diukur

| Metrik | Penjelasan |
|---|---|
| **http_req_duration (avg)** | Rata-rata waktu respons |
| **http_req_duration (p95)** | 95% request selesai dalam waktu ini |
| **http_req_duration (p99)** | 99% request selesai dalam waktu ini |
| **http_reqs (rate)** | Throughput: request per detik |
| **errors (rate)** | Persentase request yang gagal |
| **home_page_duration** | Waktu respons halaman Home |
| **product_page_duration** | Waktu respons halaman Product Detail |

---

## Skenario Test

Kedua test (React & Next.js) menggunakan skenario **identik** untuk perbandingan fair:

```
0s-30s     → Warm up:    0 → 100 users
30s-1m30s  → Ramp up:  100 → 500 users
1m30s-2m30s → Peak:    500 → 1000 users
2m30s-4m30s → Sustain: 1000 users (2 menit)
4m30s-5m   → Cool down: 1000 → 0 users
```

Total durasi: **5 menit** per test.

---

## Output

Setelah test selesai, hasil disimpan otomatis:

- `results-react.json` — Hasil lengkap load test React
- `results-nextjs.json` — Hasil lengkap load test Next.js
- `results-middleware.json` — Hasil lengkap load test API Middleware

---

## Hipotesis

| Aspek | React (CSR) | Next.js (SSR) |
|---|---|---|
| **Home Page** | Cepat — server hanya kirim HTML kosong + JS | Bisa lebih lambat — server harus render React |
| **Product Detail** | Cepat — server hanya kirim HTML kosong + JS | Lambat — SSR render per request (no-store) |
| **Throughput** | Tinggi — server tidak bekerja berat | Lebih rendah — CPU server sibuk rendering |
| **Error Rate di Peak** | Rendah | Berpotensi lebih tinggi |

> **Catatan**: Hipotesis ini akan dibuktikan/dibantah oleh data hasil pengujian.
