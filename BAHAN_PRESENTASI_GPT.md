# Bahan untuk GPT — Membuat PPT Presentasi Bimbingan

> **Instruksi untuk kamu (sebelum paste ke GPT):** tempelkan seluruh isi
> file ini ke GPT, lalu minta: *"Buatkan PPT presentasi singkat (8-10
> slide) untuk bimbingan skripsi besok, berdasarkan Bagian A sampai F
> di bawah. Bagian G hanya untuk referensi kalau saya ditanya detail,
> tidak perlu jadi slide sendiri."*
>
> **Dua hal yang WAJIB kamu isi sendiri** sebelum dipakai: nama dosen
> pembimbing dan tanggal sidang, di Bagian A1 — tidak pernah tercatat di
> mana pun.
>
> ---
>
> Dokumen ini gabungan dua berkas: `PRD_DAN_PANDUAN_BIMBINGAN.md`
> (bagian utama, A-G) dan `KETERBATASAN.md` (lampiran H, detail
> keterbatasan penelitian). Satu koreksi diterapkan: status gambar
> produk diperbarui dari "sintetis" menjadi "foto asli" sesuai kondisi
> sebenarnya saat ini.

---

# PRD & Panduan Bimbingan — Skripsi

> **Dokumen tunggal** — buka file ini saja, seluruh konteks proyek ada di sini.
> **Disiapkan:** 5 November 2026, untuk sesi konsultasi/bimbingan.
> **Sumber:** disusun dari pembacaan ulang `kolokium.txt`, `DISKUSI_JUDUL_SKRIPSI.md`, `RENCANA_REVISI.md`, `KETERBATASAN.md`, `results/analisis.md`, `results/sonarqube.md` — bukan dari ingatan tanpa verifikasi.

---

# BAGIAN A — IDENTITAS & PROYEK (PRD)

## A1. Identitas

| | |
|---|---|
| Nama | Emmanuel Abel Zoe |
| NIM | 71220843 |
| Program Studi | Informatika, Fakultas Teknologi Informasi |
| Universitas | Universitas Kristen Duta Wacana (UKDW), Yogyakarta |
| Dosen pembimbing | ⚠️ **belum tercatat di sistem manapun — isi sendiri sebelum bimbingan** |
| Tanggal sidang/pendadaran | ⚠️ **belum tercatat — isi sendiri, lalu beri tahu saya supaya bisa dihitung mundur** |

## A2. Judul Skripsi

> **Evaluasi Strategi Rendering React dan Next.js pada E-Commerce dengan Variasi Beban Media Menggunakan Core Web Vitals**

Ini judul **final** dari kolokium — berbeda dari judul paling awal di tahap diskusi (lihat A3).

## A3. Kenapa Memilih Judul Ini

**Inti pertanyaan penelitian -- dan ini memang makna literal dari judulnya sendiri:**

Judul skripsi berbunyi **"Evaluasi *Strategi Rendering*"**, bukan "Evaluasi React dan Next.js". Kata kuncinya *strategi rendering* -- yang dibandingkan sejak awal memang **CSR vs SSR vs SSG** (client-side vs server-side), bukan perbandingan dua framework secara umum.

> "Saya ingin mengetahui perbandingan antara Client-Side Rendering dengan Server-Side Rendering dan Static Site Generation -- antara pendekatan client-side dan server-side, mana yang lebih unggul. Dari sisi client-side diwakili React, dari sisi server-side diwakili Next.js."

React dan Next.js di judul berperan sebagai **wakil** dari strategi rendering yang mau diuji -- React mewakili CSR karena itu pendekatan rendering aslinya, Next.js mewakili SSR dan SSG karena itu dua kemampuan utamanya di luar CSR. Kalau dosen bertanya "kenapa bandingkan React dan Next.js", jawabannya bukan "karena ingin tahu framework mana lebih bagus", tapi **"karena React dan Next.js adalah representasi paling natural untuk strategi rendering yang ingin diuji"**.

