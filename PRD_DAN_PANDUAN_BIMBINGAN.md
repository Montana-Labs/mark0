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

**Motivasi personal (sampaikan ini duluan, baru masuk ke riwayat keputusan di bawah):**

> "Saya ingin mengetahui perbandingan antara Client-Side Rendering dengan Server-Side Rendering dan Static Site Generation -- antara pendekatan client-side dan server-side, mana yang lebih unggul. Dari sisi client-side diwakili React, dari sisi server-side diwakili Next.js."

Ini pertanyaan dasar yang mendorong seluruh penelitian: **bukan "React vs Next.js" sebagai perang framework**, melainkan **CSR vs SSR/SSG** sebagai perbandingan dua filosofi rendering yang berbeda -- React dipilih sebagai representasi CSR karena itu pendekatan rendering aslinya, Next.js dipilih sebagai representasi SSR/SSG karena itu dua kemampuan utamanya di luar CSR.

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
