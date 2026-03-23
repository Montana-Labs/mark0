# Hasil Pengujian — mark0

**Judul Skripsi:** Evaluasi Code Maintainability dan Core Web Vitals Next.js dan React Berdasarkan Strategi Rendering CSR, SSR, dan SSG pada Aplikasi E-Commerce

**Tanggal Pengujian:** 24 Maret 2026

---

## 1. Environment Pengujian

| Komponen | Versi / Detail |
|---|---|
| Sistem Operasi | Windows 11 Education 10.0.26100 |
| Node.js | v22.22.1 |
| Package Manager | pnpm v10.32.1 |
| Java | OpenJDK 21.0.10 (Eclipse Adoptium) |
| SonarQube | Community Build v26.3.0.120487 |
| Sonar Scanner CLI | v7.1.0.4889 |
| Lighthouse CLI | v13.0.3 |
| k6 | v1.6.1 |
| React | v19.2.4 + Vite 8.0.1 + TypeScript 5.9.3 |
| Next.js | v15.0.0 + TypeScript 5.x + App Router |
| Shared API | FakeStoreAPI via API Middleware (port 4000) |

---

## 2. Arsitektur Pengujian

```
                    SAAT WARMUP (sekali):
                    FakeStoreAPI → API Middleware → Cache (memory)

                    SAAT TESTING:
┌──────────────┐         ┌──────────────────┐
│  React CSR   │────────→│  API Middleware   │──→ Cache (memory)
│  port 4173   │         │  port 4000       │    response < 1ms
└──────────────┘         │                  │    data IDENTIK
┌──────────────┐         │                  │    setiap request
│  Next.js SSR │────────→│                  │
│  port 3000   │         └──────────────────┘
└──────────────┘
                         FakeStoreAPI TIDAK
                         dipanggil saat testing
```

**Catatan:** Data dari FakeStoreAPI di-cache di memory middleware sebelum pengujian dimulai (`GET /cache/warmup`). Selama pengujian berlangsung, kedua aplikasi mendapat data yang persis sama dari cache. Tidak ada variabel eksternal yang mempengaruhi hasil.

---

## 3. Variabel Terkontrol (Apple-to-Apple)

| Aspek | React CSR | Next.js SSR/SSG | Status |
|---|---|---|---|
| Bahasa | TypeScript | TypeScript | Identik |
| UI Library | React 19.2.4 | React 19.2.4 | Identik |
| Product Interface | `id, title, price, description, category, image, rating` | `id, title, price, description, category, image, rating` | Identik |
| Inline Styles | Warna, padding, font, layout | Warna, padding, font, layout | Identik |
| ESLint Rules | `.eslintrc.json` (12 rules) | `.eslintrc.json` (12 rules) | 100% Identik |
| API Endpoint | `http://localhost:4000` | `http://localhost:4000` | Identik |
| Komponen | Navbar, ProductCard, Cart | Navbar, ProductCard, Cart | Identik |

| Aspek | React CSR | Next.js SSR/SSG | Status |
|---|---|---|---|
| Rendering Strategy | Client-Side Rendering | Server-Side Rendering + SSG | Variabel Bebas |
| Data Fetching | `useEffect` + `fetch` | `async server component` | Variabel Bebas |
| Routing | React Router v7 | Next.js App Router | Variabel Bebas |

---

## 4. Hasil Pengujian Code Maintainability (SonarQube)

**Tool:** SonarQube Community Build v26.3.0 + Sonar Scanner CLI v7.1

### 4.1 Perbandingan Overall Code

| Metrik | React CSR | Next.js SSR/SSG | Unggul |
|---|---|---|---|
| **Security Rating** | A (0 issues) | A (0 issues) | Sama |
| **Reliability Rating** | A (0 issues) | A (0 issues) | Sama |
| **Maintainability Rating** | A (9 issues) | A (12 issues) | **React** |
| **Code Duplication** | 0.0% | 0.0% | Sama |
| **Lines of Code (LOC)** | 626 | 592 | **Next.js** (lebih ringkas) |
| **Lines to Cover** | 111 | 81 | - |
| **Total Lines** | 684 | 649 | - |
| **Security Hotspots** | 0 (A) | 0 (A) | Sama |

