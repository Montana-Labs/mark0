# Update Progres Bimbingan — 12 s.d. 26 November 2026

> **Untuk:** Bu Nila (teknis) dan Pak Dito (teori dan sitasi)
> **Judul:** Evaluasi Strategi Rendering React dan Next.js pada E-Commerce dengan Variasi Beban Media Menggunakan Core Web Vitals
> **Bimbingan sebelumnya:** Bu Nila 5 Nov (`BIMBINGAN_1_HASIL.md`), Pak Dito 9 Nov (`BIMBINGAN_2_HASIL.md`), catatan 19 Nov (`UPDATE_BIMBINGAN_3.md`)
> **Latihan demo testing:** `DEMO_TESTING.md`

---

## 0. Ringkasan satu menit (buka bimbingan dengan ini)

> "Bu, Pak, dua minggu ini saya mengerjakan tiga hal. **Pertama**, load test k6 sudah dipindah dari Vercel ke server fisik
> di jaringan lokal sesuai arahan Bu Nila, dan sudah dijalankan di **dua mesin**: laptop Pentium (Wi-Fi lalu kabel 100 Mbps)
> dan laptop Core i5 (kabel 1 Gbps), masing-masing 100, 500, dan 1000 VU untuk empat kondisi, sambil memantau CPU, RAM,
> bandwidth, dan CPU per proses Node. **Kedua**, semua metrik k6 dan ambang 3 detik sekarang punya rujukan jurnal hasil
> penelusuran sitasi sesuai saran Pak Dito, dan sudah masuk ke naskah. **Ketiga**, Bab 3, Bab 4, dan daftar keterbatasan
> diperbarui, termasuk mengoreksi tabel Lighthouse di Bab 4 yang ternyata masih memakai data lama."

---

## 1. Kronologi singkat

| Tanggal | Yang dikerjakan |
|---|---|
| 15 Nov | Runbook server lokal Windows (`LANGKAH_SERVER_WINDOWS.md`) |
| 16 Nov | Skrip k6 untuk server lokal (`scripts/run-k6-lokal.sh`) dan skrip monitoring (`scripts/monitor-server.ps1`); uji 100/500/1000 VU di laptop Pentium lewat Wi-Fi |
| 17 Nov | Ukur kapasitas jaringan dengan iperf3 (2,4 GHz → 5 GHz → kabel); ulang seluruh uji lewat kabel; tambah CPU per proses Node di monitoring |
| 17-19 Nov | Penelusuran pustaka metrik k6, ambang 3 detik, dan argumen JPG/MP4 (`PUSTAKA_DAN_ARGUMEN.md`) |
| 19-23 Nov | Bab 3, Bab 4, `KETERBATASAN.md` diperbarui dengan data server lokal; angka RQ3 diubah menjadi rasio kapasitas |
| 24 Nov | Tabel Lighthouse Bab 4 dibuat ulang dari `results/metrics.csv` (yang lama ternyata dari dataset rusak) |
| 24-25 Nov | Server kedua: laptop HP Core i5-8250U, kabel 1 Gbps; uji ulang 100/500/1000 VU, dengan Defender mati (data utama) dan menyala (pembanding) |
| 25 Nov | Sitasi baru dimasukkan ke naskah (`skripsi_2.docx`, highlight hijau); entri pustaka yang salah dikoreksi |

---

## 2. Apa yang BERUBAH

| # | Sebelumnya | Sekarang | Alasan |
|---|---|---|---|
| 1 | Load test di Vercel, hanya 100 VU | Server fisik di LAN, 100/500/1000 VU | Arahan Bu Nila; Vercel memblokir beban di atas 100 VU dan latensinya bercampur internet. Data Vercel tetap disimpan sebagai pembanding (`results/k6-valid/`) |
| 2 | Satu server | Dua server: Pentium N6000 (4 inti, 100 Mbps) dan Core i5-8250U (4 inti/8 thread, 1 Gbps) | Kabel 100 Mbps membatasi SSG; mesin kedua untuk membuktikan apakah batasnya di server atau di jaringan |
| 3 | Angka RQ3 dilaporkan sebagai "SSR 3,9x lebih lambat" (Vercel) | Dilaporkan sebagai **rasio kapasitas** (req/s) di server lokal; 3,9x hanya pembanding | Pada 500/1000 VU SSR mengantre, sehingga rasio waktu respons membengkak dan menyesatkan. Throughput lebih jujur menunjukkan batas server |
| 4 | Tabel Lighthouse Bab 4 dari draf lama | Dibuat ulang dari `results/metrics.csv` (180 run, throttling devtools) | Draf lama berasal dari dataset `simulate` yang rusak (LCP tidak valid) |
| 5 | Kruskal-Wallis dirujuk ke Anggraini (2024) | Makarim (2026) untuk definisi KW, Simatupang & Satriyawan (2026) untuk alur uji lengkap | Anggraini kurang relevan |
| 6 | Entri pustaka Haryono, Triawan, Lazuardy, Danutirta | Dikoreksi dari PDF aslinya (judul, penulis, halaman) | Ditemukan salah tulis saat verifikasi |

