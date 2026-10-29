# 🎓 Tanya Jawab Penting — Persiapan Sidang

> **Dibuat:** 29 Oktober 2026
> **Judul:** Evaluasi Strategi Rendering React dan Next.js pada E-Commerce dengan Variasi Beban Media Menggunakan Core Web Vitals
> **Cara pakai:** tiap jawaban disertai **data pendukung** yang bisa kamu tunjukkan. Jangan menghafal kalimatnya — pahami angkanya.

---

# A. Desain Penelitian

## A1. "React itu library, Next.js itu framework. Ini bukan apple-to-apple."

**Jawaban singkat:** Penelitian ini membandingkan **strategi rendering**, bukan framework. React dipilih sebagai representasi CSR, Next.js sebagai representasi SSR dan SSG. Keduanya sama-sama React — Next.js dibangun di atas React.

**Data pendukung:** `react` dan `react-dom` versi **19.2.4 persis sama** di kedua aplikasi, dan sengaja tidak diupgrade sebagai variabel terkontrol. Bisa dibuktikan di `package.json` keduanya.

Yang berbeda hanya tiga hal, dan ketiganya konsekuensi langsung dari strategi rendering:

| | React | Next.js |
|---|---|---|
| Rendering | client-side | server-side / build-time |
| Data fetching | `useEffect` + `fetch` | async server component |
| Routing | React Router | App Router |

---

## A2. "Bagaimana memastikan kedua aplikasi benar-benar identik?"

**Jawaban singkat:** Dibuktikan berlapis, bukan diklaim.

**Data pendukung:**

1. **Komponen identik byte-per-byte.** `ProductCard.tsx` dan `ProductGrid.tsx` di kedua aplikasi sama persis kecuali baris import routing. Bisa didemokan dengan `diff`.
2. **Sumber data sama persis.** Keduanya fetch ke middleware yang sama, dengan snapshot 20 produk tetap di `products.json`.
3. **Byte media identik.** Terukur pada 135 run: tier light 1,28 MB, medium 6,20 MB, heavy 26,63 MB — **angkanya sama persis di CSR, SSG, dan SSR**. Ini bukti terkuat, karena berupa pengukuran, bukan arsitektur di atas kertas.
4. **ESLint config identik** (lihat C4 untuk catatan jujurnya).

---

## A3. "Kenapa perlu API middleware? Kenapa tidak fetch langsung?"

**Jawaban singkat:** Supaya beban server dan data yang diterima kedua aplikasi persis sama — ini memenuhi permintaan dosen pembimbing.

**Data pendukung:** Middleware memakai cache in-memory plus snapshot 20 produk. Selama pengujian, sumber data pihak ketiga tidak pernah dipanggil, sehingga latensi dan ketidakstabilan layanan luar tereliminasi.

Pada pilot study, middleware melayani **1.326 request/detik dengan 0% error**. Artinya terbukti bukan bottleneck — perbedaan performa antar strategi murni berasal dari rendering, bukan dari lapisan data.

---

## A4. "Kenapa ada 7 deployment? Katanya cuma 2 aplikasi."

**Jawaban singkat:** Tetap 2 aplikasi e-commerce + 1 API. Yang jadi 7 karena **tier media harus dibekukan saat build**, jadi satu build per tier.

| Aplikasi | Deployment |
|---|---|
| react-ecommerce (1 app) | `mark0-react-light` / `-medium` / `-heavy` |
| nextjs-ecommerce (1 app) | `mark0-next-light` / `-medium` / `-heavy` |
| api-middleware (API, bukan toko) | `mark0-middleware` |

Kode sumber ketiga deployment per aplikasi **identik per baris** — yang berbeda hanya satu variabel lingkungan.

---

## A5. "Kenapa tier media tidak bisa diganti lewat URL saja?"

**Jawaban singkat:** Karena halaman SSG dibekukan jadi berkas HTML pada tahap build. Parameter runtime tidak berpengaruh padanya.

| Strategi | Bisa ganti tier saat runtime? |
|---|---|
| CSR | bisa — fetch terjadi di browser |
| SSR | bisa — render tiap request |
| **SSG** | **tidak** — HTML sudah jadi berkas statis |

Kalau tier dikirim lewat query param, CSR dan SSR menurut sementara SSG tetap menyajikan tier bawaan build-nya. Dua strategi akan diuji dengan mekanisme berbeda dari yang ketiga — perbandingannya tidak adil.

Karena itu ketiganya diperlakukan simetris: tier ditetapkan saat build lewat env var (`MEDIA_TIER` / `VITE_MEDIA_TIER`).

---