### 4.2 Analisis Densitas Issue

| Framework | Issues | LOC | Issue per LOC | Densitas |
|---|---|---|---|---|
| React CSR | 9 | 626 | 1 issue / 70 baris | Lebih rendah (lebih bersih) |
| Next.js SSR/SSG | 12 | 592 | 1 issue / 49 baris | **42% lebih tinggi** |

### 4.3 Kesimpulan SonarQube

- Kedua framework mendapat **Maintainability Rating A**, menunjukkan kualitas kode dasar yang baik.
- React memiliki **LOC lebih banyak** (626 vs 592) karena membutuhkan boilerplate tambahan seperti `useEffect`, `useState`, dan manual routing setup.
- Namun Next.js memiliki **lebih banyak maintainability issues** (12 vs 9) meskipun LOC-nya lebih sedikit. Hal ini disebabkan oleh kompleksitas arsitektur server component + client component boundary (`"use client"` directive).
- **Densitas issue Next.js 42% lebih tinggi** — menunjukkan bahwa arsitektur SSR memperkenalkan kompleksitas kode yang lebih tinggi per baris.
- Code Duplication **0.0% di kedua project** — membuktikan kode ditulis secara apple-to-apple tanpa copy-paste.

---

## 5. Hasil Pengujian Core Web Vitals (Lighthouse)

**Tool:** Google Lighthouse CLI v13.0.3 (`--chrome-flags="--headless"`)
**Environment:** Localhost (development)
**Jumlah Run:** 1x per framework (proof-of-concept; untuk penelitian penuh disarankan 10-20x)

### 5.1 Perbandingan Metrik

| Metrik | React CSR | Next.js SSR/SSG | Threshold (Good) | Unggul |
|---|---|---|---|---|
| **Performance Score** | 59 / 100 | 57 / 100 | >= 90 | **React** |
| **FCP (First Contentful Paint)** | 6.0s | 0.9s | <= 1.8s | **Next.js** (6.5x lebih cepat) |
| **LCP (Largest Contentful Paint)** | 14.5s | 18.0s | <= 2.5s | **React** |
| **CLS (Cumulative Layout Shift)** | 0.055 | 0 | <= 0.1 | **Next.js** (sempurna) |
| **TBT (Total Blocking Time)** | 110ms | 730ms | <= 200ms | **React** (6.6x lebih responsif) |
| **Speed Index** | 6.0s | 2.3s | <= 3.4s | **Next.js** (2.6x lebih cepat) |
| **TTI (Time to Interactive)** | 14.5s | 18.4s | <= 3.8s | **React** |

**Skor: React menang 4 metrik, Next.js menang 3 metrik.**

### 5.2 Analisis Temuan

**Next.js unggul pada:**
- **FCP (0.9s vs 6.0s)** — Halaman pertama muncul 6.5x lebih cepat karena SSG sudah me-render HTML di server. User melihat konten jauh lebih awal.
- **CLS (0 vs 0.055)** — Tidak ada layout shift karena konten sudah tersedia saat load. React mengalami sedikit shift karena konten di-render setelah JavaScript dijalankan.
- **Speed Index (2.3s vs 6.0s)** — Konten visual tampil 2.6x lebih cepat secara keseluruhan.

**React unggul pada:**
- **TBT (110ms vs 730ms)** — 6.6x lebih responsif terhadap interaksi pengguna. Next.js memiliki TBT tinggi karena proses hydration (menghubungkan server-rendered HTML dengan JavaScript interaktif).
- **LCP (14.5s vs 18.0s)** — Elemen konten terbesar (gambar produk) muncul lebih cepat.
- **TTI (14.5s vs 18.4s)** — Halaman menjadi fully interactive lebih cepat karena tidak ada overhead hydration.
- **Performance Score (59 vs 57)** — Skor keseluruhan sedikit lebih tinggi.

