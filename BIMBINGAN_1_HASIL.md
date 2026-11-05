# Hasil Bimbingan 1 — 5 November 2026

Dosen pembimbing: **Bu Nila**. Sumber: rekaman `bimbingan1skripsi.m4a` (disimpan di luar repo oleh penulis).

---

## 1. Ringkasan Pembukaan

- Pengerjaan baru dimulai sekitar Oktober–November, target selesai **Desember 2026**.
- Alasan perbandingan React (CSR) vs Next.js (SSR & SSG) dipaparkan ulang: *apple-to-apple*, membandingkan client-side vs server-side.
- Hasil kolokium sebelumnya: belum ada pemenang mutlak antar strategi. Ada masukan tambahan dari **Pak Dito** untuk menguji variasi beban media (gambar dan video) — ini origin variabel utama skripsi saat ini.

## 2. Desain Skenario Uji & Data Beban Media (dikonfirmasi, tidak ada revisi)

- 4 kondisi pengujian: React (CSR), Next.js (CSR), Next.js (SSR), Next.js (SSG).
- 3 tingkat beban: light, medium, heavy.
- Gambar: FakeStoreAPI → diunduh lokal → di-resize/compress per tier. Video: animasi zoom in/out dibuat mandiri.
- Total pengujian: ~180 kali. **Semua ini sudah sesuai dengan yang sudah dikerjakan — tidak ada revisi di bagian ini.**

## 3. ⚠️ TEGURAN — Justifikasi 4 Metrik Server (k6)

**Masalah:** metrik k6 (Response Time, Throughput, Error Rate, SLA/Threshold) disampaikan tanpa landasan literatur.

**Arahan Bu Nila:**
- Penentuan metrik tidak boleh berdasarkan keinginan pribadi tanpa teori.
- Wajib perbanyak literatur/jurnal pendukung bahwa keempat metrik ini standar baku pengujian performa server.
- Dosen penguji pasti akan tanya "kenapa harus 4 metrik ini?" — tanpa pustaka rujukan, penelitian dinilai tidak berdasar.

**Status: ✅ SUDAH DITEMUKAN** (lihat Bagian 7 di bawah — hasil riset literatur, semua sumber terverifikasi).

## 4. ⚠️ PERUBAHAN ARSITEKTUR — k6 pindah dari Vercel ke PC Fisik

**Masalah yang ditemukan:** load testing bertingkat (100/500/1000 VU) — 100 VU berhasil, tapi naik ke 500 VU akun Vercel langsung kena limitasi free tier.

**Solusi dari Bu Nila:**
- Jangan sewa VPS berbayar (keterbatasan biaya).
- Jangan pakai server kampus FTI (risiko merusak sistem kalau diserang beban tinggi).
- Gunakan **1 PC fisik** (PC Lab 2 kampus atau PC pribadi di rumah) sebagai server mandiri.
- Klien dan server PC dihubungkan dalam **1 jaringan lokal yang sama** (LAN/Wi-Fi).
- Keuntungan: kondisi lebih riil dan terukur, spesifikasi server (OS, CPU, RAM) bisa dicatat jelas di laporan.

**Konsekuensi penting:** kerangka "Keterbatasan #1: DDoS mitigation Vercel" di `KETERBATASAN.md` akan **obsolete** begitu pengujian PC fisik ini selesai dijalankan. Data k6 lama (`results/k6-valid/*.json`, 100VU tier light saja) kemungkinan perlu diulang di infrastruktur baru.

**Status: 🔴 BELUM DIKERJAKAN — prioritas setelah literatur selesai.**

## 5. Metrik Tambahan Wajib

- **RAM/memori server** selama diserang k6: apakah melonjak saat diserang, dan apakah turun lagi (atau tertahan = indikasi memory leak) setelah selesai.
- **Fluktuasi bandwidth jaringan** selama pengujian.

**Status: 🔴 BELUM DIKERJAKAN** — perlu script monitoring tambahan berjalan paralel dengan k6 saat pengujian PC-fisik nanti.

## 6. Hal-hal yang Dikonfirmasi TIDAK Perlu

- Perubahan OS klien (Windows → macOS) **tidak perlu dicatat**. Yang wajib didokumentasikan detail hanya **spesifikasi sisi server**.
- Upgrade Next.js ke 16.4.x karena security patch — **diperbolehkan**, cukup diperbarui di laporan, tidak perlu alasan tambahan.

## 7. Pesan Personal — Wajib Paham Alat Sendiri

Bu Nila melihat hasil uji dan menanyakan arti angka/grafik output k6 — penulis mengakui belum sepenuhnya paham. Pesan: karena skripsi ini membahas ranah teknis, **wajib memahami detail cara kerja dan metrik dari alat yang dipakai**. Jangan sampai tidak bisa menjelaskan data sendiri saat sidang.

