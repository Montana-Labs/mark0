# EVALUASI STRATEGI RENDERING REACT DAN NEXT.JS PADA E-COMMERCE DENGAN VARIASI BEBAN MEDIA MENGGUNAKAN CORE WEB VITALS

> **Status:** draf kerja, 2 November 2026
> **Penyusun:** Emmanuel Abel Zoe — 71220843
> Program Studi Informatika, Fakultas Teknologi Informasi
> Universitas Kristen Duta Wacana, Yogyakarta
>
> ---
>
> **Cara memakai berkas ini**
>
> Bab 1 dan Bab 2 mengikuti kolokium yang sudah disetujui — salin dari `kolokium.pdf`, bagian di sini hanya kerangka dan penanda apa yang perlu disesuaikan.
>
> Bab 3 **berbeda dari kolokium** dan harus ditulis ulang, karena implementasinya berkembang selama penelitian. Perbedaannya ditandai 🔄.
>
> Bab 4 berisi seluruh angka hasil, sudah terisi dari `results/metrics.csv`.
>
> Penanda **✍️ TULIS SENDIRI** menandai bagian yang narasinya harus datang darimu. Itu bagian yang akan ditanyakan penguji, jadi harus benar-benar kamu kuasai — bukan sekadar disalin.

---

# BAB 1 — PENDAHULUAN

## 1.1 Latar Belakang
Salin dari kolokium bagian 1. Isinya sudah lengkap dan disetujui.

✍️ **TULIS SENDIRI — tambahan 1 paragraf penutup.** Setelah paragraf terakhir kolokium, tambahkan arah penelitian yang kini sudah diketahui hasilnya: bahwa penelitian ini menemukan beban media lebih menentukan daripada strategi rendering.

## 1.2 Rumusan Masalah
Salin persis dari kolokium bagian 2 — keempat rumusan masalah tidak berubah.

## 1.3 Batasan Masalah
Salin dari kolokium bagian 3, dengan **tiga penyesuaian wajib**:

| # | Isi kolokium | Penyesuaian |
|---|---|---|
| 2 | menyebut LCP, FCP, TBT, SI, CLS sebagai "Core Web Vitals" | 🔄 FCP, TBT, SI bukan Core Web Vitals. Tulis: CWV utama **LCP dan CLS**; FCP, TBT, SI, TTI sebagai **metrik performa Lighthouse pendukung**. Nyatakan **INP tidak diukur** karena memerlukan field data |
| 5 | React 19.2, Next.js 16.2.1 | 🔄 versi aktual: React **19.2.4**, Next.js **16.4.3** |
| — | — | 🔄 tambahkan batasan baru: pengujian beban hanya sampai **100 pengguna virtual** (alasan di 3.8) |

## 1.4 Tujuan Penelitian
Salin dari kolokium bagian 4.

## 1.5 Manfaat Penelitian
Salin dari kolokium bagian 5.

## 1.6 Sistematika Penulisan
✍️ **TULIS SENDIRI** — ringkasan isi tiap bab, satu paragraf per bab.

---

# BAB 2 — TINJAUAN PUSTAKA DAN LANDASAN TEORI

## 2.1 Tinjauan Pustaka
Salin dari kolokium bagian 6.1.

## 2.2 Landasan Teori
Salin dari kolokium bagian 6.2, dengan tambahan:

- 2.2.1 Core Web Vitals 🔄 *perbaiki definisi: CWV resmi adalah LCP, CLS, INP*
- 2.2.2 Client-Side Rendering (CSR)
- 2.2.3 Server-Side Rendering (SSR)
- 2.2.4 Static Site Generation (SSG)
- 2.2.5 Variasi Beban Media
- 2.2.6 Load Testing
- 2.2.7 🔄 **BARU — Hydration.** Diperlukan karena Bab 4 membahas Total Blocking Time dan membantah anggapan umum bahwa TBT tinggi berasal dari hydration
- 2.2.8 🔄 **BARU — Uji statistik non-parametrik.** Kruskal-Wallis, Mann-Whitney, koreksi Bonferroni, serta effect size epsilon-kuadrat. Diperlukan karena seluruh pengujian memakai jalur non-parametrik

---

# BAB 3 — METODOLOGI PENELITIAN