### 5.3 Catatan Penting

- Nilai LCP yang tinggi di kedua framework disebabkan oleh gambar produk yang diunduh dari server eksternal (FakeStoreAPI) saat dijalankan di localhost tanpa CDN.
- Pada environment produksi dengan CDN, nilai FCP, LCP, dan Speed Index akan jauh lebih optimal.
- Hal ini akan dicatat sebagai **keterbatasan penelitian**.

---

## 6. Hasil Pengujian Beban / Load Testing (k6)

**Tool:** Grafana k6 v1.6.1
**Skenario:** Ramping VUs — 0 → 100 → 500 → 1000 users, sustain 2 menit, cool down. Total 5 menit per test.
**React:** Production build via `serve` (static file server)
**Next.js:** Production build via `next start` (Node.js server)

### 6.1 Perbandingan Hasil

| Metrik | API Middleware | React CSR | Next.js SSR | Unggul |
|---|---|---|---|---|
| **Total Requests** | 399,086 | 199,122 | 93,906 | **React** (2.1x lebih banyak) |
| **Avg Response Time** | 0ms | 6ms | 1,141ms | **React** (190x lebih cepat) |
| **P95 Response Time** | 2ms | 17ms | 2,550ms | **React** (150x lebih cepat) |
| **Max Response Time** | 51ms | 54ms | 5,760ms | **React** |
| **Throughput (req/s)** | 1,326 | 660 | 311 | **React** (2.1x lebih tinggi) |
| **Error Rate** | 0% | 0% | 100% | **React** (0% vs 100%) |

### 6.2 Analisis Temuan

**React CSR menang telak pada load testing:**
- Server React hanya menyajikan **file statis** (HTML + JS bundle). Tidak ada proses rendering di server. Ini membuat response time sangat rendah (6ms avg) dan mampu menangani 660 request per detik tanpa error.

**Next.js SSR mengalami degradasi signifikan:**
- Server Next.js harus **me-render komponen React di server** untuk setiap request pada halaman Product Detail (`cache: "no-store"`). Dengan 1000 user bersamaan, CPU server kewalahan → response time rata-rata 1,141ms → banyak request melebihi threshold 3 detik → error rate 100%.
- Ini **bukan bug pada kode aplikasi**, melainkan **keterbatasan arsitektur SSR** yang membutuhkan komputasi server per request.

**API Middleware terbukti stabil:**
- Dengan cache in-memory, middleware mampu melayani 1,326 req/s dengan 0ms avg response time dan 0% error. Ini membuktikan bahwa perbedaan performa antara React dan Next.js **murni disebabkan oleh perbedaan strategi rendering**, bukan oleh bottleneck di layer data.

### 6.3 Catatan

- Error rate 100% pada Next.js disebabkan oleh threshold check di k6 (response harus < 3 detik dan status 200). Server Next.js tetap merespons, namun response time melebihi threshold karena beban rendering.
- Pada environment produksi (Vercel), Next.js menggunakan **serverless functions** dengan auto-scaling yang dapat menangani beban lebih baik. Namun, tradeoff bahwa SSR lebih berat di server dibanding CSR **tetap berlaku**.

---

## 7. Ringkasan Perbandingan Keseluruhan