## A6. "Bagaimana saya tahu aplikasi ini sedang memakai tier tertentu?"

Tiga cara, bisa didemokan langsung:

1. **Halaman indeks Next.js** — buka URL tanpa `/ssg`, tertulis *"Tier beban media aktif: heavy"*
2. **DevTools → Network → filter Img** — URL-nya `media/heavy/img-01.jpg`, kolom Size menunjukkan 2,1 MB. Cara ini berlaku untuk kedua aplikasi
3. **Kolom `image_bytes` di `metrics.csv`** — terekam pada setiap 135 run

---

## A7. "Kenapa SSG dan SSR diuji di halaman terpisah `/ssg` dan `/ssr`?"

**Jawaban singkat:** Supaya keduanya diukur pada halaman yang **identik**, sehingga selisihnya murni dari strategi rendering.

**Konteks jujur:** struktur awal penelitian ini mengukur SSG di halaman katalog (20 gambar) dan SSR di halaman detail produk (1 gambar). Itu berarti yang terukur adalah selisih *halaman*, bukan selisih strategi — dan uji ANOVA jadi tidak valid. Cacat ini ditemukan dan diperbaiki sebelum pengambilan data.

**Data pendukung:** output `next build` menandai `/ssg` sebagai `○ Static` dan `/ssr` sebagai `ƒ Dynamic`. Di produksi, header `x-vercel-cache` menunjukkan `HIT` untuk `/ssg` dan `MISS` untuk `/ssr` — bukti empiris keduanya benar-benar berperilaku berbeda, bukan sekadar label.

---

# B. Metodologi Pengukuran

## B1. "Kenapa 15 kali pengulangan? Kenapa tidak sekali saja?"

**Jawaban singkat:** Karena satu run bisa menyesatkan sepenuhnya.

**Data pendukung — contoh nyata dari penelitian ini:** pada uji coba satu run, SSG heavy menghasilkan LCP **44.668 ms** sementara SSR heavy 12.914 ms — selisih 3,5 kali. Setelah 15 run, rata-ratanya ternyata **hampir sama** (25.006 ms vs 25.177 ms) dan uji statistik menyatakan **tidak berbeda signifikan** (p = 0,97).

Kalau penelitian ini berhenti di satu run, kesimpulannya akan terbalik.

Variabilitas tier heavy memang sangat tinggi — SD LCP mencapai 13.778 ms pada SSG heavy. Justru karena itu pengulangan wajib.

---

## B2. "Kenapa memakai Kruskal-Wallis, bukan ANOVA?"

**Jawaban singkat:** Karena datanya tidak memenuhi asumsi ANOVA. Keputusan ini diambil berdasarkan uji, bukan preferensi.

**Data pendukung:** dari 35 pengujian, **nol** yang lolos asumsi normalitas (Shapiro-Wilk) **dan** homogenitas varians (Levene) sekaligus. Setiap keputusan beserta p-value uji asumsinya tercetak di `results/analisis.md`, jadi bisa ditelusuri satu per satu.

Post-hoc memakai Mann-Whitney dengan koreksi Bonferroni (alpha 0,05/3 = 0,0167).

---

## B3. "Kenapa LCP sampai 23 detik? Itu tidak masuk akal."

**Jawaban singkat:** Karena Lighthouse secara default mensimulasikan perangkat mobile dengan throttling jaringan lambat, dan tier heavy memuat 26,63 MB gambar.

Angka absolutnya memang ekstrem, tapi itu **justru tujuan desainnya**: efek variasi beban media jadi terukur jelas, tidak tenggelam dalam noise.

**Yang harus dinyatakan:** penelitian ini *lab-based* dengan throttling tersimulasi, bukan pengukuran kondisi jaringan nyata (*field data*).

---

## B4. "Kenapa hanya 13 dari 20 gambar yang terunduh?"

**Jawaban singkat:** Karena 16 dari 20 kartu memakai `loading="lazy"`, dan pada viewport mobile gambar di bawah lipatan layar memang tidak diunduh. Ini perilaku yang benar, bukan kegagalan.

**Data pendukung:** angkanya **13 di seluruh 135 run tanpa kecuali** — nol variasi. Konsistensi ini sendiri membuktikan tidak ada yang terblokir secara acak.

Empat kartu pertama sengaja dibuat `loading="eager"` + `fetchPriority="high"` karena menjadi kandidat LCP. Kalau semuanya dibiarkan lazy, gambar di bawah lipatan tidak pernah diunduh dan **variasi beban media tidak akan terukur sama sekali**.

---

## B5. "Kenapa pakai Brave, bukan Google Chrome?"