Catatan tambahan dari sesi ini: saat bimbingan, pengujian 100 VU yang ditunjukkan ternyata baru mencakup **satu kondisi (SSR)**, belum 4 arsitektur — sehingga belum bisa ditarik kesimpulan apa pun saat itu. (Data lengkap 4 strategi di `results/k6-valid/` sudah ada di repo saat ini — perlu dicek ulang kapan file-file itu dihasilkan vs kondisi yang ditunjukkan saat bimbingan, supaya tidak ada salah tangkap soal mana yang sudah lengkap.)

## 8. Prioritas Tindak Lanjut (sesuai urutan Bu Nila)

1. ~~Cari literatur jurnal pendukung dasar 4 metrik server~~ ✅ **SELESAI** (lihat Bagian 9)
2. 🔴 Desain ulang & jalankan load testing k6 di PC fisik + LAN (gantikan Vercel untuk RQ3)
3. 🔴 Tambahkan monitoring RAM + bandwidth selama pengujian k6
4. 🔴 Pastikan benar-benar paham tiap metrik/output k6 sebelum sidang
5. 🔴 Perbarui `KETERBATASAN.md` setelah data PC-fisik selesai (hapus/revisi keterbatasan Vercel yang sudah tidak relevan)

---

## 9. Hasil Riset Literatur — 4 Metrik k6 (ditemukan 5 Nov 2026, semua terverifikasi via WebFetch)

| Metrik | Landasan akademik/standar | Landasan tool |
|---|---|---|
| Response Time | Menascé, Almeida, Dowdy (2004) *Performance by Design*, Prentice Hall, ISBN 978-0130906731 — Menascé, D.A., Almeida, V.A.F., Dowdy, L.W., 2004; ISO/IEC 25010:2011 (sub-karakteristik *Time Behaviour*, bagian Performance Efficiency) | k6 `http_req_duration` |
| Throughput | Sama seperti di atas; Google SRE Book — Beyer, B., Jones, C., Petoff, J., Murphy, N.R. (eds.), *Site Reliability Engineering*, Google, bab "Service Level Objectives" | k6 `http_reqs` rate |
| Error Rate | Google SRE Book (SLI); **RED Method** — Wilkie, T. (2015), dipresentasikan di Prometheus Meetup London (Rate, Errors, Duration) | k6 `http_req_failed` |
| SLA Breach Rate | Google SRE Book, konsep **SLO** (Service Level Objective) | k6 Thresholds — dokumentasi resmi: grafana.com/docs/k6/latest/using-k6/thresholds/ |

**Sumber tambahan (preseden lokal Indonesia):** Triawan, M.A., Husnawati, Joni M, A.B., Rahmatullah, R., Hidayatullah, B.A., Risky, M.G. (2026). "Benchmark Load Testing Multi Skenario Aplikasi SiPADUKA V2 pada Shared Hosting." *Jurnal Pengembangan Teknologi Informasi dan Komunikasi (JUPTIK)*, Vol. 4 No. 1. DOI: 10.52060/juptik.v4i1.4270 — memakai response time, throughput, dan error rate sebagai metrik utama load testing, dikonfirmasi aktif via WebFetch langsung ke DOI.

**Kerangka justifikasi (temuan terkuat):** keempat metrik memetakan rapi ke **RED Method** (Rate=throughput, Errors=error rate, Duration=response time) ditambah **SLO/threshold** dari SRE sebagai metrik ke-4 — bisa ditulis sebagai 1 kerangka utuh di Bab 2, bukan 4 argumen lepas.

**Draf paragraf Bab 2 (siap dipakai, tinggal diparafrasa dan disesuaikan gaya penulisan):**

> Pemilihan keempat metrik ini didasarkan pada kerangka RED Method (Rate, Errors, Duration) yang lazim digunakan dalam pengujian performa layanan berbasis request (Wilkie, 2015), yang sejalan dengan sub-karakteristik Time Behaviour pada standar ISO/IEC 25010 untuk response time dan throughput. Metrik error rate dan SLA breach rate mengacu pada konsep Service Level Indicator dan Service Level Objective sebagaimana didefinisikan dalam Google SRE Book, serta konsisten dengan mekanisme threshold yang disediakan k6 sebagai alat pengujian yang digunakan dalam penelitian ini.

**Catatan verifikasi:** seluruh sitasi di atas sudah dicek aksesnya (WebFetch langsung ke DOI/URL resmi) sebelum dicatat di sini — bukan hasil karangan. Sebelum dipakai di daftar pustaka final, tetap disarankan cek ulang format sitasi sesuai gaya selingkung (APA/IEEE, sesuai ketentuan UKDW).

---

**Terakhir diperbarui:** 5 November 2026