### Riwayat Keputusan Judul — 2 Tahap

**Tahap 1 — memilih React vs Next.js** (bukan Next.js vs Remix, bukan Laravel vs Next.js). Tiga kandidat dipertimbangkan:

| Kandidat | Kenapa ditolak/dipilih |
|---|---|
| Next.js vs Remix | Hasil diprediksi terlalu mirip (sama-sama SSR-first); Remix kehilangan relevansi industri (di-merge ke React Router v7) |
| Laravel vs Next.js | SonarQube tidak bisa dibandingkan adil antar bahasa (PHP vs TypeScript); terlalu banyak variabel berbeda sekaligus (bahasa, paradigma, runtime) |
| **React vs Next.js** ✅ | Apple-to-apple terbukti (keduanya sama-sama React, beda cuma strategi rendering); hasil pilot study **tidak bisa ditebak** (React menang 7 metrik, Next.js menang 3 — bukan kemenangan mutlak); paling relevan dengan skenario industri nyata |

**Tahap 2 — menambahkan "Variasi Beban Media" sebagai variabel utama.** Judul tahap 1 awalnya berfokus pada *Code Maintainability dan Core Web Vitals*. Di kolokium, judul disempurnakan: maintainability turun jadi analisis **sekunder**, dan **variasi beban media** naik jadi variabel **utama** — karena untuk aplikasi e-commerce, beban gambar/video produk adalah faktor paling realistis memengaruhi performa, dan belum banyak diteliti secara sistematis.

**Kalimat penutup yang bisa disampaikan ke dosen:**
> "Skripsi terbaik bukan judul yang paling keren, tapi yang paling bisa diselesaikan dengan data yang kuat."

## A4. Rumusan Masalah (dari kolokium, tidak berubah)

1. Bagaimana perbandingan performa CSR pada React.js dengan SSR dan SSG pada Next.js berdasarkan metrik Core Web Vitals?
2. Bagaimana pengaruh variasi beban media terhadap performa rendering pada masing-masing pendekatan?
3. Bagaimana perbandingan performa server antara CSR dan SSR/SSG dalam menghadapi peningkatan jumlah pengguna?
4. Bagaimana trade-off yang dihasilkan dari masing-masing strategi rendering terhadap performa klien dan beban server?

## A5. Ringkasan Satu Paragraf (hafalkan ini)

> "Saya membangun dua aplikasi e-commerce yang identik — satu pakai React (Client-Side Rendering), satu pakai Next.js (Server-Side Rendering dan Static Site Generation). Saya uji performanya pakai Core Web Vitals, sambil memvariasikan beban media (gambar dan video produk) dalam tiga tingkat: ringan, sedang, berat. Tujuannya mencari tahu strategi rendering mana yang lebih unggul, dan seberapa besar pengaruh beban media dibanding pengaruh strategi rendering itu sendiri."

---

# BAGIAN B — RANCANGAN PENELITIAN (apa yang dibangun)

## B1. Testbed

| Komponen | Detail |
|---|---|
| Aplikasi 1 | React + Vite, Client-Side Rendering (CSR) |
| Aplikasi 2 | Next.js, dengan **4 kondisi render** (lihat B2) |
| Sumber data | API middleware bersama — kedua aplikasi mengambil 20 produk dari sumber yang sama persis |
| Data produk | Snapshot dari FakeStoreAPI (nama, harga, kategori) |
| Gambar & video | **Foto produk asli** (bukan buatan/sintetis), diunduh dari sumber yang sama dengan data produk, disajikan sendiri lewat middleware dalam 3 tingkat ukuran |

## B2. Empat Kondisi Rendering (bukan 3 seperti proposal awal)

| Kondisi | Framework | Strategi |
|---|---|---|
| CSR-React | React + Vite | Client-Side Rendering |
| CSR-Next | Next.js | Client-Side Rendering (`next/dynamic`, `ssr:false`) |
| SSG-Next | Next.js | Static Site Generation |
| SSR-Next | Next.js | Server-Side Rendering |