## 3. Apa yang DITAMBAHKAN

| # | Tambahan | Lokasi |
|---|---|---|
| 1 | Monitoring server per detik: CPU total, RAM, bandwidth masuk/keluar, koneksi TCP, **CPU proses Node tersibuk** (dan port-nya) | `scripts/monitor-server.ps1`, data di `results/monitor-*/` |
| 2 | Skrip uji otomatis: cek semua target 200 dulu, catat waktu mulai/selesai tiap uji (untuk dicocokkan dengan monitoring), lewati dan tandai bila server tumbang | `scripts/run-k6-lokal.sh` |
| 3 | Skrip satu-perintah untuk menyalakan server di Windows dan build ulang bila IP berubah | `scripts/moona/` |
| 4 | Pengukuran kapasitas jaringan (iperf3) sebelum uji | `results/kapasitas-jaringan.md` |
| 5 | Data k6 lengkap 4 kondisi x 3 level VU di **empat konfigurasi**: Pentium Wi-Fi, Pentium kabel, i5 gigabit (Defender mati), i5 gigabit (Defender menyala) | `results/k6-lokal/`, `k6-kabel/`, `k6-i5/`, `k6-i5-defender-on/` |
| 6 | Spesifikasi kedua server | `results/spesifikasi-server.txt`, `results/spesifikasi-server-i5.txt` |
| 7 | Sitasi jurnal untuk metrik k6, ambang 3 detik, rentang VU, dan JPG/MP4 | `PUSTAKA_DAN_ARGUMEN.md`, naskah (hijau) |
| 8 | Butir keterbatasan baru: 15 (SSG terbatas jaringan), 16 (satu mesin, satu proses Node, satu kali jalan), 17 (k6 hanya HTML, tier light) | `KETERBATASAN.md` |

---

## 4. Bagian untuk Bu Nila (teknis)

### 4.1 Lingkungan uji

| | Server 1 "Moona" | Server 2 (data utama) |
|---|---|---|
| CPU | Intel Pentium Silver N6000, 4 inti | Intel Core i5-8250U, 4 inti / 8 thread, turbo 3,4 GHz |
| RAM | 7,75 GB | 8 GB |
| Jaringan ke router | Wi-Fi 5 GHz (~75-80 Mbps), lalu kabel USB 100 Mbps (~93 Mbps iperf3) | Kabel LAN 1 Gbps |
| Software | Windows, Node, build produksi | Windows, Node v26.12.1, pnpm 11.1.2, commit 32c8983 |
| Layanan | middleware :4000, Next.js :3000 (`/csr`, `/ssg`, `/ssr`), React :5000 | sama |
| Klien | Mac M1, k6 | Mac M1, k6 v2.3.0, lewat Wi-Fi |

Semuanya build produksi (`next build` + `next start`, React `vite build` + `serve`), bukan mode dev.

### 4.2 Hasil utama — server i5, kabel 1 Gbps, Defender mati