> 🔄 **Bab ini berbeda cukup banyak dari kolokium.** Implementasinya berkembang selama penelitian — tulis apa yang BENAR-BENAR dikerjakan, bukan apa yang direncanakan.

## 3.1 Pendekatan Penelitian
Kuantitatif, eksperimen terkontrol. Salin kerangka dari kolokium 8.1.

## 3.2 🔄 Rancangan Eksperimen

Rancangan akhir: **4 strategi rendering × 3 tingkat beban media = 12 sel**, masing-masing diukur **15 kali** → **180 pengukuran**.

| Strategi | Implementasi | Halaman |
|---|---|---|
| CSR-React | React 19.2.4 + Vite 8.0.1 | `/` |
| CSR-Next | Next.js 16.4.3, `next/dynamic` dengan `ssr: false` | `/csr` |
| SSG-Next | Next.js 16.4.3, `force-static` | `/ssg` |
| SSR-Next | Next.js 16.4.3, `force-dynamic` | `/ssr` |

🔄 **Dua penyesuaian dari kolokium yang wajib dijelaskan:**

**a. SSG dan SSR diukur pada halaman yang identik.** Rancangan awal mengukur SSG pada halaman katalog dan SSR pada halaman detail produk. Karena isi kedua halaman berbeda, yang terukur adalah selisih halaman, bukan selisih strategi. Rancangan diperbaiki dengan membuat dua route berisi katalog yang sama persis, berbeda hanya pada direktif caching-nya.

**b. Kondisi CSR pada Next.js ditambahkan.** Pada rancangan awal CSR hanya diamati pada React, sehingga pengaruh strategi dan pengaruh framework tidak dapat dipisahkan. Dengan menambahkan CSR pada Next.js, penelitian memperoleh dua perbandingan: React-CSR versus Next-CSR mengisolasi pengaruh framework, dan Next-CSR versus Next-SSG versus Next-SSR mengisolasi pengaruh strategi.

Analisis utama tetap mengikuti Batasan Masalah: CSR diwakili React, SSR dan SSG diwakili Next.js. Dua perbandingan tambahan berstatus analisis pelengkap.

## 3.3 Variabel Penelitian

**Variabel bebas:** strategi rendering dan tingkat beban media.

**Variabel terikat:** LCP, CLS, FCP, TBT, Speed Index, TTI, Performance Score, serta waktu respons dan throughput pada sisi server.

**Variabel terkontrol** — dibuktikan dengan pengukuran, bukan hanya pernyataan rancangan:

| Aspek | Bukti |
|---|---|
| Versi React | 19.2.4 identik pada kedua aplikasi |
| Komponen antarmuka | `ProductCard.tsx` dan `ProductGrid.tsx` identik byte-per-byte kecuali baris impor routing |
| Sumber data | satu API middleware, snapshot 20 produk yang sama |
| **Beban media aktual** | byte gambar terunduh **identik pada keempat strategi**: 1,28 MB / 6,20 MB / 26,63 MB |
| Jumlah request gambar | 13 request pada seluruh 180 pengukuran, nol variasi |

## 3.4 🔄 Implementasi Variasi Beban Media

Gambar produk di-host sendiri agar ukuran byte terkendali penuh, tidak mengikuti ukuran acak dari sumber pihak ketiga.

| Tier | Target | Hasil aktual | Rata-rata |
|---|---|---|---|
| light | 50–150 KB | 97,2 – 103,0 KB | 100,2 KB |
| medium | 200–800 KB | 480,6 – 518,0 KB | 490,9 KB |
| heavy | 1–3 MB | 2.085,5 – 2.110,9 KB | 2.097,5 KB |

Enam puluh dari enam puluh berkas masuk rentang target. Ketiga tier dihasilkan dari **satu gambar sumber yang sama** per produk, berbeda hanya pada resolusi dan tingkat kompresi — sehingga yang terukur murni perbedaan ukuran byte.

🔄 **Tier ditetapkan pada tahap build, bukan runtime.** Halaman SSG dibekukan menjadi berkas HTML pada tahap build sehingga parameter runtime tidak berpengaruh padanya. Agar ketiga strategi diperlakukan simetris, tier ditentukan melalui variabel lingkungan saat build (`MEDIA_TIER` pada Next.js, `VITE_MEDIA_TIER` pada React). Konsekuensinya setiap kombinasi strategi dan tier merupakan build serta deployment terpisah.