**Kenapa ditambah CSR-Next (penyimpangan dari proposal, perlu dijelaskan ke dosen):** pada rancangan awal, CSR hanya diamati di React. Kalau CSR ternyata unggul, tidak bisa dipastikan apakah itu karena *strategi* CSR-nya atau karena *framework* React yang memang lebih ringan dari Next.js. Dengan menambah CSR-Next, pengaruh strategi dan pengaruh framework bisa diuji **terpisah secara statistik**.

## B3. Variasi Beban Media — 3 Tingkat

| Tier | Gambar | Video |
|---|---|---|
| Light | 50–150 KB | 1–5 MB |
| Medium | 200–800 KB | 5–15 MB |
| Heavy | 1–3 MB | 15–50 MB |

Total kombinasi: **4 kondisi rendering × 3 tingkat beban = 12 sel pengujian**, masing-masing diukur **15 kali** → **180 pengukuran** Core Web Vitals.

## B4. Tools Pengukuran

| Aspek | Tool |
|---|---|
| Core Web Vitals (sisi klien) | Google Lighthouse 13.5.0, di atas Brave Browser (berbasis Chromium, setara Chrome) |
| Beban server | Grafana k6 2.3.0 |
| Kualitas kode (sekunder) | SonarQube Community 26.10.0 |
| Analisis statistik | Python + SciPy — Shapiro-Wilk, Levene, Kruskal-Wallis, Mann-Whitney |
| Deployment | Vercel, region Singapura (sin1) — sesuai rencana kolokium |

---

# BAGIAN C — TEMUAN UTAMA (hasil, final, 4 November 2026)

## C1. Headline: Beban Media Paling Dominan

| Faktor terhadap LCP | Signifikansi | Besar pengaruh (ε²) |
|---|---|---|
| **Variasi beban media** | p ≈ 3×10⁻⁹ | **0,88** (identik di keempat kondisi) |
| Strategi rendering | p = 4×10⁻⁷ – 1×10⁻⁷ | 0,65 – 0,71 |
| Framework (React vs Next.js) | p = 4×10⁻⁵ – 3×10⁻⁶ | 0,42 – 0,74 |

**Beban media menjelaskan ~88% variasi kecepatan tampil halaman** — jauh di atas dua faktor lain. Ini jawaban langsung untuk judul skripsi: optimasi media memberi dampak terbesar, tapi strategi rendering dan framework tetap terbukti bermakna secara statistik, bukan faktor yang bisa diabaikan.

## C2. Trade-off Klien vs Server

- **SSR-Next dan SSG-Next konsisten tercepat** pada LCP (kecepatan tampil ke pengguna) di semua tingkat beban
- **CSR-React paling responsif** terhadap interaksi (Total Blocking Time mendekati nol) dan **paling ringan bagi server**
- **SSR-Next justru paling berat bagi server** — waktu respons server ~4× lebih lambat dibanding CSR pada 100 pengguna simultan
- **Tidak ada satu strategi yang menang di semua aspek** — inilah trade-off yang menjadi inti pembahasan

## C3. SonarQube (Kualitas Kode, Sekunder)

| Metrik | React | Next.js |
|---|---|---|
| Maintainability Rating | A | A |
| Security Rating | A | A |
| Duplikasi kode | 0,0% | 0,0% |
| Bugs | 2 | 1 |

Kedua aplikasi setara soal kebersihan kode. Bug yang ditemukan (3 total) semuanya jenis sama (*floating promise* pada `useEffect`), bukan indikasi kualitas yang berbeda.

---

# BAGIAN D — STATUS PEKERJAAN