| VU | Kondisi | Total req | req/s | Rata-rata | p95 | Maks | Error | SLA >3 d |
|---|---|---|---|---|---|---|---|---|
| 100 | CSR-React | 5.459 | 83 | 15 ms | 34 ms | 70 ms | 0% | 0% |
| 100 | CSR-Next | 5.490 | 83 | 9 ms | 27 ms | 67 ms | 0% | 0% |
| 100 | SSG-Next | 5.450 | 83 | 17 ms | 41 ms | 96 ms | 0% | 0% |
| 100 | SSR-Next | 5.342 | 81 | 38 ms | 79 ms | 131 ms | 0% | 0% |
| 500 | CSR-React | 26.488 | 402 | 47 ms | 126 ms | 184 ms | 0% | 0% |
| 500 | CSR-Next | 27.274 | 413 | 17 ms | 45 ms | 158 ms | 0% | 0% |
| 500 | SSG-Next ⚠️ | 12.688 | 138 | 1.182 ms | 3.039 ms | 60.000 ms | 0,02% | 5,15% |
| 500 | SSR-Next | 10.473 | 159 | 1.673 ms | 2.293 ms | 5.608 ms | 0% | 0,58% |
| 1000 | CSR-React | 48.953 | 742 | 133 ms | 321 ms | 451 ms | 0% | 0% |
| 1000 | CSR-Next | 53.432 | 812 | 38 ms | 90 ms | 196 ms | 0% | 0% |
| 1000 | SSG-Next ⚠️ | 12.706 | 134 | 3.389 ms | 9.316 ms | 60.002 ms | 0,51% | 36,11% |
| 1000 | SSR-Next | 10.729 | 157 | 4.350 ms | 8.940 ms | 22.975 ms | 0% | 70,58% |

⚠️ SSG 500/1000 VU tidak dibaca sebagai kapasitas server (lihat 4.4).

### 4.3 Pemantauan server selama uji (puncak per jendela uji)

| VU | Kondisi | CPU total | Proses Node tersibuk (% satu inti) | TX keluar | RAM terpakai | Koneksi TCP |
|---|---|---|---|---|---|---|
| 100 | SSR-Next | 18% | 82% (port 3000) | 41 Mbps | 5,2 GB | 144 |
| 500 | SSR-Next | 23% | **163%** (port 3000) | 103 Mbps | 5,3 GB | 942 |
| 1000 | SSR-Next | 26% | **176%** (port 3000) | 112 Mbps | 5,5 GB | 2.083 |
| 1000 | CSR-React | 21% | 117% (port 5000) | 7 Mbps | 5,5 GB | 1.024 |
| 1000 | CSR-Next | 17% | 77% (port 3000) | 67 Mbps | 5,1 GB | 1.020 |
| 500 | SSG-Next | 6% | 32% (port 3000) | 107 Mbps | 5,0 GB | 515 |
| 1000 | SSG-Next | 7% | 39% (port 3000) | 125 Mbps | 5,0 GB | 898 |

RAM sebelum uji 5,3 GB (Node 428 MB), setelah semua uji 5,0 GB (Node 440 MB): **kembali ke awal, tidak ada indikasi memory leak.**

### 4.4 Temuan dan cara membacanya

1. **SSR dibatasi CPU proses Node.** Throughput SSR mendatar di ~157-159 req/s pada 500 dan 1000 VU, sementara proses Next.js
   memakai 163-176% satu inti padahal CPU total hanya 23-26%. Artinya satu proses Node tidak bisa memakai semua inti untuk
   merender. Di Moona (CPU lebih lemah) batas yang sama terjadi di ~75 req/s, jadi polanya konsisten di dua mesin;
   angkanya mengikuti kekuatan satu inti.
2. **CSR paling ringan di server** karena server hanya mengirim berkas HTML statis kecil; rendering dipindah ke browser
   (biayanya terlihat di Lighthouse, bukan di k6). CSR-Next 812 req/s dan CSR-React 742 req/s pada 1000 VU, 0% SLA breach.
3. **Rasio kapasitas (RQ3).** Pada 1000 VU, CSR melayani **4,7-5,2x** lebih banyak permintaan per detik daripada SSR
   (742-812 vs 157). Pada 500 VU 2,5-2,6x. Pada 100 VU semuanya ~83 req/s karena itu batas desain skenario (lihat
   `DEMO_TESTING.md` bagian 3.3), jadi pada 100 VU yang dibandingkan adalah waktu respons: SSR 38 ms vs CSR 9-15 ms.
4. **SSG 500/1000 VU: hambatan di jalur klien, bukan server.** Server i5 hampir menganggur (CPU 6-7%, Node 32-39% satu inti,
   TX 125 Mbps dari kapasitas 1 Gbps) tetapi throughput hanya ~135 req/s dan ada permintaan yang tertahan sampai batas waktu
   k6 60 detik. Dokumen SSG berisi HTML lengkap (~49 KB, sedangkan CSR hanya kerangka kecil), sehingga yang jenuh diduga
   Wi-Fi/k6 di Mac. Di server Pentium kabel 100 Mbps, TX SSG menempel di 95-96 Mbps = kapasitas kabel. Dicatat sebagai
   keterbatasan (butir 15), bukan kemampuan server. **Jujur:** dugaan jalur klien belum terbukti penuh karena klien belum
   berkabel.
