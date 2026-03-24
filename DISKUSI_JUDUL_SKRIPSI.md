# Diskusi Pemilihan Judul Skripsi

**Judul Final:** Evaluasi Code Maintainability dan Core Web Vitals Next.js dan React Berdasarkan Strategi Rendering CSR, SSR, dan SSG pada Aplikasi E-Commerce

**Tanggal Diskusi:** 24 Maret 2026

---

## 1. Latar Belakang

Diskusi ini bermula dari kebutuhan menentukan judul skripsi yang paling kuat secara akademis, defensible di sidang, dan realistis untuk diselesaikan. Tiga kandidat judul dipertimbangkan:

| # | Judul Kandidat | Framework |
|---|---|---|
| 1 | React vs Next.js (mark0) | Library vs Framework (sama-sama React) |
| 2 | Next.js vs Remix (mark1) | Framework vs Framework (keduanya React meta-framework) |
| 3 | Laravel vs Next.js | PHP Framework vs JavaScript Framework |

---

## 2. Kandidat 1: React vs Next.js

### Kelebihan
- Perbedaan rendering **sangat jelas** (CSR murni vs SSR/SSG)
- Hasil Lighthouse akan **berbeda drastis** → mudah ditarik kesimpulan
- Banyak **jurnal dan referensi** pendukung
- SonarQube akan menunjukkan perbedaan pola kode yang signifikan
- Sangat **relevan di industri** — banyak perusahaan menghadapi pilihan ini

### Kelemahan Awal
- React adalah library, Next.js adalah framework → **beda kategori**
- Dosen bisa kritik: "ini bukan apple-to-apple"
- Kekhawatiran: "hasilnya sudah jelas SSR menang, lalu apa kontribusinya?"

### Counter-Argument yang Ditemukan
- **Keduanya sama-sama React** — Next.js dibangun di atas React. Yang berbeda hanya cara render dan serve-nya
- **Framing yang tepat:** "Penelitian ini membandingkan **strategi rendering** (CSR vs SSR/SSG), bukan membandingkan framework. React dipilih sebagai representasi CSR, Next.js sebagai representasi SSR/SSG."
- **Hasil TIDAK obvious** — data testing menunjukkan React menang di 4 metrik (TBT, LCP, TTI, Performance Score), Next.js menang di 3 metrik (FCP, CLS, Speed Index). Tidak ada pemenang mutlak.

---

## 3. Kandidat 2: Next.js vs Remix

### Kelebihan
- **Benar-benar apple-to-apple** — sama-sama full-stack React meta-framework
- Hasil tidak bisa ditebak → novelty tinggi
- Metodologi paling kuat secara akademis
- SonarQube dan Lighthouse bisa dibandingkan secara fair

### Kelemahan yang Ditemukan

#### 3.1 Hasil Terlalu Mirip
Setelah riset, ditemukan bahwa perbedaan performa antara Next.js dan Remix **sangat kecil**. Keduanya sama-sama SSR-first, sehingga:
- FCP, LCP, CLS → selisih kecil
- Sulit menarik kesimpulan yang tegas
- Dosen bisa bertanya: "Jadi kesimpulannya apa? Sama saja?"

#### 3.2 Remix Tidak Punya SSG Bawaan
Judul skripsi menyebut "SSG", tapi Remix tidak punya Static Site Generation native seperti Next.js. Remix hanya menggunakan HTTP caching sebagai alternatif. Ini melemahkan scope judul.

#### 3.3 Urgensi Industri Sangat Lemah
- Remix diakuisisi Shopify (2022), tapi kemudian **di-merge ke React Router v7** — brand "Remix" sedang hilang
- Market share Remix sangat kecil dibanding Next.js
- **Tidak ada tren migrasi ke Remix** — justru sebaliknya
- Jika dosen bertanya "Kenapa Remix? Siapa yang pakai?" → sulit dijawab

#### 3.4 Referensi Jurnal Terbatas
Meskipun ditemukan beberapa paper tentang Remix, jumlahnya jauh lebih sedikit dibanding React vs Next.js. Kajian pustaka (Bab 2) akan lebih sulit dibangun.

### Referensi yang Ditemukan tentang Remix
- Remix sebagai framework server-first dengan progressive enhancement
- Studi komparatif menunjukkan Remix unggul pada FCP (2.14s) dan Speed Index
- Remix menggunakan loader & action (data fetching terpusat), mengurangi kompleksitas
- Lebih sedikit JavaScript dikirim ke client