| Tahap | Status |
|---|---|
| Testbed (2 aplikasi, 4 kondisi rendering) | ✅ Selesai |
| Deployment produksi (7 layanan di Vercel) | ✅ Selesai |
| Pengukuran Core Web Vitals (180 run) | ✅ Selesai |
| Load testing server | ✅ Selesai (terbatas 100 pengguna — lihat Bagian E poin 1) |
| Analisis SonarQube | ✅ Selesai |
| Analisis statistik | ✅ Selesai |
| Bab 4 (Hasil Penelitian) | ✅ Selesai (14 tabel, di `skripsi_1.docx`) |
| 3 masukan kolokium dijawab | ✅ Selesai |
| Bab 5 (Kesimpulan & Saran) | ⬜ Belum ditulis — menunggu arahan |
| Penyesuaian redaksional Bab 1–3 | 🟡 Sebagian |

---

# BAGIAN E — KENDALA YANG DITEMUKAN (akademis, layak disampaikan ke dosen)

## 1. Load testing tidak bisa sampai 500/1000 pengguna seperti rencana awal

Di atas 100 pengguna simultan, platform hosting (Vercel) otomatis menganggap itu serangan dan menghadang permintaan pengujian — **bukan karena aplikasi gagal**. Dibuktikan: halaman statis sederhana pun ikut terhadang pada beban yang sama (padahal CDN tidak mungkin kewalahan di request serendah itu). Data sah sampai 100 pengguna; di atas itu tidak bisa diandalkan.

## 2. Alat ukur performa sempat memberi hasil keliru

Pengukuran pertama (sebelum diperbaiki) memakai pengaturan default Lighthouse yang ternyata **mensimulasikan** jaringan lambat, bukan benar-benar memperlambatnya. Pada kondisi CSR (yang menukar total tampilan dari "Loading..." ke produk), simulasi ini salah mengenali elemen yang jadi acuan kecepatan. **Ditemukan sebelum dipakai**, diperbaiki, seluruh 180 pengukuran diulang dengan pengaturan yang benar-benar menerapkan perlambatan jaringan.

## 3. Rancangan awal punya celah metodologis

Karena CSR cuma diamati di React, pengaruh strategi dan pengaruh framework tidak bisa dibedakan. Solusinya menambah satu kondisi (CSR juga di Next.js) — dijelaskan di Bagian B2.

---

# BAGIAN F — PERTANYAAN UNTUK DOSEN (urut prioritas)

1. **Load testing cuma 100 pengguna** — cukup dinyatakan sebagai keterbatasan penelitian, atau perlu diusahakan pindah ke server sendiri untuk dapat angka 500/1000?

2. **Gambar dan video produk** — sudah foto asli (bukan buatan), tapi sumbernya sama dengan sumber data (FakeStoreAPI), bukan dari toko sungguhan. Apakah ini cukup?

3. **Boleh lanjut ke Bab 5?** Semua data dan analisis sudah lengkap.

4. **Penambahan kondisi CSR-Next** (Bagian B2) — perlu revisi proposal formal, atau cukup dijelaskan di Bab 3 sebagai penyempurnaan metodologi?

5. **Versi Next.js** — proposal menyebut 16.2.1, yang dipakai sekarang 16.4.3 (rilis lebih baru, perbaikan keamanan). Perlu direvisi di dokumen resmi?

6. **Istilah "Core Web Vitals" di Batasan Masalah** — proposal menyebut 5 metrik sebagai Core Web Vitals, padahal yang resmi cuma LCP, CLS, INP. Sudah diperbaiki di naskah revisi — cukup diperbaiki sendiri atau perlu dikonsultasikan dulu?

---

# BAGIAN G — RUJUKAN DOKUMEN LAIN (kalau dosen minta detail lebih)

| Dokumen | Isi |
|---|---|
| `skripsi_1.docx` | Naskah lengkap Bab 1–4, highlight kuning pada setiap perubahan dari proposal |
| `KETERBATASAN.md` | 14 keterbatasan penelitian, masing-masing dengan bukti |
| `TANYA_JAWAB_SIDANG.md` | 20+ tanya-jawab persiapan sidang, lebih teknis |
| `results/analisis.md` | Hasil uji statistik lengkap, semua metrik |
| `results/sonarqube.md` | Detail analisis kualitas kode |
| `REVISI_KOLOKIUM.md` | 13 revisi naskah kolokium, format lama-vs-baru |