5. **Defender Windows memengaruhi hasil**: CSR-Next 1000 VU turun dari 812 menjadi 455 req/s saat Defender menyala. Karena itu
   dataset utama diambil dengan Defender dan Tamper Protection dimatikan sementara, lalu dinyalakan kembali. Data dengan
   Defender menyala disimpan sebagai pembanding.

### 4.5 Kendala teknis dan penyelesaiannya

| Kendala | Penyelesaian |
|---|---|
| Wi-Fi 2,4 GHz hanya ~30 Mbps | Pindah 5 GHz, lalu kabel, lalu server kedua gigabit |
| IP server tertanam di hasil build (Next.js dan React) | Skrip build ulang satu perintah; verifikasi dari Mac dengan `curl` sebelum uji |
| Profil jaringan Windows baru = Public, firewall hanya Private | Ubah ke Private |
| Monitoring awal membebani CPU yang diukur (~2 detik per putaran) | Ditulis ulang dengan PerformanceCounter; beban skrip 0,4-0,9% CPU, dicatat di kolom `monitor_cpu_pct` |
| Monitoring awal hanya CPU total, padahal CPU total rendah saat SSR lambat | Tambah CPU per proses Node; terbukti satu proses jenuh |
| Mac idle-sleep di tengah uji saat memakai baterai | Jalankan k6 dengan `caffeinate`, charger wajib tercolok |
| macOS membatasi 256 berkas terbuka (error "too many open files" di 500-1000 VU) | `ulimit -n 10240` di skrip |

---

## 5. Bagian untuk Pak Dito (teori dan sitasi)

Aturan yang saya pegang: **hanya jurnal**, dan hanya yang PDF/teksnya sudah saya buka sendiri. Penelusuran memakai trik
Bapak: buka daftar pustaka paper acuan, lalu kutip jurnal aslinya.

### 5.1 Peta "pilihan → rujukan"

| Pilihan dalam penelitian | Rujukan jurnal | Bentuk argumennya |
|---|---|---|
| Metrik k6: response time, throughput, error rate | Hermanto & Engel (2025), TIN 6(5), 450-463; Yuwono (2026), JITEK 6(1), 53-66; Triawan dkk. (2026), JUPTIK 4(1); Ismail dkk. (2023), JIP 9(2) | Metrik yang sama dipakai berulang dalam penelitian load testing aplikasi web |
| Pemantauan CPU, memori, bandwidth | Ismail dkk. (2023); Yuwono (2026); Annisa dkk. (2026), JAIC 10(1), 585-590 (bandwidth); Hanggara dkk. (2024), J-INTECH 12(1) (CPU, memori) | Permintaan Bu Nila didukung jurnal yang juga memantau sumber daya server |
| Level 100 / 500 / 1000 VU | Hermanto & Engel (2025): 250/500/1000 VU pada Next.js SSR; Yuwono (2026): 100-1000 pengguna, titik kritis 300-500; Annisa dkk. (2026): mencari titik jenuh server | Rentang VU mengikuti penelitian sejenis; tujuannya mencari titik jenuh, bukan meniru trafik nyata |
| Ambang SLA 3 detik | Yuwono (2026): respons <2-3 detik dianggap baik (mengutip Nielsen, 1993); ditopang eksperimen Nah (2004), BIT 23(3): ~2 detik, dan Galletta dkk. (2004), JAIS 5(1): penurunan mendatar mulai ~4 detik | 3 detik ditulis sebagai **ambang operasional** di antara dua temuan eksperimen, bukan angka baku |
| Uji Kruskal-Wallis | Makarim (2026), JATRI 4(1) (definisi); Simatupang & Satriyawan (2026), JITI 4(3), 493-506 (alur Shapiro-Wilk → Kruskal-Wallis → Mann-Whitney Bonferroni, epsilon-kuadrat) | Data tidak normal, jadi uji nonparametrik |
| Media hanya JPEG | Wallace (1992), IEEE Trans. Consumer Electronics 38(1) | Baseline JPEG metode yang paling banyak diimplementasikan |
| Media hanya MP4 (H.264) | Wiegand dkk. (2003), IEEE TCSVT 13(7), 560-576 | H.264/AVC dirancang untuk streaming dan jaringan, "network-friendly" |
| WebP/AVIF tidak dipakai | Yusuf (2025), INTECOMS 8(5) | Format modern memang lebih kecil; tidak dipakai agar variabel tetap satu (ukuran berkas), dicatat sebagai saran |

