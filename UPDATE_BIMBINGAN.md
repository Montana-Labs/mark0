# Update Progres Skripsi — Bahan Bimbingan

> **Disiapkan:** 4 November 2026
> **Judul:** Evaluasi Strategi Rendering React dan Next.js pada E-Commerce dengan Variasi Beban Media Menggunakan Core Web Vitals
> **Tujuan dokumen:** ringkasan untuk dipresentasikan singkat saat bimbingan — detail teknis lengkap ada di `RENCANA_REVISI.md`, `KETERBATASAN.md`, dan `TANYA_JAWAB_SIDANG.md` kalau sewaktu-waktu diminta.

---

## 1. Ringkasan Singkat

Sejak kolokium, testbed sudah **dibangun, di-deploy, dan diukur penuh**. Tiga masukan dosen saat kolokium sudah dijawab. Pengumpulan data Core Web Vitals (180 pengukuran) dan load testing sudah selesai, teranalisis secara statistik, dan hasilnya sudah dituangkan ke draf Bab 4.

**Yang sudah selesai:** implementasi testbed, deployment produksi, pengukuran Core Web Vitals lengkap, load testing, analisis statistik, draf Bab 4.
**Yang belum:** analisis SonarQube (maintainability, sekunder), penulisan Bab 5 (kesimpulan & saran), beberapa penyesuaian redaksional di Bab 1–3.

---

## 2. Jawaban atas 3 Masukan Kolokium

| # | Masukan Dosen | Jawaban |
|---|---|---|
| 1 | Aplikasi e-commerce apa yang dipakai — buatan sendiri atau CMS? | **Dibangun sendiri**, bukan CMS (WordPress/WooCommerce, Shopify). Alasan: CMS membawa arsitektur rendering sendiri yang tidak bisa diganti bebas, sehingga strategi rendering tidak bisa diisolasi sebagai variabel bebas. Data produk dasar tetap bersumber dari FakeStoreAPI sebagai snapshot tetap; gambar dan video disajikan sendiri oleh API middleware. |
| 2 | Metrik apa untuk performa server? | Empat metrik dari k6: **waktu respons** (rata-rata, median, p95, maksimum), **throughput** (request/detik), **error rate** (respons bukan 200), dan **SLA breach rate** (respons di atas 3 detik) — dua metrik kegagalan sengaja dipisah karena respons lambat tidak sama dengan server gagal. |
| 3 | Perbanyak daftar pustaka dan sitasi | **3 sitasi baru ditambahkan**, masing-masing diverifikasi langsung ke sumbernya (bukan hasil tebakan): Anggraini (2024) untuk dasar uji Kruskal-Wallis, Danutirta dkk. (2026) untuk metrik load testing k6, dan web.dev/Google (2025) untuk definisi resmi Core Web Vitals terkini. |

---

## 3. Perubahan Rancangan Penelitian

Dibanding proposal kolokium, ada **satu penambahan rancangan** yang disengaja:

**Kondisi CSR ditambahkan pada Next.js** (selain CSR-React, SSG-Next, SSR-Next yang sudah ada di proposal). Alasannya: pada rancangan awal, CSR hanya diamati di React, sehingga pengaruh *strategi rendering* dan pengaruh *framework* tidak bisa dipisahkan — kalau CSR ternyata unggul, belum tentu itu karena strateginya atau karena React memang lebih ringan dari Next.js.

Dengan menambahkan CSR-Next, penelitian memperoleh **empat kondisi rendering**, diuji pada **tiga tingkat beban media**, menghasilkan **12 sel pengujian** (sebelumnya 9). Analisis utama tetap mengikuti Batasan Masalah (CSR diwakili React, SSR/SSG diwakili Next.js) — kondisi CSR-Next berstatus **analisis pelengkap** yang memperkuat, bukan mengganti, analisis utama.

---

## 4. Metodologi Pengumpulan Data

| Aspek | Detail |
|---|---|
| Jumlah pengukuran | 12 sel x 15 pengulangan = **180 pengukuran Core Web Vitals** |
| Tool pengukuran klien | Google Lighthouse 13.5.0, di atas Brave Browser (berbasis Chromium, sama dengan Chrome) |
| Tool pengukuran server | Grafana k6 2.3.0 |
| Platform deployment | Vercel, region Singapura (sin1) — sesuai rencana kolokium |
| Variasi beban media | Gambar produk asli (bukan dummy/sintetis) dalam 3 tingkat ukuran; video banner produk dalam 3 tingkat ukuran |
| Analisis statistik | Python (SciPy): Shapiro-Wilk, Levene, Kruskal-Wallis, Mann-Whitney dengan koreksi Bonferroni |