---

**Terakhir diperbarui:** 5 November 2026

---

# BAGIAN H — LAMPIRAN: DETAIL KETERBATASAN PENELITIAN

> Dipakai hanya kalau dosen minta penjelasan lebih dalam soal kendala.
> Tidak perlu jadi slide tersendiri di PPT utama.

# ⚠️ Keterbatasan Penelitian

> **Diperbarui:** 2 November 2026
> **Kegunaan:** bahan langsung untuk subbab *Keterbatasan Penelitian* di Bab 3 dan Bab 5.
> **Prinsip:** setiap keterbatasan disertai **bukti** dan **alasan mengapa tidak dapat dihindari**. Sebutkan sendiri sebelum penguji menemukannya.

---

## 1. 🔴 Load testing terbatas pada 100 pengguna virtual

**Masalah.** Kolokium 8.2.1 menjanjikan pengujian pada 100, 500, dan 1000 pengguna virtual simultan. Yang berhasil diukur secara sah hanya **100 pengguna virtual**.

**Penyebab.** Vercel menjalankan mitigasi DDoS otomatis pada seluruh plan, termasuk Hobby. Ketika beban mencapai 500 pengguna virtual, platform mulai menghadang request dengan halaman *Security Checkpoint*.

**Bukti.**

| Bukti | Nilai |
|---|---|
| Header respons | `x-vercel-mitigated: challenge` |
| Status | HTTP 403 pada seluruh endpoint |
| Dashboard firewall | **100.300** request *challenge* vs 50.500 *allow* |
| Ketersediaan bypass | `Bypass — Requires Pro or Enterprise` |

**Bukti bahwa ini BUKAN keterbatasan arsitektur:**

1. **CSR-React ikut gagal 16%**, padahal hanya menyajikan berkas statis dari CDN. CDN tidak mungkin tumbang pada 181 request/detik.
2. **Throughput justru turun saat error naik.** Burst pendek 900 VU ke target yang sama mencatat **605 req/s dengan 0% error**; ramp panjang ke 1000 VU mencatat **181 req/s dengan 56% error**. Target dan mesin identik — yang berbeda hanya durasi beban. Pola ini hanya masuk akal bila ada pihak yang menolak request, bukan bila server kewalahan.
3. **Mitigasi tidak membedakan browser.** Diuji dengan user-agent curl, Chrome, dan Brave dari IP yang sama — ketiganya 403.

**Mengapa tidak diatasi.** Pengecualian IP (*system bypass*) hanya tersedia pada plan berbayar. Menyebarkan beban dari banyak IP untuk menghindari deteksi menyerupai pola serangan dan tidak dapat dipertanggungjawabkan secara etis.

**Yang tetap dapat disimpulkan.** Pada 100 pengguna virtual dengan nol error, perbedaan antar strategi sudah tegas:

| Strategi | Rata-rata respons |
|---|---|
| CSR-React | 51 ms |
| CSR-Next | 51 ms |
| SSG-Next | 109 ms |
| SSR-Next | **200 ms** |

SSR **3,9× lebih berat** daripada CSR. Trade-off yang menjadi inti RQ3 terbukti.

**Rumusan untuk Bab 3:**

> "Pengujian beban hanya dapat dilakukan secara sah hingga 100 pengguna virtual simultan. Pada tingkat beban yang lebih tinggi, mitigasi DDoS otomatis platform mulai menghadang request dengan halaman verifikasi, sehingga yang terukur bukan lagi kapasitas aplikasi melainkan ambang perlindungan platform. Hal ini dibuktikan oleh header respons `x-vercel-mitigated: challenge` serta oleh fakta bahwa aplikasi berbasis berkas statis pun mengalami kegagalan pada tingkat beban yang sama. Pengecualian alamat IP pengujian hanya tersedia pada plan berbayar."