### 5.2 Argumen yang sudah ditulis di naskah

- **JPG dan MP4:** yang ingin diubah hanya *ukuran berkas media*, bukan algoritma kompresi. Mencampur format menambah variabel
  perancu. Video dikunci durasi 4 detik, 1280x720, 25 fps, gerakan sama; yang divariasikan hanya bitrate (menjawab poin Bapak
  bahwa gerakan konten memengaruhi ukuran).
- **Kenapa ukuran gambar tidak memengaruhi k6:** k6 hanya mengunduh dokumen HTML. Pengaruh media diukur oleh Lighthouse.
  Jadi k6 mengukur biaya membuat dokumen di server, Lighthouse mengukur pengalaman di browser.

### 5.3 Yang masih saya akui terbuka (jujur)

1. Belum ada jurnal yang **menamai** "SLA breach rate" sebagai metrik baku. Saya merumuskannya sebagai proporsi permintaan
   yang melampaui ambang waktu tunggu pengguna (turunan Yuwono, Nah, Galletta).
2. Sebagian besar jurnal acuan memakai **JMeter**, saya memakai **k6**. Alatnya berbeda, metriknya sama; ditulis begitu di Bab 2.
   Rujukan yang memakai k6: **Danutirta dkk. (2026)**, Simtek 11(2), 410-419 (sudah di naskah, untuk metrik waktu respons dan throughput).
3. Oktafianto dkk. (2025) dan Gunasekaran & Kannan (2012) belum bisa dibuka, jadi **tidak dikutip**.
4. Tiga sumber masih non-jurnal di daftar pustaka (APJII, Google web.dev, satu skripsi). Untuk sementara dipertahankan,
   menunggu pendapat Bapak.

---

## 6. Pertanyaan yang ingin saya ajukan

**Untuk Bu Nila**
1. Data utama Bab 4 saya ambil dari server i5 (gigabit), sedangkan data Pentium dipakai sebagai bukti bahwa pola SSR konsisten
   di dua mesin. Apakah susunan ini sudah tepat?
2. SSG 500/1000 VU terhambat di jalur klien (Mac lewat Wi-Fi). Cukup ditulis sebagai keterbatasan terbukti, atau perlu diulang
   dengan klien berkabel?
3. Setiap layanan berjalan sebagai satu proses Node (tanpa PM2/cluster). Apakah perlu ditambah satu uji SSR dengan cluster
   sebagai pembanding, atau cukup dicatat sebagai batasan?

**Untuk Pak Dito**
1. Ambang 3 detik ditulis sebagai ambang operasional dengan rujukan Yuwono (2026) yang mengutip Nielsen, ditopang Nah (2004)
   dan Galletta dkk. (2004). Apakah Nah dan Galletta (2004) boleh dipakai walau lebih dari 5 tahun, karena termasuk teori dasar?
2. Wallace (1992) dan Wiegand dkk. (2003) untuk JPEG/H.264 juga lama. Apakah boleh dianggap rujukan standar dasar?
3. Satu kali jalan per sel k6 (tanpa ulangan): apakah cukup karena polanya konsisten di dua mesin, atau perlu 3 kali ulangan?

---

## 7. Rencana berikutnya

1. ~~Masukkan data i5 ke naskah~~ (selesai 26 Nov: bagian 4.6, Tabel 4.14-4.16, ditandai hijau). Sisa: tulis
   `results/ringkasan-k6-i5.md` dan pembahasan Bab 4 yang membandingkan dengan penelitian terdahulu.
2. Perbarui `KETERBATASAN.md` butir 15-16 dengan temuan i5 (jalur klien, Defender).
3. Putuskan tiga sumber non-jurnal setelah bimbingan.
4. Tulis Bab 5.
5. Slide sidang ±15 menit + slide cadangan (rumus, tabel lengkap, kutipan rujukan).
6. Target pendaftaran pendadaran: **Desember 2026**.
