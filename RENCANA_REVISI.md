# 📌 Rencana Revisi — Menyelaraskan mark0 dengan Judul Kolokium

> **Dibuat:** 27 Oktober 2026
> **Status:** P1-6 ✅ · P0-1 ✅ · P0-2 ✅ · P0-3 🟡 (gambar selesai, video menunggu Keputusan A). Berikutnya: **P0-4 (deploy Vercel sin1)**.
> **Tujuan dokumen:** satu sumber kebenaran tentang apa yang masih harus diperbaiki agar project `mark0` sesuai judul & metodologi di `kolokium.pdf`. Dibaca ulang setiap kali melanjutkan pekerjaan.

**Dokumen pasangan:** `LANGKAH_UPGRADE.md` — runbook perintah upgrade dependency + kebersihan cache (eksekusi P1-6 ada di sana).

---

## 0. Konteks: judulnya sudah berubah

| | Dokumen lama di `mark0/` (24 Mar 2026) | **Kolokium (yang berlaku)** |
|---|---|---|
| Judul | Evaluasi **Code Maintainability dan Core Web Vitals** Next.js dan React Berdasarkan Strategi Rendering CSR, SSR, dan SSG pada Aplikasi E-Commerce | Evaluasi Strategi Rendering React dan Next.js pada E-Commerce dengan **Variasi Beban Media** Menggunakan Core Web Vitals |
| Variabel utama | maintainability + CWV | **variasi beban media** |
| Maintainability / SonarQube | fokus utama | **analisis sekunder** (Batasan Masalah #6) |

Semua `.md` di folder ini masih memakai framing lama. Kodenya pun belum punya variabel beban media.

**Identitas:** NIM 71220843 · Prodi Informatika, Fakultas Teknologi Informasi, UKDW Yogyakarta · Proposal Desk Evaluation I, Semester Genap 2025/2026 · Repo: https://github.com/Montana-Labs/mark0

---

## 1. Desain eksperimen yang DITUJU

Grid final: **3 strategi rendering × 3 tier beban media = 9 sel**, halaman identik di semua sel.

| | Light (50–150 KB) | Medium (200–800 KB) | Heavy (1–3 MB) |
|---|---|---|---|
| **CSR** (React + Vite) | sel 1 | sel 2 | sel 3 |
| **SSG** (Next.js `/ssg`) | sel 4 | sel 5 | sel 6 |
| **SSR** (Next.js `/ssr`) | sel 7 | sel 8 | sel 9 |

Tiap sel dijalankan **15x** Lighthouse → 135 run → raw data per-run disimpan → baru bisa uji statistik.

---

# 🔴 P0 — Blocking. Tanpa ini skripsi tidak defensible.

## [x] ✅ P0-1. Pisahkan SSR dan SSG ke halaman yang IDENTIK — **SELESAI 28 Okt 2026**

**Masalah:** sekarang SSG diukur di Home (20 gambar), SSR diukur di Product Detail (1 gambar).
Jadi selisih yang terukur adalah **selisih halaman**, bukan selisih strategi rendering. Rumusan Masalah #1 dan uji ANOVA di bagian 8.3 jadi tidak valid.

**Yang dikerjakan:**
- [ ] Buat `nextjs-ecommerce/app/ssg/page.tsx` — katalog, `cache: "force-cache"`
- [ ] Buat `nextjs-ecommerce/app/ssr/page.tsx` — katalog **identik**, `cache: "no-store"` + `export const dynamic = "force-dynamic"`
- [ ] Pastikan React CSR (`/`) merender katalog yang sama persis
- [ ] Komponen, inline style, jumlah produk, urutan produk → identik di 3 route

**Kriteria selesai (bukti untuk Bab 4):**
- [ ] `pnpm build` di `nextjs-ecommerce` → screenshot output: `/ssg` bertanda static (`○`/`●`), `/ssr` bertanda dynamic (`ƒ`)
- [ ] ⚠️ Jangan percaya directive saja. Build output adalah buktinya.

---

## [x] ✅ P0-2. Matikan lazy-load pada LCP candidate — **SELESAI 28 Okt 2026**

**Masalah:** di **kedua** `ProductCard.tsx` semua gambar pakai `loading="lazy"`.
Akibatnya gambar di bawah fold tidak pernah diunduh saat Lighthouse jalan → **ganti tier media dari 50KB ke 3MB hampir tidak mengubah metrik**. Variabel utama penelitian jadi tidak terukur. Ini juga penyebab LCP aneh di pilot study (14,5s & 18,0s).

**Yang dikerjakan:**
- [ ] Gambar pertama (LCP candidate): `loading="eager"` + `fetchpriority="high"`
- [ ] Sisanya tetap `loading="lazy"`
- [ ] **Identik di React dan Next.js** — ini variabel terkontrol, bukan optimasi sepihak

File:
- `react-ecommerce/src/components/ProductCard.tsx`
- `nextjs-ecommerce/components/ProductCard.tsx`

---

## [~] 🟡 P0-3. Implementasi variasi beban media — **GAMBAR SELESAI 28 Okt 2026, video menunggu Keputusan A**

**Masalah:** `api-middleware/public/` cuma berisi `.gitkeep`. Gambar masih hotlink ke `fakestoreapi.com/img/...` dengan ukuran apa adanya. **Variabel utama judul baru belum ada wujudnya.**

Tidak boleh pakai fakestoreapi karena: (a) ukurannya tidak bisa dikontrol ke rentang 50–150KB / 200–800KB / 1–3MB, (b) latensi CDN eksternal = variabel liar, (c) tidak ada jaminan dua app menerima byte yang sama.

**Struktur aset:**
```
api-middleware/public/media/
├── light/    img-01..20.jpg   (50–150 KB)   + vid-light.mp4   (1–5 MB)
├── medium/   img-01..20.jpg   (200–800 KB)  + vid-medium.mp4  (5–15 MB)
└── heavy/    img-01..20.jpg   (1–3 MB)      + vid-heavy.mp4   (15–50 MB)
```

**Aturan wajib:** ketiga tier harus berasal dari **satu gambar sumber yang sama**, hanya beda resize/kompresi. Kalau isi gambarnya beda, yang terukur bukan cuma ukuran byte.

**Yang dikerjakan:**
- [x] Generator dibuat: `scripts/generate-media.py` (Pillow). Satu sumber per produk → 3 tier, pencarian kualitas JPEG otomatis agar masuk rentang target
- [x] 60 gambar ter-generate, **60/60 masuk rentang**:

  | Tier | Target | Aktual | Rata-rata |
  |---|---|---|---|
  | light | 50–150 KB | 97,2 – 103,0 KB | 100,2 KB |
  | medium | 200–800 KB | 480,6 – 518,0 KB | 490,9 KB |
  | heavy | 1–3 MB | 2085,5 – 2110,9 KB | 2097,5 KB |

- [x] Ukuran aktual tiap file tercatat di `media-manifest.csv` → bahan tabel Bab 3
- [ ] ⚠️ **KEPUTUSAN TERBUKA: gambar saat ini SINTETIS, bukan foto produk asli.** Script mendukung sumber asli — taruh `01.jpg`..`20.jpg` di folder `media-source/` lalu jalankan ulang. Kalau tetap sintetis, **wajib dinyatakan di Bab 3** sebagai keterbatasan penelitian
- [ ] Video: menunggu **Keputusan A**
- [x] ⚠️ **KOREKSI (sudah diterapkan):** jangan pakai query param `?media=`. Halaman **SSG dibekukan saat build**, jadi query param tidak berpengaruh — hanya jalan untuk CSR dan SSR. Supaya ketiga strategi simetris, tier ditentukan lewat **env var saat build**: `MEDIA_TIER` (Next.js) dan `VITE_MEDIA_TIER` (Vite)
- [x] Konsekuensi: **9 build terpisah**, dan `rm -rf .next` wajib antar tier (detail di `LANGKAH_UPGRADE.md` §7)
- [x] Middleware rewrite field `image` produk sesuai tier yang diminta + `express.static` untuk `public/`
- [x] Default tier kalau env kosong/tidak valid: `light` (terverifikasi)
- [x] ⚠️ **Jangan commit aset media** ke git (>200 MB). Commit skrip generate-nya + tabel ukuran file
- [ ] Tabel ukuran file aktual → masuk Bab 3 sebagai bukti tier valid

File: `api-middleware/src/index.ts`, `api-middleware/src/data/products.json`

---

## [ ] P0-4. Deployment: sekarang MATI, dan bukan di platform yang dijanjikan

**Masalah:**
- Kode menunjuk ke `https://mark0-middleware.onrender.com` (lihat `nextjs-ecommerce/app/page.tsx`, `react-ecommerce/.env`). **Dites 27 Okt 2026: timeout, tidak ada respons setelah 25 detik.**
- Kolokium 8.1.1 menjanjikan **Vercel Hobby, region Singapore (sin1)** — bukan Render.
- Risiko paling serius: kalau middleware di free tier jadi **bottleneck bersama**, hasil load testing tidak lagi mengukur strategi rendering → seluruh perbandingan server-side runtuh.

**Yang dikerjakan:**
- [ ] Deploy `api-middleware` ke Vercel, region `sin1`
- [ ] Deploy `react-ecommerce` ke Vercel, region `sin1`
- [ ] Deploy `nextjs-ecommerce` ke Vercel, region `sin1`
- [ ] Hapus hardcode Render; semua lewat env var
- [ ] `load-testing/k6-nextjs.js` masih hardcode `http://localhost:3000` → ubah ke `__ENV.NEXTJS_URL`
- [ ] `load-testing/k6-react.js` default `localhost:4173` → arahkan ke URL produksi
- [ ] Verifikasi: `curl <middleware>/health` balas 200 dengan cepat sebelum ambil data
- [ ] Catat spesifikasi & region di Bab 3

---

# 🟡 P1 — Harus beres SEBELUM ambil data final

## [ ] P1-5. Repeated trials + uji statistik yang sesungguhnya

**Masalah:** kolokium janji **10–20x per skenario** + **ANOVA/Kruskal-Wallis + post-hoc** (bagian 8.3). Yang ada: **1x run**, hanya rata-rata.

⚠️ Tanpa raw data per-run tidak ada standar deviasi, dan **tanpa SD tidak ada ANOVA**.

**Yang dikerjakan:**
- [ ] Script runner: 9 sel × 15 run, simpan **tiap run**
  ```
  results/raw/{strategy}_{tier}_{run}.json
  results/metrics.csv        # 135 baris, 1 baris = 1 run
  ```
- [ ] Mode production, bukan dev server
- [ ] Warmup middleware (`GET /cache/warmup`) sebelum tiap batch
- [ ] Statistik deskriptif: mean, SD, min, max per sel
- [ ] Urutan uji: **Shapiro-Wilk** (normalitas) → **Levene** (homogenitas varians) → lolos: **ANOVA + Tukey** / tidak lolos: **Kruskal-Wallis + Dunn**
- [ ] Laporkan juga uji untuk faktor beban media (RQ2), bukan cuma faktor rendering (RQ1)

---

## [x] ✅ P1-6. Selaraskan versi + PATCH kerentanan keamanan — **SELESAI 27 Okt 2026** (commit `7a723b0`)

> ⚠️ **Diperbarui 27 Okt 2026 setelah audit dependency.** Bagian ini berubah total.

### Versi yang terpasang sekarang (hasil `pnpm-lock.yaml`)

| Paket | Terpasang | Status |
|---|---|---|
| `next` | **15.5.14** | ❌ terdampak 28 advisory, termasuk **3 critical** |
| `react` / `react-dom` | 19.2.4 | ✅ tidak ada advisory |
| `react-router-dom` | 7.13.1 | ❌ 9 advisory (6 high) — sebagian besar mode RSC/server yang tidak dipakai SPA ini; yang relevan untuk klien: open redirect via backslash di `<Link>`/`useNavigate` (GHSA-wrjc-x8rr-h8h6) |
| `vite` | 8.0.1 | ⚠️ 10 advisory — **dev server saja**, tidak kena build produksi |
| `express` (middleware) | 4.22.1 | ❌ 1 critical (`proxy-addr`), 2 high |

Ringkasan `pnpm audit` per 27 Okt 2026:

| Project | critical | high | moderate | low |
|---|---|---|---|---|
| `nextjs-ecommerce` | **3** | 36 | 22 | 2 |
| `react-ecommerce` | 0 | 33 | 21 | 3 |
| `api-middleware` | **1** | 2 | 3 | 1 |

### Insiden 14 Oktober 2026 (out-of-band security release Next.js)

Tiga kerentanan, dua critical, **dipatch di `15.5.28` dan `16.4.1`**:

| Advisory | Severity | Syarat terdampak | App ini? |
|---|---|---|---|
| GHSA-673q-mjm6-r5xr — RCE via `use cache` | Critical | App Router + Cache Components | tidak dipakai |
| CVE-2026-96889 / GHSA-2464-fhr4-w9xw — RCE Image Optimization (SVG) | Critical | Image Optimization API, glibc Linux | `next/image` tidak dipakai |
| GHSA-p3m5-59mp-jv5r — DoS Server Actions | High | App Router + minimal 1 Server Action | tidak ada Server Action |

Sudah diverifikasi lewat grep: project ini **tidak memakai** `"use server"`, `use cache`, `next/image`, maupun `dangerouslyAllowSVG`. Jadi secara praktik ketiganya sulit dieksploitasi di sini. **Tapi versinya tetap tercatat terdampak** — dan `15.5.14` juga ketinggalan ~25 advisory lain dari rilis 15.5.16 / .18 / .21 / .24 / .27.

Catatan akurasi: advisory React (GHSA-xqc2-xf4c-x3h3, GHSA-h3gv-c5rc-p453) menyasar paket **`react-server-dom-*`**, bukan `react`/`react-dom`. Next.js mem-*vendor* paket itu di dalamnya, jadi **perbaikannya datang dari upgrade `next`, bukan upgrade `react`**. Lockfile di sini nol entri `react-server-dom` → app CSR tidak terdampak.

### 🔥 Masalah untuk skripsi: versi yang dijanjikan ke dosen pun sudah rentan

Batasan Masalah #5 menulis **Next.js 16.2.1**. Tapi patch-nya ada di **16.4.1** — artinya **16.2.1 juga terdampak advisory 14 Okt 2026.**

**Keputusan: target `next@16.4.3`** (rilis terbaru line 16.4; patch minimum-nya 16.4.1 — bukan 16.2.1), lalu amandemen satu baris di proposal:
> "Versi Next.js yang digunakan adalah 16.4.3, yaitu rilis ter-patch pada saat pengambilan data. Versi 16.2.1 yang disebut pada proposal awal terdampak security advisory 14 Oktober 2026."

Ini justru **memperkuat** posisi di sidang — menunjukkan kesadaran versi, bukan kelalaian.

### Yang dikerjakan

- [x] `next` → **16.4.3** (rilis terbaru di line 16.4; 16.4.1 adalah patch minimum. Alternatif kalau mau tetap di 15.x: **15.5.28**, dist-tag `backport`)
- [x] `react` / `react-dom` → **TETAP 19.2.4, jangan diupgrade.** Tidak ada advisory, dan versinya **harus identik di kedua app** (variabel terkontrol). Sudah dicek: peer deps `next@16.4.1` menerima `react: ^19.0.0` → aman, tidak ada paksaan bump
- [x] `react-router-dom` → **7.18.4** (latest). Alasannya BUKAN demi fairness (Next.js pakai App Router sendiri = variabel bebas), tapi demi **validitas internal**: ganti versi mengubah ukuran bundle, jadi harus dibekukan sebelum ambil data
- [x] `express` di middleware → versi ter-patch (`proxy-addr` >= 2.0.8)
- [ ] `vite` → 8.1.6+ (opsional; dev-server only, tidak mempengaruhi hasil pengukuran)
- [ ] ⚠️ **Upgrade KEDUA sisi, jangan cuma Next.js.** Kalau hanya satu sisi dipatch, apple-to-apple-nya rusak
- [ ] ⚠️ `react-router` versi baru bisa mengubah **ukuran bundle** → berpengaruh ke metrik. Catat ukuran bundle sebelum & sesudah
- [x] **Pin versi eksak** (buang `^`) di ketiga `package.json` sebelum ambil data final — demi reproducibility
- [x] Setelah upgrade, **verifikasi ulang P0-1** lewat build output: `/ssg` tetap static, `/ssr` tetap dynamic. Perilaku caching berubah antar mayor version
- [x] Simpan output `pnpm audit` + tanggalnya sebagai lampiran
- [ ] Selaraskan `engines.node`: `HASIL_TESTING.md` catat Node v22.22.1, `api-middleware/package.json` masih `20.x`

### ⚠️ Urutan itu penting

Upgrade **15.5.14 → 15.5.28** = patch bump, dampak performa minimal.
Upgrade **15 → 16.4.1** = mayor bump, **bisa mengubah performa signifikan**.

Karena itu: **upgrade DULU, baru ambil data.** Jangan pernah mencampur hasil dari dua versi berbeda dalam satu tabel. Kalau sudah ambil sebagian data lalu upgrade di tengah jalan → **semua data harus diulang**.

---

## [ ] P1-6b. Perbaiki klaim "Security Rating A" — ini jebakan di sidang

**Masalah:** `HASIL_TESTING.md` menulis **"Security Rating A (0 issues)"** untuk kedua framework. Itu benar sebagai output SonarQube, tapi **berbahaya kalau dibaca sebagai "aplikasi aman"**.

SonarQube Community menjalankan **SAST** — menganalisis *source code milikmu sendiri*. Ia **tidak memindai CVE pada dependency** (itu tugas **SCA**: `pnpm audit`, Snyk, Dependabot).

Jadi: kode-mu Security Rating A, sementara `next@15.5.14` punya **3 critical RCE**. Dua pernyataan ini tidak bertentangan — tapi kalau penguji tahu soal insiden 14 Okt 2026 lalu melihat "Security Rating A", kamu kena satu pertanyaan yang sulit dijawab.

**Yang dikerjakan:**
- [ ] Tulis eksplisit: *"Security Rating dari SonarQube merefleksikan analisis statis source code aplikasi (SAST), bukan pemindaian kerentanan dependency (SCA)."*
- [ ] Konsisten dengan Batasan Masalah #7 (keamanan sistem di luar cakupan) — jangan tiba-tiba mengklaim aman
- [ ] Opsional tapi nilai plus: lampirkan snapshot `pnpm audit` sebagai catatan reproducibility, **bukan** sebagai hasil penelitian

---

## [ ] P1-7. Perbaiki istilah Core Web Vitals (celah di sidang)

**Masalah:** Batasan Masalah #2 menyebut 5 metrik sebagai "Core Web Vitals": LCP, FCP, TBT, SI, CLS. Padahal **FCP, TBT, SI bukan CWV**, dan **INP** — CWV resmi — tidak ada di daftar.

**Perbaikan (di dokumen, bukan kode):**
- [ ] CWV utama yang diukur: **LCP dan CLS**
- [ ] FCP, TBT, SI, TTI → tulis sebagai **"metrik performa Lighthouse pendukung"**
- [ ] INP → nyatakan terus terang di Batasan Masalah: tidak diukur karena butuh **field data** interaksi pengguna nyata, sedangkan penelitian ini **lab-based**. TBT dipakai sebagai **proksi** responsivitas — dan sebut sebagai proksi.

> Jujur soal lab-vs-field justru memperkuat posisi, bukan melemahkan.

---

## [ ] P1-8. Definisikan ulang "error rate 100%"

**Masalah:** angka ini terbaca seperti server crash. Faktanya itu kegagalan threshold k6 `p(95)<3000`.

**Yang dikerjakan:**
- [ ] Pisahkan dua metrik di laporan:
  - **Error rate** = % respons non-200
  - **SLA breach rate** = % respons >3s
- [ ] Setiap penyebutannya disertai penjelasan threshold
- [ ] Perbaiki juga di `HASIL_TESTING.md`

---

# 🟢 P2 — Kebersihan, kerjakan paling akhir

- [ ] **P2-9.** Update judul di header `README.md`, `HASIL_TESTING.md`, `AGENT_PROMPT.md` → judul kolokium
- [ ] **P2-10.** Re-label hasil 24 Mar 2026 sebagai **"pilot study / proof-of-concept"**, bukan hasil final → ini nilai plus, bukti doability ke dosen
- [ ] **P2-11.** Tambah bab di `DISKUSI_JUDUL_SKRIPSI.md`: alasan pivot ke variasi beban media
- [ ] **P2-12.** `scripts/*.ps1` (PowerShell, sisa era Windows) → shell script, karena sekarang di Mac M1
- [ ] **P2-13b.** **Klaim "ESLint 12 rules 100% identik" perlu diverifikasi.** File `.eslintrc.json` memang identik byte-per-byte, TAPI: (a) ESLint 9 default-nya flat config `eslint.config.js` yang tidak ada di kedua project, (b) plugin yang dirujuk config (`@typescript-eslint/parser`, `eslint-plugin-react`) tidak terpasang di `nextjs-ecommerce`. Jadi identik sebagai *file*, belum tentu benar-benar *dieksekusi* sama. **Tidak mempengaruhi angka SonarQube** (analyzer-nya sendiri, tidak baca eslintrc) — yang perlu diperbaiki hanya klaimnya. Detail di `LANGKAH_UPGRADE.md` §9
- [ ] **P2-13.** Asimetri kecil: `react-ecommerce` ProductCard punya 1 baris komentar yang tidak ada di versi Next.js. Untuk klaim "konvensi identik", samakan
- [x] **P2-14.** `nextjs-ecommerce/.env.example` tidak ada padahal README menyebutnya
- [ ] **P2-15.** `mark1/` git repo kosong (kandidat Next.js vs Remix yang ditolak) → hapus atau beri README penjelasan

---

# ⚠️ Dua keputusan yang belum diambil

## [ ] Keputusan A — Cakupan video

Kolokium menjanjikan video sampai **15–50 MB**. Dilemanya:
- `preload="none"` → video **tidak mempengaruhi CWV sama sekali** (tidak diunduh) → variabelnya sia-sia
- `preload="auto"` → bakar bandwidth. Vercel Hobby = 100GB/bulan; 50MB × 135 run Lighthouse ≈ **7GB**, belum termasuk load testing

**Rekomendasi:** `preload="metadata"` + **poster image** yang jadi LCP element. Dan **jangan pernah** masukkan video ke skenario k6.

**Keputusan:** _(belum diisi)_

## [ ] Keputusan B — Persempit cakupan RQ3 secara eksplisit

`k6 http.get()` **hanya mengunduh dokumen HTML — tidak mengunduh gambar/video**. Jadi variasi beban media hampir **tidak berpengaruh** pada hasil load testing.

Harus dinyatakan eksplisit di Bab 3:
> Load testing mengukur **biaya generasi dokumen di sisi server**, sedangkan variasi beban media berdampak pada **sisi klien**.

Kalau tidak dinyatakan, akan ditanya kenapa RQ2 dan RQ3 tidak saling nyambung — dan tidak ada jawabannya.

**Keputusan:** _(belum diisi)_

---

# 🗺 Urutan kerja

```
P0-1  Route /ssg dan /ssr paralel        ─┐  saling bergantung,
P0-2  Perbaiki lazy-load LCP candidate   ─┼─ sentuh kode yang sama,
P0-3  Aset media 3 tier + switch         ─┘  kerjakan sekaligus
P0-4  Deploy 3 service ke Vercel sin1
P1-6  Upgrade next 16.4.3 + react-router 7.18.4 + verifikasi  ← WAJIB sebelum ambil data
      └─ ikuti LANGKAH_UPGRADE.md step-by-step
P1-5  Runner 9 sel × 15 run → CSV
P1-5  Uji statistik
P1-6b Perbaiki klaim "Security Rating A"
P1-7  Perbaiki istilah CWV di dokumen
P1-8  Perbaiki definisi error rate
Bab 4 Tulis hasil
P2    Rapikan dokumen
```

---

# ✅ Yang SUDAH kuat — jangan dirusak

- **`api-middleware/`** dengan cache in-memory + snapshot `products.json` (20 produk) → jawaban Keresahan Dosen #1 (apple-to-apple). Pilot study membuktikan sendiri: 1.326 req/s, 0ms, 0% error → selisih React vs Next.js murni dari rendering, bukan bottleneck data
- **ESLint 12 rules identik** + code duplication **0.0%** di dua project → jawaban Keresahan Dosen #2
- **Plain `<img>`, bukan `next/image`** → penting! `next/image` akan mengoptimasi gambar otomatis dan merusak fairness studi beban media. **Pertahankan plain `<img>`.**
- **Hasil pilot tidak obvious** (React menang 8 metrik, Next.js 4) → penangkal kritik "hasilnya kan sudah ketebak"
- **`DISKUSI_JUDUL_SKRIPSI.md`** → amunisi sidang yang matang: alasan menolak Remix (brand merge ke React Router v7) dan Laravel (ruleset SonarQube PHP ≠ TS, tidak fair)
- Dosen **menolak** parameter subjektif "kenyamanan pengguna"/UX → jangan pernah tambahkan user survey

---

# 📊 Hasil pilot study (24 Mar 2026, localhost) — arsip

Bukan hasil final. Jumlah run: 1x. Environment: localhost, Windows 11.

| Dimensi | Metrik | React CSR | Next.js SSR/SSG | Unggul |
|---|---|---|---|---|
| Maintainability | Issues | 9 (rating A) | 12 (rating A) | React |
| Maintainability | LOC | 626 | 592 | Next.js |
| Maintainability | Densitas issue | 1/70 baris | 1/49 baris | React |
| CWV | FCP | 6,0s | 0,9s | **Next.js** |
| CWV | LCP | 14,5s | 18,0s | React |
| CWV | CLS | 0,055 | 0 | **Next.js** |
| Lighthouse | TBT | 110ms | 730ms | React |
| Lighthouse | Speed Index | 6,0s | 2,3s | **Next.js** |
| Lighthouse | TTI | 14,5s | 18,4s | React |
| Load test | Throughput | 660 req/s | 311 req/s | React |
| Load test | Avg response | 6ms | 1.141ms | React |
| Load test | Error rate | 0% | 100% ⚠️ threshold, bukan crash | React |

---

**Terakhir diperbarui:** 27 Oktober 2026 (+ audit keamanan dependency)