**Catatan tambahan yang dapat diangkat sebagai temuan:** pada platform terkelola, batas praktis jumlah pengguna simultan ditentukan oleh ambang mitigasi platform, bukan oleh kapasitas komputasi aplikasi. Untuk konteks e-commerce, informasi ini relevan secara praktis.

**Status:** terbuka. Dapat diatasi dengan plan berbayar atau VPS mandiri bila diperlukan.

---

## 2. Cakupan RQ3 tidak mencakup variasi beban media

k6 hanya mengunduh dokumen HTML, **tidak mengunduh gambar**. Ukuran HTML praktis sama pada ketiga tier karena yang berbeda hanya alamat gambar, bukan gambarnya.

Konsekuensinya, pengujian beban mengukur **biaya generasi dokumen di sisi server**, sedangkan pengaruh variasi beban media berada di **sisi klien** dan diukur terpisah melalui Lighthouse. Pengujian beban hanya dijalankan pada satu tier.

**Status:** disengaja, dinyatakan sebagai pembatasan cakupan.

---

## 3. Istilah Core Web Vitals

Core Web Vitals resmi saat ini adalah **LCP, CLS, dan INP**. FCP, TBT, Speed Index, dan TTI **bukan** Core Web Vitals melainkan metrik performa Lighthouse pendukung.

**INP tidak diukur** karena memerlukan data interaksi pengguna nyata (*field data*), sedangkan penelitian ini berbasis laboratorium. **TBT dipakai sebagai proksi** responsivitas dan disebut sebagai proksi.

**Status:** perlu diperbaiki di Batasan Masalah #2 yang masih menyebut kelimanya sebagai Core Web Vitals.

---

## 4. Lab data, bukan field data

Seluruh pengukuran memakai Lighthouse dengan emulasi perangkat mobile dan throttling jaringan tersimulasi. Nilai absolutnya tidak mewakili kondisi jaringan pengguna nyata — LCP tier heavy mencapai 20–26 detik karena simulasi jaringan lambat dengan 26,63 MB gambar.

Yang sahih adalah **perbandingan antar kondisi**, bukan nilai absolutnya.

**Status:** melekat pada metode, dinyatakan apa adanya.

---

## 5. ✅ DIPERBARUI — Gambar produk kini foto asli, bukan lagi sintetis

~~Gambar dihasilkan secara deterministik oleh `scripts/generate-media.py`, bukan foto produk asli.~~ **Status ini sudah tidak berlaku.**

Gambar produk sekarang diunduh langsung dari sumber data (FakeStoreAPI) -- foto produk sungguhan, bukan buatan. Ukuran byte tetap terkendali presisi lewat kompresi otomatis ke tiga tingkat target, dan ketiga tier tetap berasal dari satu foto sumber yang sama per produk.

**Status:** selesai diperbarui, 4 November 2026.

---

## 6. Browser host bukan Google Chrome

Pengukuran dijalankan di atas **Brave Browser 154.1.96.59**, bukan Google Chrome. Keduanya berbasis Chromium dengan mesin render dan engine JavaScript identik.

Aplikasi uji tidak memuat resource pihak ketiga sama sekali, sehingga fitur pemblokiran bawaan Brave tidak memiliki sasaran. Diverifikasi empiris: seluruh request gambar terunduh penuh pada setiap run.

**Catatan penting:** user-agent melaporkan diri sebagai `HeadlessChrome/154.0.0.0`, sehingga berkas data tidak membedakannya. Browser sebenarnya **wajib dinyatakan eksplisit** di Bab 3.

**Status:** dapat diterima, wajib dinyatakan.

---

## 7. Atribusi strategi dan framework pada kondisi CSR

Batasan Masalah #1 menetapkan CSR diwakili React serta SSR dan SSG diwakili Next.js. Karena React tanpa framework tambahan tidak mendukung rendering di sisi server, grid simetris tidak dapat dibentuk.