🔄 **Keterbatasan:** gambar bersifat sintetis dan deterministik, bukan foto produk asli. Dipilih karena ukuran byte harus terkendali presisi.

## 3.5 🔄 Lingkungan Pengujian

| Komponen | Versi |
|---|---|
| Platform deployment | Vercel Hobby, region Singapura (`sin1`) |
| Browser host pengukuran | **Brave Browser 154.1.96.59** |
| Lighthouse | 13.5.0 |
| k6 | 2.3.0 |
| Node.js | v26.0.0 |
| pnpm | 11.1.2 |
| React / React DOM | 19.2.4 |
| Next.js | 16.4.3 |
| React Router | 7.18.4 |
| Vite | 8.0.1 |
| Analisis statistik | Python 3.13, NumPy 2.5.4, SciPy 1.18.1 |

🔄 Pengukuran dijalankan di atas **Brave**, bukan Google Chrome. Keduanya berbasis Chromium dengan mesin render dan engine JavaScript yang identik. Aplikasi uji tidak memuat resource pihak ketiga sama sekali sehingga fitur pemblokiran bawaan Brave tidak memiliki sasaran — diverifikasi dari seluruh request gambar yang terunduh penuh pada setiap pengukuran.

Mode Lighthouse memakai pengaturan bawaan: emulasi perangkat mobile dengan throttling jaringan tersimulasi.

## 3.6 Arsitektur Sistem Uji

✍️ **TULIS SENDIRI + sertakan diagram.** Jelaskan alur: browser → aplikasi (Vercel sin1) → API middleware → snapshot data + aset media. Tekankan bahwa keempat aplikasi mengambil data dari satu middleware yang sama.

## 3.7 Prosedur Pengumpulan Data

**Pengujian sisi klien.** Setiap sel diukur 15 kali menggunakan Lighthouse pada mode produksi. Berkas hasil mentah tiap pengukuran disimpan terpisah agar simpangan baku dapat dihitung. Cache middleware dihangatkan sebelum setiap rangkaian pengujian.

**Pengujian sisi server.** Load testing menggunakan k6 dengan pengukuran terpisah per tingkat beban pengguna, bukan satu tanjakan panjang.

🔄 **Pembatasan cakupan:** k6 hanya mengunduh dokumen HTML, tidak mengunduh gambar. Pengujian beban karena itu mengukur biaya generasi dokumen di sisi server, sedangkan pengaruh variasi beban media berada di sisi klien dan diukur terpisah melalui Lighthouse. Pengujian beban hanya dijalankan pada satu tier.

## 3.8 🔄 Keterbatasan Pengujian Beban

Kolokium menjanjikan pengujian pada 100, 500, dan 1000 pengguna virtual. Yang berhasil diukur secara sah hanya **100 pengguna virtual**.

Pada beban yang lebih tinggi, mitigasi DDoS otomatis platform mulai menghadang request dengan halaman verifikasi, sehingga yang terukur bukan lagi kapasitas aplikasi melainkan ambang perlindungan platform.

**Bukti bahwa penyebabnya bukan keterbatasan arsitektur:**

1. Aplikasi CSR berbasis berkas statis yang disajikan melalui CDN ikut mengalami kegagalan 16% pada tingkat beban yang sama. CDN tidak mungkin kewalahan pada 181 request per detik.
2. Throughput justru **menurun** saat tingkat kegagalan meningkat. Pengujian singkat pada 900 pengguna virtual terhadap target yang sama mencatat 605 request/detik dengan 0% kegagalan, sedangkan pengujian berdurasi panjang pada 1000 pengguna virtual mencatat 181 request/detik dengan 56% kegagalan. Pola demikian hanya masuk akal bila terdapat pihak yang menolak request, bukan bila server kewalahan.
3. Header respons menunjukkan `x-vercel-mitigated: challenge` dan dasbor firewall mencatat 100.300 request berstatus *challenge* berbanding 50.500 *allow*.

Pengecualian alamat IP pengujian hanya tersedia pada plan berbayar.

## 3.9 Metode Analisis Data