### Catatan Penting
Meskipun ada referensi, **belum ada yang mengukur Code Maintainability secara kuantitatif** menggunakan SonarQube pada perbandingan Next.js vs Remix. Ini sebenarnya merupakan celah riset. Namun, kelemahan lain (hasil mirip, urgensi rendah, SSG lemah) lebih berat.

---

## 4. Kandidat 3: Laravel vs Next.js

### Kelebihan
- Membandingkan 2 ekosistem besar (PHP vs JavaScript) → ambisius
- Sangat relevan industri — banyak perusahaan migrasi dari Laravel ke Next.js
- Pembahasan bisa masuk ke arsitektur, ekosistem, learning curve

### Kelemahan Fatal

#### 4.1 SonarQube Tidak Bisa Fair
SonarQube untuk PHP dan TypeScript punya **ruleset yang berbeda**. Code smell di PHP ≠ code smell di TypeScript. Cyclomatic complexity dihitung berbeda. Perbandingannya seperti "mengukur dua bahasa dengan penggaris yang berbeda."

#### 4.2 Core Web Vitals Tidak Fair
- Laravel Blade: server render PHP → HTML murni, **zero JavaScript** ke browser
- Next.js: server render React → HTML + **hydration bundle JavaScript**
- Perbedaan hasil bukan karena framework lebih bagus, tapi karena **paradigma rendering yang terlalu berbeda**

#### 4.3 Terlalu Banyak Variabel
Beda bahasa (PHP vs TypeScript), beda paradigma (MVC vs Component-based), beda runtime (PHP-FPM vs Node.js). Terlalu banyak variabel → hasil tidak bisa diatribusikan ke satu faktor.

### Satu-satunya Cara yang Defensible
Jika tetap ingin Laravel, harus menggunakan **Laravel + Inertia.js + React** vs Next.js. Dengan ini, frontend-nya sama-sama React, SonarQube bisa fokus ke kode React saja. Tapi ini jauh lebih kompleks.

### Kesimpulan
Laravel vs Next.js **tidak direkomendasikan** karena metodologinya terlalu lemah untuk dipertahankan di sidang.

---

## 5. Perbandingan Head-to-Head 3 Kandidat

| Kriteria | React vs Next.js | Next.js vs Remix | Laravel vs Next.js |
|---|---|---|---|
| **Apple-to-apple** | Cukup (sama-sama React) | Paling fair | Tidak sama sekali |
| **SonarQube fair?** | Ya (sama-sama TS) | Ya (sama-sama TS) | Tidak (PHP vs TS) |
| **Lighthouse fair?** | Ya | Ya | Questionable |
| **Hasil signifikan?** | Ya, di semua dimensi | Terlalu mirip | Ya, tapi tidak fair |
| **Novelty** | Sedang | Tinggi | Sedang |
| **Referensi jurnal** | Banyak | Sedikit | Sedang |
| **Urgensi industri** | Tinggi | Rendah (Remix mati) | Tinggi |
| **Risiko gagal sidang** | Rendah | Sedang | Tinggi |
| **Kemudahan dikerjakan** | Mudah (kode sudah jadi) | Mulai dari nol | Sangat kompleks |

---

## 6. Keputusan: Kenapa React vs Next.js Dipilih

### 6.1 Apple-to-Apple Terbukti

Kedua project menggunakan **basis yang sama** — React. Yang berbeda hanya 3 aspek (variabel bebas):

| Yang SAMA (variabel terkontrol) | Status |
|---|---|
| Bahasa: TypeScript | Identik |
| UI Library: React 19.2 | Identik |
| Product Interface | Identik |
| Inline Styles | Identik |
| ESLint Rules | 100% Identik |
| API Source | Identik (middleware:4000) |

| Yang BEDA (variabel bebas) | React | Next.js |
|---|---|---|
| Rendering | Client-side | Server-side |
| Data Fetching | `useEffect` + `fetch` | `async server component` |
| Routing | React Router | App Router |

Hanya **3 hal yang berbeda** dan ketiganya adalah konsekuensi langsung dari strategi rendering.

### 6.2 Hasil Testing TIDAK Obvious