**Sudah ditangani sebagian:** kondisi CSR pada Next.js ditambahkan sebagai analisis pelengkap, sehingga efek strategi dan efek framework dapat dipisahkan. Hasilnya efek framework terhadap LCP **tidak signifikan** (p = 0,69 pada tier medium; p = 0,79 pada tier heavy).

**Sisa keterbatasan:** analisis utama tetap mengikuti Batasan Masalah, sehingga pemisahan tersebut berstatus pelengkap, bukan desain utama.

**Status:** sebagian besar tertutup.

---

## 8. CLS tidak dapat diuji secara statistik

CLS bernilai **0,00 pada seluruh 180 run**, pada keempat strategi dan ketiga tier. Variansnya nol sehingga uji statistik tidak terdefinisi.

Penyebabnya komponen `ProductCard` menetapkan `width` dan `height` pada setiap elemen `<img>`, sehingga browser memesan ruang sebelum gambar termuat.

**Tulis sebagai temuan, bukan kegagalan:** praktik menetapkan dimensi gambar secara eksplisit menghilangkan Cumulative Layout Shift terlepas dari strategi rendering maupun beban media.

**Status:** melekat pada desain aplikasi, dilaporkan sebagai temuan.

---

## 9. Jumlah gambar yang terunduh 13 dari 20

Enam belas dari dua puluh kartu memakai `loading="lazy"`. Pada viewport mobile yang menjadi default Lighthouse, gambar di bawah lipatan layar tidak diunduh.

**Bukan anomali:** angkanya **13 pada seluruh 180 run tanpa kecuali** — nol variasi. Empat kartu pertama sengaja dibuat `eager` karena menjadi kandidat LCP.

**Status:** perilaku yang benar, dinyatakan agar tidak disalahpahami.

---

## 10. Aset media disajikan melalui function, bukan CDN statis

Vercel menjalankan Express secara native, sehingga `express.static` melayani gambar melalui serverless function, bukan langsung dari CDN.

**Dampak terhadap validitas: tidak ada** — keempat strategi menerima media melalui jalur yang persis sama, sehingga tetap merupakan variabel terkontrol. Terbukti dari byte gambar yang identik di keempat strategi pada setiap tier.

**Status:** dapat diterima, dinyatakan untuk transparansi.

---

## 11. Variabilitas tinggi pada tier heavy

Simpangan baku LCP mencapai **11.303 ms** pada SSG tier heavy. Untuk tier heavy, **laporkan median di samping mean**, karena mean mudah tertarik oleh outlier.

Variabilitas inilah yang membuat seluruh 35+ pengujian memakai Kruskal-Wallis — tidak satu pun kelompok lolos asumsi normalitas dan homogenitas varians.

**Status:** melekat pada data, ditangani dengan uji non-parametrik.

---

## 12. Data pilot study tidak sebanding

Pilot study 24 Maret 2026 dijalankan pada Next.js 15, Node v22, Lighthouse 13.0.3, k6 1.6.1, di localhost, dengan n = 1.

Data final memakai Next.js 16.4.3 (bundler Turbopack), Node v26, Lighthouse 13.5.0, k6 2.3.0, di Vercel sin1, dengan n = 15.

**Jangan mencampur angkanya.** Posisikan pilot study sebagai *proof-of-concept* yang membuktikan penelitian dapat dikerjakan.

**Status:** diselesaikan dengan pelabelan ulang.

---

## 13. SonarQube mengukur SAST, bukan SCA

SonarQube menganalisis source code sendiri (*static application security testing*). Ia **tidak memindai kerentanan dependency** (*software composition analysis*).

Karena itu "Security Rating A" **tidak berarti aplikasinya aman**. Konsisten dengan Batasan Masalah #7 yang menempatkan keamanan di luar cakupan.

**Status:** perlu dinyatakan saat menulis bagian maintainability.

---