1. **Statistik deskriptif** — n, rata-rata, simpangan baku, minimum, maksimum, median per sel
2. **Uji asumsi** — Shapiro-Wilk untuk normalitas, Levene untuk homogenitas varians
3. **Uji omnibus** — ANOVA satu arah bila asumsi terpenuhi, Kruskal-Wallis bila tidak
4. **Uji post-hoc** — Tukey HSD atau Mann-Whitney dengan koreksi Bonferroni
5. **Effect size** — eta-kuadrat atau epsilon-kuadrat

Taraf signifikansi α = 0,05.

🔄 **Hasil uji asumsi:** dari 35 pengujian, **tidak satu pun** memenuhi asumsi normalitas dan homogenitas varians sekaligus. Seluruh analisis karena itu memakai Kruskal-Wallis dengan post-hoc Mann-Whitney berkoreksi Bonferroni (α = 0,05/3 = 0,0167).

Pengujian RQ1 dan RQ2 dijalankan terpisah: pengaruh strategi rendering diuji pada setiap tier, pengaruh beban media diuji pada setiap strategi. Pemisahan ini diperlukan agar kedua faktor tidak saling mencemari.

---

# BAB 4 — HASIL DAN PEMBAHASAN

> Seluruh angka di bab ini berasal dari `results/metrics.csv` (180 pengukuran) dan `results/analisis.md`. Format penyajian: **rata-rata ± simpangan baku**.

## 4.1 Validasi Data

Seluruh 180 pengukuran berhasil tanpa kegagalan, dengan 15 pengukuran pada setiap sel.

**Bukti variasi beban media benar-benar terjadi** — byte gambar terunduh per pengukuran:

| Tier | Rata-rata byte gambar | Jumlah request |
|---|---|---|
| light | 1,28 MB | 13 |
| medium | 6,20 MB | 13 |
| heavy | 26,63 MB | 13 |

Angka tersebut **identik pada keempat strategi rendering**, sehingga perbandingan antar strategi dilakukan pada beban media yang benar-benar sama. Jumlah request gambar konsisten 13 pada seluruh 180 pengukuran tanpa variasi.

Jumlah 13 dari 20 gambar merupakan perilaku yang diharapkan: enam belas dari dua puluh kartu produk memakai `loading="lazy"`, dan pada emulasi perangkat mobile gambar di bawah lipatan layar tidak diunduh. Empat kartu pertama sengaja dimuat secara *eager* karena menjadi kandidat Largest Contentful Paint.

## 4.2 Hasil Pengujian Core Web Vitals

### 4.2.1 Largest Contentful Paint (ms)

| Strategi | light | medium | heavy |
|---|---|---|---|
| CSR-React | 3.224 ± 501 | 8.301 ± 2.904 | 25.989 ± 10.673 |
| CSR-Next | 3.507 ± 448 | 7.411 ± 2.370 | 22.300 ± 9.734 |
| SSG-Next | 3.865 ± 598 | 9.463 ± 2.920 | 23.750 ± 11.303 |
| SSR-Next | 3.991 ± 624 | **5.910 ± 1.205** | **20.602 ± 9.267** |

✍️ **TULIS SENDIRI.** Perhatikan: tidak ada strategi yang unggul di semua kondisi. CSR-React tercepat pada beban ringan, SSR-Next tercepat pada beban sedang dan berat. Jelaskan mengapa urutannya berubah menurut beban.

Nilai LCP yang tinggi disebabkan throttling jaringan tersimulasi yang menjadi bawaan Lighthouse, dikombinasikan dengan beban gambar hingga 26,63 MB pada tier heavy. Yang sahih dibandingkan adalah selisih antar kondisi, bukan nilai absolutnya.

### 4.2.2 Cumulative Layout Shift

CLS bernilai **0,00 pada seluruh 180 pengukuran**, pada keempat strategi dan ketiga tier. Variansnya nol sehingga uji statistik tidak terdefinisi.

Penyebabnya komponen `ProductCard` menetapkan atribut `width` dan `height` pada setiap elemen gambar, sehingga peramban memesan ruang sebelum gambar termuat dan tidak terjadi pergeseran tata letak.

✍️ **TULIS SENDIRI.** Posisikan ini sebagai **temuan**, bukan kegagalan pengukuran: praktik menetapkan dimensi gambar secara eksplisit menghilangkan Cumulative Layout Shift terlepas dari strategi rendering maupun tingkat beban media.

### 4.2.3 First Contentful Paint (ms)

