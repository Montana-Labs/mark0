# Hasil Bimbingan 2 — Pak Dito, 9 November 2026

Dosen pembimbing: **Pak Dito**. Sumber: rekaman `bimbingan2skripsi.m4a` (disimpan di luar repo oleh penulis), diringkas oleh penulis.
Pasangan dokumen: `BIMBINGAN_1_HASIL.md` (Bu Nila, 5 November 2026).

---

## 1. Ringkasan

- Target pendaftaran pendadaran: **Desember 2026**.
- Pak Dito **menyetujui** arah pindah ke server lokal, penambahan CSR-Next, dan kenaikan versi Next.js.
- Ada **dua tugas baru**: telusuri pustaka dari paper acuan (untuk 4 metrik k6) dan siapkan argumen pembatasan format media (JPG & MP4).
- Ada **satu keputusan terbuka**: tingkat VU (100 saja, atau 100 + 500). Lihat bagian 5.

## 2. Dikonfirmasi / Disetujui

| Hal | Tanggapan Pak Dito |
|---|---|
| Variasi beban media (gagasan Pak Dito di kolokium) | Terbukti berpengaruh: tanpa variasi, hasil React vs Next.js hampir tidak berbeda. |
| 4 kondisi (React CSR, Next CSR, Next SSG, Next SSR) | Tidak ada keberatan. |
| Aplikasi e-commerce buatan sendiri (bukan CMS) | Tidak ada keberatan; throughput dan jaringan bisa dikontrol penuh. |
| Pindah load test ke **server lokal** (usulan Bu Nila) | **Sangat setuju**: spesifikasi hardware pasti dan seragam; terhindar dari fluktuasi latensi internet. |
| Next.js naik 16.2.1 → 16.4.3 (security patch) | **Tidak masalah.** Wajib dicatat lengkap di Batasan Masalah dan bab Alat dan Bahan. |
| Bab 1 dan Bab 3 dirombak | Penulis konfirmasi sedang dirombak (akibat server lokal + metrik baru). |

## 3. TUGAS — Sitasi 4 Metrik k6: Telusuri Referensi (*Citation Tracing*)

Penulis menunjukkan artikel pembanding yang memakai JMeter. Trik dari Pak Dito:

> Buka daftar pustaka paper acuan → cari referensi yang mereka pakai untuk pengujian beban → kutip **jurnal aslinya**.

Aturan tahun: teori umum diutamakan **5 tahun terakhir**; rumus/teori dasar boleh lebih lama.

**Titik awal penelusuran** (dari paper Hermanto & Engel 2025, TIN 6(5), DOI 10.47065/tin.v6i5.8315):
- Kalimat tentang JMeter dan ketahanan sistem merujuk ke **Ismail, A., Ananta, A. Y., Arief, S. N., & Hamdana, E. N. (2023).** *Performance Testing Sistem Ujian Online Menggunakan Jmeter Pada Lingkungan Virtual.* Jurnal Informatika Polinema, 9(2). DOI: 10.33795/jip.v9i2.1190. **Belum dibuka isinya**, baru entri daftar pustakanya yang terlihat.
- Paper Handoko dkk. (2026, TIN 7(1), DOI 10.47065/tin.v7i1.9838) menyebut throughput, response time, error rate, CPU, dan memori sebagai "indikator utama", dengan rujukan **Hanggara dkk. (2022)** dan **Oktafianto dkk. (2025)**. Topik paper itu (REST API) tidak cocok sebagai rujukan utama, tetapi dua sitasi ini bisa ditelusuri sebagai jurnal asli untuk metrik.

Status: 🔴 belum dikerjakan. Catatan: metrik ke-4 (SLA breach / threshold) belum punya jurnal pendukung.

## 4. TUGAS — Pembatasan Format Media (JPG & MP4)

Pak Dito mengingatkan penguji hampir pasti bertanya: *"Kenapa hanya JPG dan MP4? Kenapa bukan PNG, WebP, AVI/RAW?"*

Poin dari Pak Dito:
- Algoritma kompresi sangat memengaruhi ukuran. Pada video, hanya bagian yang bergerak yang banyak membebani; video diam berdurasi 1 jam bisa lebih ringan daripada video 10 detik penuh gerakan.
- Saran: standarkan ukuran/kualitas video lewat resolusi ekspor dan bitrate.

Yang sudah ada di repo (`scripts/generate-video.py`) dan bisa dipakai menjawab:
- Durasi tetap **4 detik** di ketiga tier; gerakan sama (pan-zoom lambat); resolusi **1280×720**, **25 fps**.
- Yang divariasikan hanya **bitrate**. Jadi pengaruh gerakan konten sudah dikendalikan.