## 14. ✅ RESOLVED — Lighthouse `throttlingMethod: simulate` sempat menghasilkan LCP tidak valid

**Masalah yang ditemukan.** Pengukuran 180 run pertama (sebelum perbaikan ini) memakai pengaturan bawaan Lighthouse, `throttlingMethod: "simulate"`. Pada metode ini, jaringan sungguhan berjalan di kecepatan asli (cepat), lalu metrik performa **dihitung ulang** lewat model matematis -- bukan diukur langsung dari observasi nyata.

Untuk strategi CSR (yang menukar total DOM dari teks "Loading..." menjadi grid produk setelah data diterima), model simulasi ini salah mengidentifikasi elemen LCP. Akibatnya, **13 dari 15 run CSR-React dan 14 dari 15 run CSR-Next pada tier heavy** menghasilkan LCP yang terkunci pada teks pemuatan awal (sekitar 2 detik), bukan pada gambar produk yang sesungguhnya -- padahal 29-38 MB gambar dan video masih diunduh di latar belakang saat trace pengukuran berakhir.

**Bukti diagnostik:** pada run yang rusak, FCP, LCP, dan TTI tercatat sangat berdekatan (misalnya 1.220 / 2.301 / 2.301 ms) walau ukuran halaman mencapai puluhan megabita -- pola klasik metrik yang "terkunci" pada tampilan awal, bukan tampilan akhir.

**Perbaikan.** Seluruh 180 pengukuran diulang dengan `throttlingMethod: "devtools"` (throttling jaringan diterapkan sungguhan, bukan disimulasikan secara matematis) dan `max-wait-for-load` diperpanjang menjadi 240 detik. Hasilnya diverifikasi bersih: 0 dari 15 run pada tiap sel tier heavy menunjukkan gejala serupa, dan LCP naik konsisten dari tier light ke heavy pada keempat strategi.

**Dampak pada kesimpulan.** Kesimpulan awal bahwa "efek framework tidak signifikan terhadap LCP" dan "efek strategi hilang pada tier heavy" **terbukti keliru** -- keduanya berasal dari data yang cacat. Dengan data yang benar, baik efek strategi rendering maupun efek framework terbukti signifikan pada ketiga tier, dengan efek strategi justru menguat pada tier heavy (ε² = 0,714, tertinggi di antara ketiga tier).

**Status:** ✅ diperbaiki dan diverifikasi sebelum data final digunakan. Dicatat di sini sebagai bentuk transparansi proses penelitian -- bukan disembunyikan -- karena menunjukkan proses verifikasi yang cermat terhadap validitas instrumen pengukuran.

---

# Ringkasan status

| # | Keterbatasan | Status |
|---|---|---|
| 1 | Load testing terbatas 100 VU | 🔴 terbuka |
| 2 | RQ3 tidak mencakup variasi media | ✅ disengaja |
| 3 | Istilah Core Web Vitals | 🟡 perbaiki dokumen |
| 4 | Lab data, bukan field data | ✅ dinyatakan |
| 5 | Gambar produk | ✅ sudah foto asli (FakeStoreAPI), tidak lagi sintetis |
| 6 | Browser Brave, bukan Chrome | ✅ dinyatakan |
| 7 | Atribusi strategi vs framework | ✅ sebagian tertutup |
| 8 | CLS tidak dapat diuji | ✅ jadi temuan |
| 9 | 13 dari 20 gambar | ✅ perilaku benar |
| 10 | Media lewat function | ✅ tidak berdampak |
| 11 | Variabilitas tier heavy | ✅ ditangani |
| 12 | Pilot study tidak sebanding | ✅ dilabeli ulang |
| 13 | SonarQube SAST bukan SCA | 🟡 perbaiki saat menulis |
| 14 | Lighthouse throttling simulate -> LCP tidak valid | ✅ ditemukan & diperbaiki |

---

**Terakhir diperbarui:** 4 November 2026 (koreksi status gambar produk saat digabung untuk bahan presentasi)