**Jawaban singkat:** Brave berbasis Chromium — mesin render (Blink) dan engine JavaScript (V8)-nya identik dengan Chrome. Lighthouse mengukur lewat DevTools Protocol yang sama.

**Data pendukung:** aplikasi uji tidak memuat resource pihak ketiga sama sekali — seluruh JavaScript dan gambar berasal dari domain sendiri — sehingga fitur pemblokiran bawaan Brave tidak punya sasaran. Diverifikasi empiris: seluruh request gambar terunduh penuh pada setiap run (kolom `image_requests` konsisten 13/13).

**Catatan jujur:** user-agent melaporkan `HeadlessChrome/154.0.0.0`, jadi data CSV tidak membedakannya. Browser sebenarnya **Brave Browser 154.1.96.59** dan itu dinyatakan eksplisit di Bab 3.

---

## B6. "Gambarnya bukan foto produk asli?"

**Jawaban singkat:** Benar, gambar dihasilkan secara sintetis dan deterministik. Ini **keterbatasan yang dinyatakan**, bukan yang disembunyikan.

**Alasannya:** untuk eksperimen terkontrol, ukuran byte harus bisa dikendalikan presisi. Hasilnya 60 dari 60 gambar masuk rentang target:

| Tier | Target | Aktual |
|---|---|---|
| light | 50–150 KB | 97,2 – 103,0 KB |
| medium | 200–800 KB | 480,6 – 518,0 KB |
| heavy | 1–3 MB | 2085,5 – 2110,9 KB |

Ketiga tier berasal dari **satu gambar sumber yang sama** per produk, hanya beda resolusi dan kompresi. Kalau isinya berbeda, yang terukur bukan lagi murni ukuran byte.

Generator-nya mendukung foto asli: cukup taruh `01.jpg`..`20.jpg` di folder `media-source/`.

---

# C. Hasil & Interpretasi

## C1. "Apa temuan utama penelitian ini?"

**Beban media jauh lebih menentukan daripada strategi rendering.**

| Faktor terhadap LCP | p | effect size |
|---|---|---|
| Variasi beban media | ≈ 3×10⁻⁹ | **ε² = 0,88** |
| Strategi rendering | 0,00006 – 0,005 | ε² = 0,17 – 0,41 |

Beban media menjelaskan **88%** variasi LCP; strategi rendering hanya 17–41%.

**Implikasi praktis:** untuk e-commerce padat media, mengoptimalkan media memberi dampak jauh lebih besar daripada berganti strategi rendering. Ini menjawab langsung judul penelitian.

---

## C2. "Jadi mana yang lebih baik, React atau Next.js?"

**Tidak ada pemenang mutlak — dan itu justru temuannya.**

**LCP rata-rata (ms):**

| Tier | CSR | SSG | SSR |
|---|---|---|---|
| light | **2.947** | 4.120 | 3.853 |
| medium | **6.106** | 9.754 | 7.438 |
| heavy | **16.311** | 25.006 | 25.177 |

CSR unggul LCP di semua tier. Tapi:

**TBT (biaya hydration):** CSR **0,00 ms di seluruh 135 run** vs SSG 58–67 ms dan SSR 61–77 ms (ε² = 0,68–0,69).

**FCP:** Next.js lebih cepat karena HTML sudah berisi konten sejak server.

Jadi: Next.js menang pada kecepatan tampil awal, CSR menang pada LCP dan responsivitas. **Itulah trade-off yang dicari penelitian ini.**

---

## C3. "Kenapa CLS nol semua? Apakah pengukurannya gagal?"

**Jawaban singkat:** Tidak gagal — ini temuan.

CLS bernilai **0,00 pada seluruh 135 run**, di ketiga strategi dan ketiga tier. Penyebabnya: komponen `ProductCard` menetapkan `width={200} height={160}` pada setiap elemen `<img>`, sehingga browser memesan ruang sebelum gambar termuat dan tidak terjadi pergeseran layout.

**Kesimpulan yang bisa ditarik:** praktik menetapkan dimensi gambar secara eksplisit menghilangkan Cumulative Layout Shift **terlepas dari strategi rendering maupun beban media**. Karena variansnya nol, uji statistik tidak dapat dilakukan dan hal ini dinyatakan apa adanya.

---

## C4. "Bukankah SSG seharusnya selalu lebih cepat dari SSR?"

**Jawaban singkat:** Untuk LCP, ternyata tidak berbeda signifikan.

**Data pendukung:** uji post-hoc LCP antara SSG dan SSR menghasilkan p = 0,21 (light), 0,07 (medium), dan 0,97 (heavy) — **tidak signifikan di ketiga tier**.