| Strategi | light | medium | heavy |
|---|---|---|---|
| CSR-React | 1.313 ± 155 | 1.276 ± 161 | 1.290 ± 192 |
| CSR-Next | **872 ± 115** | **855 ± 92** | **839 ± 81** |
| SSG-Next | 908 ± 200 | 1.100 ± 202 | 1.477 ± 757 |
| SSR-Next | 901 ± 143 | 913 ± 107 | 842 ± 18 |

✍️ **TULIS SENDIRI.** Perhatikan: seluruh varian Next.js lebih cepat daripada React, **termasuk Next-CSR**. Karena Next-CSR juga mengirim HTML kosong seperti React, perbedaan ini tidak dapat dijelaskan oleh strategi rendering. Lihat pembahasan 4.5.

### 4.2.4 Total Blocking Time (ms)

| Strategi | light | medium | heavy |
|---|---|---|---|
| CSR-React | **0,00 ± 0,00** | **0,00 ± 0,00** | **0,00 ± 0,00** |
| CSR-Next | 77,4 ± 61,6 | 73,2 ± 49,3 | 63,9 ± 15,9 |
| SSG-Next | 53,9 ± 15,3 | 65,9 ± 11,0 | 58,8 ± 11,4 |
| SSR-Next | 60,7 ± 12,2 | 60,3 ± 12,4 | 58,1 ± 12,4 |

CSR-React mencatat TBT nol pada seluruh 180 pengukuran. Pembahasan mengenai sumber perbedaan ini ada pada 4.5.

### 4.2.5 Speed Index (ms)

| Strategi | light | medium | heavy |
|---|---|---|---|
| CSR-React | 1.785 ± 629 | 2.518 ± 661 | 4.257 ± 1.949 |
| CSR-Next | 1.929 ± 506 | 2.558 ± 908 | 4.236 ± 1.080 |
| SSG-Next | **1.554 ± 990** | 1.533 ± 586 | **2.647 ± 567** |
| SSR-Next | 1.650 ± 838 | **1.443 ± 159** | 2.881 ± 773 |

### 4.2.6 Time to Interactive (ms)

| Strategi | light | medium | heavy |
|---|---|---|---|
| CSR-React | 3.225 ± 501 | 8.366 ± 2.924 | 26.356 ± 10.815 |
| CSR-Next | 3.526 ± 453 | 7.467 ± 2.424 | 22.683 ± 9.761 |
| SSG-Next | 3.872 ± 581 | 9.463 ± 2.920 | 23.750 ± 11.303 |
| SSR-Next | 3.991 ± 624 | **5.910 ± 1.205** | **20.602 ± 9.267** |

### 4.2.7 Performance Score

| Strategi | light | medium | heavy |
|---|---|---|---|
| CSR-React | **92,6 ± 3,6** | 76,7 ± 3,6 | 72,7 ± 2,9 |
| CSR-Next | 90,3 ± 3,4 | 77,0 ± 4,1 | 72,5 ± 1,8 |
| SSG-Next | 88,1 ± 4,3 | 76,2 ± 2,5 | 73,5 ± 1,7 |
| SSR-Next | 87,2 ± 4,3 | **79,6 ± 3,0** | **74,3 ± 1,0** |

✍️ **TULIS SENDIRI.** Perhatikan penurunan skor seiring beban media: dari sekitar 90 pada tier light menjadi sekitar 73 pada tier heavy, pada keempat strategi. Ini pendukung visual paling ringkas untuk temuan utama penelitian.

## 4.3 Uji Asumsi Statistik

Dari 35 pengujian yang dilakukan, **tidak satu pun** kelompok data memenuhi asumsi normalitas (Shapiro-Wilk) dan homogenitas varians (Levene) secara bersamaan. Seluruh analisis karena itu menggunakan uji Kruskal-Wallis dengan post-hoc Mann-Whitney berkoreksi Bonferroni.

✍️ **TULIS SENDIRI.** Tegaskan bahwa pemilihan uji non-parametrik merupakan konsekuensi data, bukan preferensi. Rincian p-value setiap uji asumsi tersedia pada `results/analisis.md`.

## 4.4 Hasil Pengujian Hipotesis

### 4.4.1 RQ1 — Pengaruh Strategi Rendering

Diuji terpisah pada setiap tier beban media.