**Catatan proses:** pengukuran pertama kali sempat menghasilkan data yang keliru pada kondisi beban terberat akibat pengaturan default salah satu alat ukur (Lighthouse). Hal ini **ditemukan sebelum dipakai**, diperbaiki, dan seluruh 180 pengukuran diulang dengan pengaturan yang benar. Dicatat secara terbuka di `KETERBATASAN.md` sebagai bagian dari transparansi proses penelitian.

---

## 5. Temuan Utama

### Beban media adalah faktor paling dominan

| Faktor terhadap LCP | Signifikansi | Besar pengaruh (ε²) |
|---|---|---|
| **Variasi beban media** | p ≈ 3×10⁻⁹ | **0,86 – 0,88** (tertinggi) |
| Strategi rendering | p = 4×10⁻⁷ – 1×10⁻⁷ | 0,65 – 0,71 |
| Framework (React vs Next.js) | p = 4×10⁻⁵ – 3×10⁻⁶ | 0,42 – 0,74 |

Variasi beban media menjelaskan **sekitar 87% variasi LCP** — jauh di atas dua faktor lain. Ini menjawab langsung judul penelitian: optimasi media memberi dampak paling besar bagi performa, tetapi pemilihan strategi rendering dan framework tetap terbukti bermakna secara statistik, bukan faktor yang bisa diabaikan.

### Trade-off sisi klien vs sisi server

- **SSR-Next dan SSG-Next konsisten tercepat** pada Largest Contentful Paint (kecepatan tampil ke pengguna) di seluruh tingkat beban media
- **CSR-React paling responsif terhadap interaksi** (Total Blocking Time mendekati nol) dan **paling ringan bagi server** (waktu respons rata-rata 51 ms)
- **SSR-Next justru paling berat bagi server** — waktu respons rata-rata 200 ms, **hampir 4 kali lipat** dibanding CSR, pada beban 100 pengguna simultan
- Jadi strategi yang tercepat tampil ke pengguna (SSR) adalah yang paling berat bagi server, dan strategi paling ringan bagi server (CSR) tampil lebih lambat ke pengguna — **tidak ada satu strategi yang menang di semua aspek.** Inilah trade-off yang menjadi inti pembahasan penelitian

---

## 6. Status Pekerjaan

| Tahap | Status |
|---|---|
| Implementasi testbed (2 aplikasi, 4 kondisi rendering) | ✅ Selesai |
| Deployment produksi (Vercel, 7 project) | ✅ Selesai |
| Pengukuran Core Web Vitals (180 run) | ✅ Selesai |
| Load testing server (k6) | ✅ Selesai (terbatas 100 pengguna virtual — lihat poin 7) |
| Analisis statistik | ✅ Selesai |
| Draf Bab 4 (Hasil Penelitian) | ✅ Selesai |
| Analisis SonarQube (maintainability, sekunder) | ⬜ Belum dikerjakan |
| Bab 5 (Kesimpulan & Saran) | ⬜ Belum ditulis |
| Penyesuaian redaksional Bab 1–3 | 🟡 Sebagian — menunggu arahan dosen |

---

## 7. Hal yang Ingin Didiskusikan / Mohon Arahan

1. **Load testing terbatas pada 100 pengguna virtual**, bukan 100/500/1000 seperti rencana awal. Pada beban di atas itu, mekanisme keamanan otomatis platform hosting (Vercel) menghadang permintaan pengujian — bukan karena aplikasi gagal. Sudah dibuktikan: bahkan halaman berisi berkas statis pun ikut terhadang pada beban yang sama. Mohon arahan: apakah ini cukup dinyatakan sebagai keterbatasan penelitian, atau perlu diusahakan lebih jauh (misalnya memakai server sendiri di luar Vercel)?

2. **Gambar dan video produk** — sudah memakai foto produk asli (bukan sintetis), diambil dari sumber data yang sama dengan datanya (FakeStoreAPI). Mohon konfirmasi apakah ini sudah cukup memadai, atau perlu foto/video yang benar-benar dari toko sungguhan.

3. **Urutan pengerjaan selanjutnya** — apakah boleh menulis Bab 5 dulu berdasarkan data yang sudah ada, sambil SonarQube dikerjakan paralel? Atau SonarQube harus selesai dulu sebelum Bab 5 ditulis?

---

**Terakhir diperbarui:** 4 November 2026