Penjelasannya masuk akal: ketika beban media besar, waktu transfer gambar mendominasi total LCP, sehingga keuntungan SSG pada tahap pembuatan HTML menjadi tidak berarti. Perbedaan keduanya terlihat pada FCP, bukan LCP.

---

## C5. "Apa yang membuat penelitian ini berbeda dari penelitian sebelumnya?"

1. **Variasi beban media sebagai variabel utama**, bukan sekadar perbandingan kecepatan umum
2. **Testbed identik** — bukan membandingkan dua aplikasi berbeda, melainkan satu rancangan yang sama dengan tiga strategi rendering
3. **Pengujian pada tiga lapis**: sisi klien (Core Web Vitals), sisi server (load testing), dan kualitas kode (analisis statik)
4. **Hasil tidak dapat ditebak sebelumnya** — temuan bahwa beban media mengalahkan strategi rendering tidak diprediksi di awal

---

# D. Keterbatasan & Titik Rawan

> Bagian ini sengaja ditulis supaya kamu yang menyebutkannya lebih dulu, bukan penguji.

## D1. Istilah Core Web Vitals

**Core Web Vitals resmi saat ini adalah LCP, CLS, dan INP.** FCP, TBT, Speed Index, dan TTI **bukan** Core Web Vitals, melainkan metrik performa Lighthouse pendukung.

**INP tidak diukur** karena memerlukan data interaksi pengguna nyata (*field data*), sedangkan penelitian ini berbasis laboratorium. TBT dipakai sebagai **proksi** responsivitas, dan disebut sebagai proksi.

Nyatakan ini sendiri di Bab 3. Kalau penguji yang mengoreksi lebih dulu, posisimu lemah.

## D2. Lab data, bukan field data

Seluruh pengukuran memakai Lighthouse dengan throttling tersimulasi. Angka absolutnya tidak mewakili kondisi jaringan pengguna nyata. Yang valid adalah **perbandingan antar kondisi**, bukan nilai absolutnya.

## D3. "Error rate 100%" pada pilot study

Angka itu **kegagalan threshold k6** (p95 < 3 detik), **bukan server crash**. Server tetap merespons; waktu responsnya saja yang melampaui ambang.

Di laporan akhir, pisahkan dua metrik: **error rate** (persentase respons non-200) dan **SLA breach rate** (persentase respons > 3 detik). Kalau tidak dipisah, kesimpulan bisa dibantah dalam satu pertanyaan.

## D4. "Security Rating A" dari SonarQube

SonarQube menjalankan **SAST** — analisis statis terhadap source code sendiri. Ia **tidak memindai kerentanan dependency** (itu tugas **SCA**: `pnpm audit`, Snyk, Dependabot).

Jadi "Security Rating A" **tidak berarti aplikasinya aman**. Nyatakan batasan ini, dan konsisten dengan Batasan Masalah yang sudah menempatkan keamanan di luar cakupan.

## D5. Data pilot study bulan Maret tidak sebanding

Jangan mencampur angka pilot dengan data final. Yang berbeda: Next.js 15 → 16.4.3 (termasuk ganti bundler ke Turbopack), Node v22 → v26, Lighthouse 13.0.3 → 13.5.0, k6 1.6.1 → 2.3.0, localhost → Vercel sin1, dan n=1 → n=15.

Posisikan pilot study sebagai **proof-of-concept** yang membuktikan penelitian ini dapat dikerjakan — itu nilai plus, bukan kelemahan.

## D6. Variabilitas tier heavy

SD LCP mencapai 13.778 ms pada SSG heavy (mean 25.006, maks 45.237). Untuk tier heavy, **laporkan median** di samping mean, karena mean mudah tertarik oleh outlier.

---

# E. Environment yang Harus Dinyatakan di Bab 3

| Komponen | Versi |
|---|---|
| Browser host | **Brave Browser 154.1.96.59** |
| Lighthouse | 13.5.0 |
| k6 | 2.3.0 |
| Node.js | v26.0.0 |
| pnpm | 11.1.2 |
| React / React DOM | 19.2.4 (identik di kedua aplikasi) |
| Next.js | 16.4.3 |
| React Router | 7.18.4 |
| Vite | 8.0.1 |
| Platform deploy | Vercel Hobby, region Singapore (`sin1`) |
| Mode Lighthouse | default — emulasi mobile + throttling tersimulasi |
| Analisis statistik | Python 3.13, numpy 2.5.4, scipy 1.18.1 |
| Jumlah run | 9 sel × 15 run = 135 |

---

**Terakhir diperbarui:** 29 Oktober 2026