| Metrik | tier light | tier medium | tier heavy |
|---|---|---|---|
| LCP | p = 0,0132 · ε² = 0,158 | p = 0,0014 · ε² = 0,265 | **p = 0,745 · tidak signifikan** |
| FCP | p < 0,001 · ε² = 0,459 | p < 0,001 · ε² = 0,521 | p < 0,001 · ε² = 0,566 |
| TBT | p < 0,001 · ε² = 0,689 | p < 0,001 · ε² = 0,682 | p < 0,001 |

✍️ **TULIS SENDIRI.** Temuan paling penting di tabel ini: **pada tier heavy, perbedaan LCP antar strategi hilang sama sekali.** Jelaskan mengapa — ketika beban media sangat besar, waktu transfer gambar mendominasi keseluruhan LCP sehingga perbedaan cara HTML dirakit menjadi tidak berarti.

### 4.4.2 RQ2 — Pengaruh Variasi Beban Media

Diuji terpisah pada setiap strategi rendering, terhadap LCP.

| Strategi | H | p | ε² |
|---|---|---|---|
| CSR-React | 38,115 | 5,29 × 10⁻⁹ | **0,860** |
| CSR-Next | 39,130 | 3,18 × 10⁻⁹ | **0,884** |
| SSG-Next | 39,130 | 3,18 × 10⁻⁹ | **0,884** |
| SSR-Next | 39,130 | 3,47 × 10⁻⁹ | **0,880** |

Seluruh pasangan tier berbeda signifikan pada setiap strategi (light < medium < heavy).

✍️ **TULIS SENDIRI — ini inti skripsimu.** Bandingkan langsung dengan 4.4.1: beban media menjelaskan sekitar **87%** variasi LCP, sedangkan strategi rendering hanya 0–27% dan bahkan tidak signifikan pada tier heavy. Jelaskan implikasi praktisnya bagi pengembang e-commerce.

### 4.4.3 Analisis Pelengkap — Pemisahan Efek Strategi dan Efek Framework

**Efek framework** (CSR-React versus CSR-Next, strategi sama):

| Metrik | tier light | tier medium | tier heavy |
|---|---|---|---|
| LCP | p = 0,0488 · ε² = 0,103 | **p = 0,694 · tidak signifikan** | **p = 0,788 · tidak signifikan** |
| FCP | p < 0,001 · ε² = 0,742 | p < 0,001 · ε² = 0,742 | p < 0,001 · ε² = 0,742 |
| TBT | p < 0,001 · ε² = 0,853 | p < 0,001 · ε² = 0,853 | p < 0,001 · ε² = 0,853 |

**Efek strategi** (ketiganya pada Next.js), terhadap LCP:

| tier | H | p | ε² |
|---|---|---|---|
| light | 8,655 | 0,0132 | 0,158 |
| medium | 13,121 | 0,0014 | 0,265 |
| heavy | 0,590 | **0,745 · tidak signifikan** | — |

✍️ **TULIS SENDIRI.** Simpulkan peta pengaruhnya:

| Metrik | Dipengaruhi framework | Dipengaruhi strategi |
|---|---|---|
| LCP | tidak signifikan pada tier medium dan heavy | ya, kecuali tier heavy |
| FCP | ya, kuat | — |
| TBT | ya, kuat | tidak |
| CLS | nol pada seluruh pengukuran | nol pada seluruh pengukuran |

Implikasi penting: karena pengaruh framework terhadap LCP tidak signifikan, perbedaan LCP antar strategi memang berasal dari strategi rendering, bukan dari pemilihan framework.

## 4.5 Pembahasan: Sumber Perbedaan Total Blocking Time

Anggapan umum menyatakan TBT yang tinggi pada Next.js berasal dari proses *hydration*. Penelitian ini mengujinya.

| Strategi | TBT | Hydration HTML server |
|---|---|---|
| CSR-React | 0,00 ms | tidak ada |
| **CSR-Next** | **63–77 ms** | **tidak ada** (`ssr: false`) |
| SSG-Next | 54–66 ms | ada |
| SSR-Next | 58–61 ms | ada |

CSR-Next menggunakan `next/dynamic` dengan `ssr: false`, sehingga HTML yang dikirim server kosong dan tidak terdapat apa pun untuk di-*hydrate*. Namun TBT-nya tetap setara dengan SSG dan SSR.