Yang masih perlu disiapkan: argumen tertulis kenapa JPG dan MP4 (misalnya format paling umum di e-commerce dan didukung semua browser), dengan sitasi. Status: 🔴 belum dikerjakan.

## 5. KEPUTUSAN TERBUKA — Tingkat Virtual Users

| Sumber | Arahan |
|---|---|
| Bu Nila (bimbingan 1) | Pindah ke PC fisik di LAN; rencana awal 100/500/1000 VU. |
| Pak Dito (bimbingan 2) | **100 VU sudah cukup** bila pola *scale up/down* sudah terbaca. Penulis ingin sampai 500 VU; Pak Dito **menyetujui**, dengan syarat alasan pemilihan tingkat VU ditulis di **Batasan Masalah** dan bab analisis. |

Perlu diputuskan: 100 saja, atau 100 + 500, atau tetap 100/500/1000. Apa pun pilihannya, alasannya harus tertulis.

Bukti 100 VU yang sudah ada: `results/k6-valid/*_light_100vu.json` (target Vercel, 4 kondisi, 0% error). Contoh yang disebut saat bimbingan: CSR-React ±5.000 request, ±80 req/s, rata-rata ±51 ms.

## 6. Tips Sidang Pendadaran dari Pak Dito

1. **Latihan di depan teman.** Pertanyaan kritis teman biasanya mirip pertanyaan penguji.
2. **Siapkan alasan teknis untuk setiap pilihan**, bukan "karena bisanya itu" (contoh: alasan memilih C++ dijawab dengan keunggulan komputasi dan parsing).
3. **Slide cadangan (*hidden slides*).** Presentasi utama ±15 menit dan ringkas; siapkan banyak slide appendix berisi rumus, grafik detail, dan kutipan referensi untuk tanya jawab.
4. **Arahkan pertanyaan penguji** ke topik yang sudah dikuasai lewat cara menyusun materi.

## 7. Administratif

- Pak Dito meminta catatan bimbingan ditulis.
- Penulis menyerahkan nomor telepon untuk masuk grup WhatsApp bimbingan.

## 8. Gabungan Tindak Lanjut (Bu Nila + Pak Dito)

| # | Tugas | Sumber | Status |
|---|---|---|---|
| 1 | Telusuri pustaka asli untuk 4 metrik k6 (mulai dari Ismail dkk. 2023; Hanggara dkk. 2022; Oktafianto dkk. 2025) | Pak Dito, Bu Nila | 🔴 |
| 2 | Cari jurnal untuk metrik SLA breach / threshold | Bu Nila | 🔴 |
| 3 | Putuskan tingkat VU (100 / 100+500 / 100+500+1000) dan tulis alasannya di Batasan Masalah | Pak Dito | 🔴 |
| 4 | Rancang ulang dan jalankan load test k6 di PC fisik + LAN; catat spesifikasi server (OS, CPU, RAM) | Bu Nila, Pak Dito | 🔴 |
| 5 | Tambah monitoring RAM dan bandwidth selama k6 | Bu Nila | 🔴 |
| 6 | Tulis argumen pembatasan JPG & MP4 (+ sitasi) | Pak Dito | 🔴 |
| 7 | Catat versi Next.js 16.4.3 dan seluruh versi software di Batasan Masalah dan Alat dan Bahan | Pak Dito | 🔴 |
| 8 | Rombak Bab 1 dan Bab 3 | Kedua dosen | 🟡 sedang berjalan |
| 9 | Pahami arti setiap metrik/output k6 | Bu Nila | 🔴 |
| 10 | Perbarui `KETERBATASAN.md` setelah data PC fisik selesai | Bu Nila | 🔴 |
| 11 | Siapkan slide utama ringkas + slide cadangan untuk sidang | Pak Dito | ⬜ nanti |

---

**Terakhir diperbarui:** 9 November 2026

---

## Update 17 November 2026 (setelah bimbingan 2)

Server lokal (Moona) sudah dipakai untuk k6 100/500/1000 VU, lewat Wi-Fi (16 Nov) dan lewat kabel (17 Nov), lengkap dengan
monitoring RAM, bandwidth, dan CPU per proses node. Ringkasan: `results/ringkasan-k6-lokal.md`, `results/ringkasan-k6-kabel.md`,
catatan harian: `results/catatan-harian-2026-11-17.md`. Temuan: SSR dibatasi satu proses Node; SSG 500/1000 VU terbatas jaringan.
Item yang masih terbuka: pustaka 4 metrik k6 + jurnal SLA, argumen JPG/MP4, rombak Bab 1 dan 3, Bab 5, slide.