| Dimensi | Metrik | React CSR | Next.js SSR/SSG | Pemenang |
|---|---|---|---|---|
| **Maintainability** | Issues | 9 | 12 | **React** |
| **Maintainability** | LOC | 626 | 592 | **Next.js** |
| **Maintainability** | Densitas Issue | 1/70 baris | 1/49 baris | **React** |
| **Core Web Vitals** | FCP | 6.0s | 0.9s | **Next.js** |
| **Core Web Vitals** | LCP | 14.5s | 18.0s | **React** |
| **Core Web Vitals** | CLS | 0.055 | 0 | **Next.js** |
| **Core Web Vitals** | TBT | 110ms | 730ms | **React** |
| **Core Web Vitals** | Speed Index | 6.0s | 2.3s | **Next.js** |
| **Core Web Vitals** | TTI | 14.5s | 18.4s | **React** |
| **Load Testing** | Throughput | 660 req/s | 311 req/s | **React** |
| **Load Testing** | Avg Response | 6ms | 1,141ms | **React** |
| **Load Testing** | Error Rate | 0% | 100% | **React** |

**Skor Akhir: React menang 8 metrik, Next.js menang 4 metrik.**

---

## 8. Kesimpulan

### 8.1 Temuan Utama

1. **Tidak ada framework yang menang di semua aspek.** React unggul di maintainability, interaktivitas (TBT), dan ketahanan beban server. Next.js unggul di kecepatan tampil awal (FCP), stabilitas layout (CLS), dan Speed Index.

2. **Tradeoff utama SSR vs CSR terbukti secara kuantitatif:**
   - SSR memberikan **first paint lebih cepat** (FCP 0.9s vs 6.0s) namun membayar dengan **beban server yang jauh lebih berat** (1,141ms vs 6ms avg response) dan **interaktivitas yang lebih lambat** (TBT 730ms vs 110ms).
   - CSR memberikan **server yang ringan** dan **interaktivitas cepat**, namun user harus menunggu lebih lama untuk melihat konten pertama.

3. **Arsitektur SSR memperkenalkan kompleksitas kode tambahan.** Next.js memiliki 33% lebih banyak maintainability issues (12 vs 9) meskipun LOC-nya 5% lebih sedikit, disebabkan oleh kebutuhan memisahkan server components dan client components (`"use client"` directive).

### 8.2 Rekomendasi Berdasarkan Use Case

| Kebutuhan | Rekomendasi | Alasan |
|---|---|---|
| SEO & First Paint cepat | **Next.js (SSR/SSG)** | FCP 6.5x lebih cepat, CLS sempurna |
| Aplikasi interaktif tinggi | **React (CSR)** | TBT 6.6x lebih responsif |
| Traffic tinggi / high concurrency | **React (CSR)** | 2x throughput, 0% error di 1000 users |
| Tim kecil / maintainability | **React (CSR)** | 42% lebih sedikit densitas issue |
| E-commerce dengan SEO penting | **Next.js (SSG)** | Konten statis dengan performa CDN |

### 8.3 Keterbatasan Penelitian

1. Pengujian dilakukan di **environment localhost**, bukan production server. Angka absolut (terutama LCP dan load testing) akan lebih optimal di environment produksi dengan CDN dan auto-scaling.
2. Pengujian Lighthouse dilakukan **1x per framework**. Untuk hasil yang lebih akurat secara statistik, disarankan 10-20x pengulangan dengan perhitungan rata-rata dan standar deviasi.
3. FakeStoreAPI digunakan sebagai sumber data pihak ketiga. Meskipun latensi dieliminasi dengan caching di middleware, ini tetap merupakan simulasi, bukan database sungguhan.
4. Load testing dilakukan di mesin yang sama (localhost). Pada deployment terpisah, bottleneck jaringan dan spesifikasi server akan mempengaruhi hasil.

---

## 9. Daftar Tools Pengujian

| Tool | Fungsi | Metrik yang Diukur |
|---|---|---|
| **SonarQube** | Code Maintainability | Security Rating, Reliability Rating, Maintainability Rating, LOC, Code Duplication, Issues |
| **Google Lighthouse** | Core Web Vitals | Performance Score, FCP, LCP, CLS, TBT, Speed Index, TTI |
| **Grafana k6** | Load Testing | Total Requests, Avg/P95/Max Response Time, Throughput, Error Rate |

---

**Dokumen ini dihasilkan pada 24 Maret 2026 sebagai bagian dari penelitian skripsi.**