✍️ **TULIS SENDIRI.** Simpulkan: perbedaan TBT berasal dari **runtime framework**, bukan dari proses hydration maupun dari strategi rendering. Tekankan bahwa temuan ini hanya dapat diperoleh karena kondisi CSR pada Next.js disertakan dalam rancangan.

## 4.6 Hasil Pengujian Beban Sisi Server

Diukur pada 100 pengguna virtual simultan, tier light, tanpa kegagalan.

| Strategi | Throughput | Rata-rata | Median | p95 | Maks | Error rate | SLA breach |
|---|---|---|---|---|---|---|---|
| CSR-React | 79 req/s | **51 ms** | 44 ms | 77 ms | 276 ms | 0,00% | 0,00% |
| CSR-Next | 80 req/s | 51 ms | 45 ms | 72 ms | 361 ms | 0,00% | 0,00% |
| SSG-Next | 76 req/s | 109 ms | 102 ms | 173 ms | 788 ms | 0,00% | 0,00% |
| SSR-Next | 70 req/s | **200 ms** | 153 ms | 501 ms | 1.963 ms | 0,00% | 0,00% |

**Error rate** = persentase respons berstatus bukan 200. **SLA breach** = persentase respons melebihi 3 detik. Keduanya dipisahkan karena respons yang lambat tidak berarti server gagal.

✍️ **TULIS SENDIRI.** Urutan waktu respons mengikuti beban komputasi server: penyajian berkas statis paling ringan, diikuti HTML pra-render, dan paling berat rendering ulang setiap request. SSR mencatat waktu respons **3,9 kali** lebih lama dibanding CSR. Inilah trade-off yang menjadi inti RQ3.

Pengujian pada tingkat beban yang lebih tinggi tidak dapat dilakukan secara sah karena keterbatasan yang diuraikan pada 3.8.

## 4.7 RQ4 — Trade-off Sisi Klien dan Sisi Server

✍️ **TULIS SENDIRI — bab ini sepenuhnya milikmu.** Bahan yang tersedia:

| Dimensi | Temuan |
|---|---|
| Beban server | SSR 3,9× lebih berat daripada CSR |
| Kecepatan tampil awal | seluruh varian Next.js unggul FCP — tetapi ini efek framework, bukan strategi |
| Responsivitas | CSR-React TBT nol; seluruh varian Next.js 54–77 ms |
| LCP pada beban berat | perbedaan antar strategi hilang (p = 0,745) |
| Faktor dominan | beban media, ε² ≈ 0,87 |

Susun rekomendasi berbasis kondisi, bukan pemenang tunggal. Contoh arah: kapan CSR lebih tepat, kapan SSG, kapan SSR, dan kapan pilihan strategi menjadi tidak relevan dibanding mengoptimalkan media.

---

# BAB 5 — KESIMPULAN DAN SARAN

## 5.1 Kesimpulan

✍️ **TULIS SENDIRI** — satu kesimpulan menjawab satu rumusan masalah, dengan angka pendukung:

1. **RQ1** — perbandingan performa antar strategi rendering berdasarkan Core Web Vitals
2. **RQ2** — pengaruh variasi beban media (temuan utama, ε² ≈ 0,87)
3. **RQ3** — perbandingan beban server (SSR 3,9× lebih berat, dengan keterbatasan 3.8)
4. **RQ4** — trade-off sisi klien dan sisi server

Temuan tambahan yang layak diangkat:
- Perbedaan Total Blocking Time berasal dari runtime framework, bukan dari hydration
- Pada beban media berat, perbedaan antar strategi rendering menjadi tidak signifikan
- Penetapan dimensi gambar secara eksplisit menghilangkan CLS terlepas dari strategi maupun beban media

## 5.2 Keterbatasan Penelitian

Salin dari `KETERBATASAN.md` — tiga belas butir, masing-masing disertai bukti.

## 5.3 Saran

✍️ **TULIS SENDIRI.** Arah yang dapat diambil: pengukuran dengan field data untuk memperoleh INP, pengujian beban pada infrastruktur tanpa pembatasan mitigasi, penggunaan foto produk asli, serta perluasan ke strategi rendering lain seperti Incremental Static Regeneration atau Partial Prerendering.

---

**Terakhir diperbarui:** 2 November 2026