Kekhawatiran terbesar: "hasilnya sudah jelas SSR menang." Tapi data membuktikan sebaliknya:

| Metrik | Pemenang |
|---|---|
| FCP | Next.js (0.9s vs 6.0s) |
| Speed Index | Next.js (2.3s vs 6.0s) |
| CLS | Next.js (0 vs 0.055) |
| **TBT** | **React** (110ms vs 730ms) |
| **LCP** | **React** (14.5s vs 18.0s) |
| **TTI** | **React** (14.5s vs 18.4s) |
| **Performance Score** | **React** (59 vs 57) |
| **Maintainability Issues** | **React** (9 vs 12) |
| **Load Test Throughput** | **React** (660 vs 311 req/s) |
| **Load Test Error Rate** | **React** (0% vs 100%) |

**Skor: React menang 7, Next.js menang 3.** Hasil ini tidak bisa ditebak sebelum testing.

### 6.3 Skenario Dunia Nyata yang Kuat

```
Perusahaan baru → pakai React (CSR)
        ↓
Butuh SEO & performa → pertimbangkan Next.js (SSR)
        ↓
Pertanyaan: "Worth it gak? Apa tradeoff-nya?"
        ↓
Skripsi ini menjawab dengan DATA KUANTITATIF
```

### 6.4 Framing Judul yang Tepat

Fokus utama bukan "mana framework yang lebih baik" (obvious), tapi:

> **"Apakah peningkatan performa SSR sebanding dengan cost maintainability-nya?"**

Ini pertanyaan yang belum ada jawabannya dan sangat relevan untuk industri.

### 6.5 Alasan Pragmatis

- Kode **sudah selesai dibangun** dan di-test
- Doability **sudah dibuktikan** ke dosen
- **3 dimensi pengukuran** lengkap (SonarQube + Lighthouse + k6)
- **6 dari 6 keresahan dosen** sudah terjawab
- Referensi jurnal **banyak tersedia**

---

## 7. Saran Teman yang Dipertimbangkan tapi Ditolak

Seorang teman menyarankan 3 alternatif judul:

### 7.1 "Perbandingan performa Remix vs Next.js pada aplikasi real-time"
**Ditolak karena:**
- Scope berubah total (real-time = WebSocket, live chat) — bukan e-commerce
- Jauh lebih kompleks, bisa berbulan-bulan
- Remix sedang mati (merge ke React Router v7)

### 7.2 "Analisis kompleksitas data fetching pada Next.js vs Remix"
**Ditolak karena:**
- Terlalu sempit — bisa jadi 1 subbab, bukan judul skripsi
- "Kompleksitas" sulit diukur secara kuantitatif
- Dosen minta angka, bukan analisis kualitatif

### 7.3 "Pengaruh arsitektur SSR terhadap UX"
**Ditolak karena:**
- Dosen sudah **menolak parameter "kenyamanan pengguna"** (UX) — terlalu subjektif
- Harus pakai user survey, bukan bidang penulis (PSD/teknis)
- Terlalu luas, scope tidak jelas

### Kesimpulan
Ketiga saran tidak lebih kuat dari judul yang sudah dimiliki. Project mark0 sudah memiliki kode jadi, data testing, dan semua keresahan dosen terjawab. Mengganti judul berarti menghilangkan semua progress.

> **"Skripsi terbaik bukan judul yang paling keren — tapi yang paling bisa diselesaikan dengan data yang kuat."**

---

## 8. Ringkasan Keputusan

| Aspek | Keputusan |
|---|---|
| **Judul** | Evaluasi Code Maintainability dan Core Web Vitals Next.js dan React Berdasarkan Strategi Rendering CSR, SSR, dan SSG pada Aplikasi E-Commerce |
| **Framing** | Membandingkan **strategi rendering** (CSR vs SSR/SSG), bukan framework |
| **Kontribusi** | Mengukur **tradeoff** antara performa user (Core Web Vitals) dan cost developer (maintainability) secara kuantitatif |
| **Tools** | SonarQube (maintainability) + Lighthouse (Core Web Vitals) + k6 (load testing) |
| **Kekuatan** | Hasil tidak obvious, 3 dimensi pengukuran, semua keresahan dosen terjawab |

---

**Dokumen ini disusun sebagai catatan proses pengambilan keputusan judul skripsi.**
